// Page driver for the four area report pages: reports/la.html, wards.html,
// parishes.html and constituencies.html. One script serves all four; each page
// says which level it is through window.REPORT_CONFIG, set inline just before
// this file is loaded:
//
//   cardLevel     'la' | 'ward' | 'parish' | 'constituency'
//   emissionsBin  the capBin dataset holding that level's emissions series
//   level         display name for the level ("Local Authority", "Ward", ...)
//   nameJson      [{id, name}, ...] lookup, used for the page title
//
// This is the area-level counterpart of the inline scripts in reports/lsoa.html
// and follows the same shape: three headline charts up front, with each tool's
// full report card fetched only when its section is expanded.
//
// It replaces an earlier version of this file that drove a different, older LA
// page. That version built its charts into elements none of these four pages
// contain (defaultOpen, population-chart, historical-chart, overview-chart), and
// because it called document.getElementById('defaultOpen').click() at parse time
// it threw a TypeError before it finished loading - so initPageWithLocation() was
// never even defined and the pages rendered nothing but their heading. Its chart
// code is not lost: it was a copy of what the generated reports/cards/pbcc-card.js
// draws, which these pages already load when a section is expanded. Its copies of
// switchChartTab() and modalTab() are likewise supplied by the card modules.
(function () {
	'use strict';

	var CFG = window.REPORT_CONFIG || {};
	var level = CFG.cardLevel || 'la';
	var levelName = CFG.level || 'Area';
	var emissionsBin = CFG.emissionsBin || (level + '_emissions');

	var titleEl = document.getElementById('report-title');
	var ledeEl = document.getElementById('report-lede');
	var errorEl = document.getElementById('report-error');
	var bodyEl = document.getElementById('report-body');

	function showError(msg) {
		if (!errorEl) { return; }
		errorEl.textContent = msg;
		errorEl.style.display = 'block';
	}

	function esc(s) {
		return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
			return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
		});
	}


	// =========================================================================
	// Data registration
	// =========================================================================

	// Emissions bins for all four levels (see js/databin.js). The whole set is
	// registered because one script serves all four pages; which one is read is
	// decided by REPORT_CONFIG.emissionsBin. These replace the old
	// pbcc-data/la_emissions/v2/ JSON folder, which only ever held local
	// authorities - so before this, a ward report showed its LA's figures.
	// la_emissions is always needed too: it carries the 'GB' national comparison
	// row used by the report cards at every level.
	if (typeof capBin === 'undefined') {
		showError('Sorry, this report could not be loaded. Please try again later.');
		return;
	}

	capBin.register({
		la_emissions: 'index_la_emissions_2026-08-29.json.gz',
		ward_emissions: 'index_ward_emissions_2026-09-02.json.gz',
		parish_emissions: 'index_parish_emissions_2026-09-02.json.gz',
		constituency_emissions: 'index_constituency_emissions_2026-08-29.json.gz'
	});

	// This level's other aggregate bins. Each dataset is rebuilt on its own
	// schedule, so the dates differ; bump one when that dataset is rebuilt and
	// re-uploaded.
	var dates = {
		access: '2026-09-02',
		pt_frequency: '2026-09-02',
		vehicle_summary: '2026-09-02',
		epc_dom: '2026-09-03',
		gas_electric: '2026-09-02',
		prices: '2026-09-02',
		population: '2026-09-02',
		community_pics: '2026-09-02'
	};

	var reg = {};
	Object.keys(dates).forEach(function (d) {
		reg[level + '_' + d] = 'index_' + level + '_' + d + '_' + dates[d] + '.json.gz';
	});
	capBin.register(reg);

	// The full tool cards these pages expand (reports/cards/*.js) default to the
	// old per-area JSON folders. Point every endpoint they can request at this
	// level's aggregate bin instead, the same mechanism reports/lsoa.html uses
	// for LSOAs. Keep this list complete: a card path with no entry falls through
	// to its built-in pbcc-data/ folder default and requests a file that does not
	// exist at this level.
	window.REPORT_CARD_ENDPOINTS = {
		// transport card
		'Access/': { bin: level + '_access' },
		'PTfrequency/v2/': { bin: level + '_pt_frequency' },
		'vehicle_summary/v1/': { bin: level + '_vehicle_summary' },
		// pbcc card. This level's own series stands in for the per-LSOA
		// historical_emission dataset; the 'GB' comparison row is always read
		// from la_emissions.
		'historical_emissions/v2/': { bin: level + '_emissions' },
		'la_emissions/v2/': { bin: 'la_emissions' },
		'population/': { bin: level + '_population' },
		'community_photo/v1/': { bin: level + '_community_pics' },
		// These four LSOA datasets have no area-level equivalent. The pen
		// portrait and the area classification describe a neighbourhood rather
		// than a whole local authority, and the council tax registers are only
		// aggregated to LSOA, so the build produces none of them at this level.
		// They are still mapped to a bin so the cards cannot fall back to a
		// per-area JSON folder; because none of these datasets is registered
		// above, capBin rejects the lookup immediately without any network
		// request. Each card handles that itself: the pbcc card drops the charts
		// that depend on the overview, and the retrofit card swaps its Dwelling
		// Stock charts for the "not available for this area" notes.
		'lsoa_overview/v1/': { bin: 'lsoa_overview' },
		'oac_emissions/v2/': { bin: 'oac_emissions' },
		'voa_2010/': { bin: 'voa_2010' },
		'voa_2020/': { bin: 'voa_2020' },
		// retrofit card
		'epc_dom/v4/': { bin: level + '_epc_dom' },
		'lsoa_gas_electric/v2/': { bin: level + '_gas_electric' },
		'prices/v1/': { bin: level + '_prices' }
		// postcode_energy/v2/ is never requested: the cards are always loaded
		// with the 'zones' layer (see reportCards.*.load).
	};


	// =========================================================================
	// Page
	// =========================================================================

	var params = new URLSearchParams(window.location.search);
	var id = params.get('id') || params.get('code');

	if (!id) {
		showError('No ' + levelName.toLowerCase() + ' was specified. ' +
			'Please search for one from the reports home page.');
		return;
	}

	// Area name for the title, from the same lookup the reports index searches.
	// A missing lookup is not fatal - the report still works, headed by the code.
	// The same row also carries `lad`, the code of the local authority this area
	// belongs to, which is what lets the report cards draw an authority
	// comparison line (see pbccCard_manageCharts). Wards and parishes nest inside
	// an authority so their parent is exact; a Westminster constituency can
	// straddle several, and `lad` is then the one holding most of its residents,
	// which is why the comparison is labelled with that authority's own name
	// rather than a bare "Local Authority".
	var pRow = CFG.nameJson
		? fetch(CFG.nameJson)
			.then(function (r) { return r.ok ? r.json() : []; })
			.then(function (rows) {
				return (rows || []).filter(function (row) { return row.id === id; })[0] || null;
			})
			.catch(function () { return null; })
		: Promise.resolve(null);

	// A local authority report needs no parent: comparing an authority with
	// itself would draw the same line twice, so `level === 'la'` supplies none
	// and the card leaves that comparison out altogether.
	var pName = pRow.then(function (row) { return row ? row.name : null; });
	var pParent = (level === 'la')
		? Promise.resolve(null)
		: Promise.all([pRow, fetch('/reports/la.json').then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; })])
			.then(function (res) {
				var row = res[0];
				if (!row || !row.lad) { return null; }
				var hit = (res[1] || []).filter(function (la) { return la.id === row.lad; })[0];
				return { code: row.lad, name: (hit ? hit.name : 'Local Authority') };
			})
			.catch(function () { return null; });

	// Population is only used to fill two context boxes, so a failure just
	// leaves them out rather than failing the page.
	var pPop = capBin.fetchRecord(level + '_population', id).catch(function () { return null; });

	Promise.all([pName, pPop, pParent]).then(function (results) {
		// Published before the cards are loaded, so the first card to build its
		// charts already knows which authority to compare against.
		window.REPORT_CARD_PARENT_LA = results[2];
		render(results[0], results[1]);
	});

	function render(name, pop) {
		var heading = (name ? esc(name) : esc(id));
		titleEl.textContent = heading;
		document.title = heading + ' - ' + levelName + ' report - Carbon & Place';

		// ONS codes carry the country in their first letter, which is the one
		// piece of context worth adding to the heading. The code itself goes in
		// the list below rather than the lede.
		var country = ({ E: 'England', W: 'Wales', S: 'Scotland' })[id.charAt(0)];
		ledeEl.textContent = name
			? (levelName + (country ? ' in ' + country : ''))
			: ('This ' + levelName.toLowerCase() + ' is identified by the ONS code ' + id + '.');

		// Context. There is no lookup from an area up to its parent areas on the
		// site, so this describes the area itself rather than linking outwards
		// the way the neighbourhood report's context list does.
		var context = [['Area type', levelName], ['ONS code', id]];
		if (pop && Array.isArray(pop.year) && pop.year.length) {
			var last = pop.year.length - 1;
			var total = 0;
			Object.keys(pop).forEach(function (k) {
				// Age bands are a04, a59, ... a8084 plus the open-ended '85+'
				if (/^a\d+$/.test(k) || k === '85+') {
					var a = pop[k];
					if (a && typeof a[last] === 'number') { total += a[last]; }
				}
			});
			var yr = pop.year[last];
			if (total > 0) {
				context.push(['Population (' + Math.round(yr) + ')', Math.round(total).toLocaleString()]);
			}
			var hh = pop.households_est;
			if (hh && typeof hh[last] === 'number') {
				context.push(['Households (' + Math.round(yr) + ')', Math.round(hh[last]).toLocaleString()]);
			}
		}
		var ctxHtml = '';
		context.forEach(function (row) {
			ctxHtml += '<li><span class="context-label">' + esc(row[0]) +
				'</span><span class="context-value">' + esc(row[1]) + '</span></li>';
		});
		document.getElementById('context-list').innerHTML = ctxHtml;

		// Locator map. The boundary comes from this level's bounds_* bin, which
		// reports/area-map.js registers; the map hides itself if it is missing.
		// The same fetch is reused below to zoom the tool links to this area.
		var pBoundaryGeojson = capBin.fetchRecord('bounds_' + level, id);
		if (typeof capAreaMap !== 'undefined') {
			capAreaMap.initWithGeojson('area-map', pBoundaryGeojson);
		}

		// Tool links. The ?report= deep link the neighbourhood report uses only
		// takes an LSOA/Data Zone code, not an area code, so these instead use
		// the map's own '#/layers/#zoom/lat/lng' hash (js/ui-common.js parseUrl()
		// / parseMapHash(), the same format the manual's "opentool" links use) to
		// turn on the neighbourhood ("zones") layer, where the tool has one, plus
		// the boundary layer matching this report's level, and centre the map on
		// the area once its extent is known (below).
		var BOUNDARY_LAYER = { la: 'la', ward: 'wards', parish: 'parish', constituency: 'westminster' };
		var boundaryLayer = BOUNDARY_LAYER[level];

		function toolHref(basePath, hasZones, geom) {
			var layers = hasZones ? ['zones'] : [];
			if (boundaryLayer) { layers.push(boundaryLayer); }
			if (!layers.length && !geom) { return basePath; }
			var mapPart = geom ? (geom.zoom + '/' + geom.center[1].toFixed(5) + '/' + geom.center[0].toFixed(5)) : '';
			return basePath + '#/' + layers.join(',') + '/#' + mapPart;
		}

		var tools = [
			['Place-Based Carbon Calculator', 'Carbon footprint and how it has changed', '/pbcc/', true],
			['Transport & Accessibility', 'Public transport, accessibility and vehicles', '/transport/', true],
			['Retrofit Explorer', 'Building energy performance and retrofit', '/retrofit/', true],
			['Land Use & Planning', 'How land is used around here', '/landuse/', false],
			['Land Ownership', 'Who owns land in this area', '/landownership/', false]
		];
		var toolHtml = '';
		tools.forEach(function (t) {
			toolHtml += '<li><a href="' + toolHref(t[2], t[3], null) + '" data-base="' + t[2] +
				'" data-zones="' + (t[3] ? '1' : '0') + '">' + esc(t[0]) + '<span>' + esc(t[1]) + '</span></a></li>';
		});
		document.getElementById('tool-links').innerHTML = toolHtml;

		// The three report-card "Open in <tool>" links (reports/la.html etc.)
		// all point at tools with a zones layer, so turn that layer on too.
		document.querySelectorAll('.card-tool-link').forEach(function (a) {
			a.setAttribute('href', toolHref(a.getAttribute('href'), true, null));
		});

		// Once the boundary geometry loads, upgrade every link above with a
		// centre point and zoom fitting this area (reports/area-map.js
		// boundsToZoom()). Left at the tool's default view if it fails to load.
		pBoundaryGeojson.then(function (geojson) {
			var bounds = capAreaMap && capAreaMap.geojsonBounds(geojson);
			if (!bounds) { return; }
			var geom = {
				center: [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2],
				zoom: capAreaMap.boundsToZoom(bounds)
			};
			document.querySelectorAll('#tool-links a[data-base]').forEach(function (a) {
				a.setAttribute('href', toolHref(a.dataset.base, a.dataset.zones === '1', geom));
			});
			document.querySelectorAll('.card-tool-link').forEach(function (a) {
				var base = a.getAttribute('href').split('#')[0];
				a.setAttribute('href', toolHref(base, true, geom));
			});
		}).catch(function () { /* locator map's own catch already logs this */ });

		bodyEl.style.display = 'block';

		if (typeof getCookie === 'function' && getCookie('analyticstrack') === 'true' && typeof gtag === 'function') {
			gtag('event', 'view_area_report', { 'level': level, 'area': id });
		}

		drawHighlights();
		wireExpandToggles();
	}


	// =========================================================================
	// Headline charts
	// =========================================================================

	function ctx(elId) {
		var c = document.getElementById(elId);
		return c ? c.getContext('2d') : null;
	}

	function markMissing(canvasId, message) {
		var canvas = document.getElementById(canvasId);
		if (!canvas) { return; }
		var note = document.createElement('p');
		note.className = 'card-missing';
		note.textContent = message || 'No data available for this area.';
		canvas.parentNode.replaceChild(note, canvas);
	}

	function lineOpts(yTitle) {
		return {
			responsive: true, maintainAspectRatio: false,
			plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } } },
			scales: { y: { beginAtZero: true, title: { display: true, text: yTitle } } }
		};
	}

	function stackedBarOpts(yTitle) {
		return {
			responsive: true, maintainAspectRatio: false,
			plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 10 } } } },
			scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, title: { display: true, text: yTitle } } }
		};
	}

	// The three headline datasets. The area-level bins carry the same fields as
	// the per-LSOA ones, so these are the same charts reports/lsoa.html draws.
	function drawHighlights() {
		capBin.fetchRecord(emissionsBin, id)
			.then(renderFootprint).catch(function () { markMissing('chart-footprint'); });
		capBin.fetchRecord(level + '_vehicle_summary', id)
			.then(renderVehicles).catch(function () { markMissing('chart-vehicles'); });
		capBin.fetchRecord(level + '_gas_electric', id)
			.then(renderEnergy).catch(function () { markMissing('chart-energy'); });
	}

	function renderFootprint(d) {
		if (!d || !d.year) { throw new Error('shape'); }
		var groups = {
			// Grouped as the pbcc report card's simplified overview groups them
			// (pbcc/ui.js, OVERVIEW_SIMPLIFIED_GROUPS), so a report page that
			// shows both charts files every category under the same heading in each.
			'Housing': ['dom_gas_kgco2e_percap', 'dom_elec_kgco2e_percap', 'heating_other_kgco2e_percap', 'housing_other_kgco2e_percap'],
			'Travel': ['car_kgco2e_percap', 'van_kgco2e_percap', 'company_bike_kgco2e_percap', 'transport_pt_kgco2e_percap', 'transport_vehiclepurchase_kgco2e_percap', 'transport_optranequip_other_kgco2e_percap'],
			'Flights': ['flights_kgco2e_percap'],
			'Food & drink': ['food_kgco2e_percap', 'alcohol_kgco2e_percap', 'restaurant_kgco2e_percap'],
			'Other goods & services': ['furnish_kgco2e_percap', 'clothing_kgco2e_percap', 'communication_kgco2e_percap', 'recreation_kgco2e_percap', 'health_kgco2e_percap', 'education_kgco2e_percap', 'misc_kgco2e_percap']
		};
		var colours = { 'Housing': '#e6550d', 'Travel': '#3182bd', 'Flights': '#756bb1', 'Food & drink': '#31a354', 'Other goods & services': '#969696' };
		var years = d.year;
		var datasets = Object.keys(groups).map(function (g) {
			var data = years.map(function (_, i) {
				var sum = 0;
				groups[g].forEach(function (f) { var a = d[f]; if (a && typeof a[i] === 'number') { sum += a[i]; } });
				return Math.round(sum / 1000 * 100) / 100;
			});
			return { label: g, data: data, backgroundColor: colours[g] };
		});
		new Chart(ctx('chart-footprint'), { type: 'bar', data: { labels: years, datasets: datasets }, options: stackedBarOpts('tCO2e per person') });
	}

	// The ownership rates divide the private vehicle count by ONS mid-year
	// population, adult population and modelled household counts. Those
	// denominators only run to 2024 for England and Wales and to 2022 for
	// Scotland, and the build writes a 0 for any year without one, which drew
	// the lines plunging to zero at the end of the series. Blank out those
	// years (a rate of zero in a year the area still has vehicles registered)
	// and trim the trailing years no series can fill, so each line stops at the
	// last year with a denominator instead of dropping off a cliff.
	function vehicleRateSeries(d) {
		var keys = ['vehiclesPPers', 'vehiclesPAdult', 'vehiclesPHousehold'];
		var labels = d.year;
		var vehicles = d.vehicles_PRIVATE || [];
		var out = {};
		keys.forEach(function (k) {
			var a = d[k] || [];
			out[k] = labels.map(function (_, i) {
				var v = a[i];
				if (typeof v !== 'number' || !isFinite(v)) { return null; }
				return (v === 0 && vehicles[i] > 0) ? null : v;
			});
		});
		var end = labels.length;
		while (end > 0 && keys.every(function (k) { return out[k][end - 1] === null; })) { end--; }
		out.labels = labels.slice(0, end);
		keys.forEach(function (k) { out[k] = out[k].slice(0, end); });
		return out;
	}

	function renderVehicles(d) {
		if (!d || !d.year) { throw new Error('shape'); }
		var r = vehicleRateSeries(d);
		new Chart(ctx('chart-vehicles'), {
			type: 'line',
			data: { labels: r.labels, datasets: [
				{ label: 'Per person', data: r.vehiclesPPers, borderColor: '#07c220', backgroundColor: '#07c220' },
				{ label: 'Per adult', data: r.vehiclesPAdult, borderColor: '#0042f7', backgroundColor: '#0042f7' },
				{ label: 'Per household', data: r.vehiclesPHousehold, borderColor: '#f50c0c', backgroundColor: '#f50c0c' }
			] },
			options: lineOpts('Vehicles')
		});
	}

	function renderEnergy(d) {
		if (!d || !d.year) { throw new Error('shape'); }
		new Chart(ctx('chart-energy'), {
			type: 'line',
			data: { labels: d.year, datasets: [
				{ label: 'Gas (mean kWh)', data: d.mean_gas_kwh, borderColor: '#e6550d', backgroundColor: '#e6550d' },
				{ label: 'Electricity (mean kWh)', data: d.mean_elec_kwh, borderColor: '#3182bd', backgroundColor: '#3182bd' }
			] },
			options: lineOpts('kWh per meter')
		});
	}


	// =========================================================================
	// Expandable detail: each tool's real report card
	// =========================================================================

	function wireExpandToggles() {
		document.querySelectorAll('.expand-toggle').forEach(function (btn) {
			btn.addEventListener('click', function () {
				var target = document.getElementById(btn.dataset.target);
				if (!target) { return; }
				if (target.hasAttribute('hidden')) {
					if (!btn.dataset.orig) { btn.dataset.orig = btn.textContent; }
					target.removeAttribute('hidden');
					btn.textContent = 'Hide charts';
					loadFullCard(btn.dataset.tool);
				} else {
					target.setAttribute('hidden', '');
					btn.textContent = btn.dataset.orig || 'Show all charts';
				}
			});
		});
	}

	// On first expand, fetch the tool's report-card fragment (every chart from
	// the tool's popup modal) plus its generated chart module, then load the
	// data. The card reads this level's bins via REPORT_CARD_ENDPOINTS above.
	var loadedCards = {};
	function loadFullCard(tool) {
		if (loadedCards[tool]) { return; }
		loadedCards[tool] = true;
		var host = document.getElementById(tool + '-fullcard-host');
		if (!host) { return; }
		fetch('/reports/cards/' + tool + '-card.html')
			.then(function (r) { if (!r.ok) { throw new Error('fragment'); } return r.text(); })
			.then(function (html) {
				host.innerHTML = html;
				return new Promise(function (resolve, reject) {
					var s = document.createElement('script');
					s.src = '/reports/cards/' + tool + '-card.js';
					s.onload = resolve;
					s.onerror = reject;
					document.body.appendChild(s);
				});
			})
			.then(function () {
				var card = window.reportCards && window.reportCards[tool];
				if (!card) { throw new Error('module'); }
				if (tool === 'pbcc') { hideLsoaOnlyPbccBlocks(host); }
				// Open the card's default tab, then load the data and build all charts
				var defaultBtn = document.getElementById(card.defaultOpen);
				if (defaultBtn) { defaultBtn.click(); }
				return card.load(id);
			})
			.catch(function (err) {
				console.warn('Full card failed for ' + tool + ':', err);
				host.innerHTML = '<p class="card-missing">Sorry, the full chart set could not be loaded. ' +
					'<a href="/' + tool + '/">Open the ' + tool + ' tool instead</a>.</p>';
				loadedCards[tool] = false; // allow retry on next expand
			});
	}

	// Two blocks in the pbcc card's Demographics tab describe a single
	// neighbourhood and have no meaning above it: the "LSOA Characteristics"
	// table (that LSOA's admin areas and its 2011 area classification) and the
	// ONS pen portrait of that classification. Both are filled from the
	// lsoa_overview record, which does not exist at this level, so left in place
	// they render a table of NAs under an LSOA heading and a pen portrait whose
	// headings still read "Supergroup Description" / "Subgroup Description".
	// Remove them rather than hiding them, so nothing can reveal them later.
	//
	// The card is a generated copy of the tool's modal (see README), so the two
	// ids are declared in pbcc/index.html as well; keep them there or a
	// regenerated card silently stops matching here.
	function hideLsoaOnlyPbccBlocks(host) {
		['lsoa-characteristics', 'lsoa-penportrait'].forEach(function (blockId) {
			var el = (host || document).querySelector('#' + blockId);
			if (el && el.parentNode) { el.parentNode.removeChild(el); }
		});
	}
}());
