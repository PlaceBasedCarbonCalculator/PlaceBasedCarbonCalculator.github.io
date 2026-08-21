// Shared engine for the area-level report pages (la.html, wards.html,
// parishes.html, constituencies.html). Mirrors the structure of the LSOA
// report (lsoa.html): highlight charts render immediately, and a "Show all
// charts" button lazily loads the tool's full report card (see cards/).
//
// Configured per page via window.REPORT_CONFIG:
//   cardLevel  'la' | 'ward' | 'parish' | 'constituency' - used for capBin
//              dataset names (<cardLevel>_emissions/_vehicle_summary/...)
//   level      display name, e.g. 'Local Authority'
//   nameJson   '/reports/la.json' etc - the id -> name lookup for the title
//   emissionsBin  the capBin dataset holding the per-capita emissions series
//              for this level (<cardLevel>_emissions) - see README.
(function () {
	'use strict';

	var cfg = window.REPORT_CONFIG || {};
	var level = cfg.cardLevel;
	var areaId = new URLSearchParams(window.location.search).get('id');

	var titleEl = document.getElementById('report-title');
	var ledeEl = document.getElementById('report-lede');
	var errorEl = document.getElementById('report-error');
	var bodyEl = document.getElementById('report-body');

	function showError(msg) {
		errorEl.textContent = msg;
		errorEl.style.display = 'block';
	}

	function esc(s) {
		return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
			return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
		});
	}

	if (!level || !areaId) {
		showError('No area was specified. Please search for an area on the reports page.');
		return;
	}

	// The area-aggregated datasets are published as single-binary bins (see
	// js/databin.js), never as per-area JSON folders. Register the current index
	// file name for every level; only the current page's level is ever fetched,
	// so the unused registrations cost nothing.
	if (typeof capBin !== 'undefined') {
		capBin.register({
			// la_emissions also carries the 'GB' national comparison row used by
			// the pbcc card. It replaces the pbcc-data/la_emissions/v2/ folder,
			// which was never rebuilt past 2020.
			la_emissions: 'index_la_emissions_2026-08-08.json.gz',
			parish_emissions: 'index_parish_emissions_2026-07-13.json.gz',
			ward_emissions: 'index_ward_emissions_2026-07-15.json.gz',
			constituency_emissions: 'index_constituency_emissions_2026-07-15.json.gz',

			// Area-level population estimates, aggregated from the per-LSOA
			// population by build/R/area_summaries.R (agg_area_population). Bump
			// these date-stamps to match the deployed data_<level>_population_*.bin
			// files when the area_population_json target is rebuilt.
			la_population: 'index_la_population_2026-07-24.json.gz',
			ward_population: 'index_ward_population_2026-07-24.json.gz',
			parish_population: 'index_parish_population_2026-07-24.json.gz',
			constituency_population: 'index_constituency_population_2026-07-24.json.gz',

			// Area-level community photos: per-LSOA household archetypes summed to
			// each area, then run through the same picture allocation
			// (build/R/family_portraits.R, agg_area_household_pics). Bump these
			// date-stamps when the area_household_pics_json target is rebuilt.
			la_community_pics: 'index_la_community_pics_2026-07-24.json.gz',
			ward_community_pics: 'index_ward_community_pics_2026-07-24.json.gz',
			parish_community_pics: 'index_parish_community_pics_2026-07-24.json.gz',
			constituency_community_pics: 'index_constituency_community_pics_2026-07-24.json.gz',

			la_access: 'index_la_access_2026-08-08.json.gz',
			la_pt_frequency: 'index_la_pt_frequency_2026-08-10.json.gz',
			la_vehicle_summary: 'index_la_vehicle_summary_2026-08-08.json.gz',
			la_epc_dom: 'index_la_epc_dom_2026-08-08.json.gz',
			la_gas_electric: 'index_la_gas_electric_2026-08-08.json.gz',
			la_prices: 'index_la_prices_2026-08-08.json.gz',
			ward_access: 'index_ward_access_2026-08-08.json.gz',
			ward_pt_frequency: 'index_ward_pt_frequency_2026-08-10.json.gz',
			ward_vehicle_summary: 'index_ward_vehicle_summary_2026-08-08.json.gz',
			ward_epc_dom: 'index_ward_epc_dom_2026-08-08.json.gz',
			ward_gas_electric: 'index_ward_gas_electric_2026-08-08.json.gz',
			ward_prices: 'index_ward_prices_2026-08-08.json.gz',
			parish_access: 'index_parish_access_2026-08-08.json.gz',
			parish_pt_frequency: 'index_parish_pt_frequency_2026-08-10.json.gz',
			parish_vehicle_summary: 'index_parish_vehicle_summary_2026-08-08.json.gz',
			parish_epc_dom: 'index_parish_epc_dom_2026-08-08.json.gz',
			parish_gas_electric: 'index_parish_gas_electric_2026-08-08.json.gz',
			parish_prices: 'index_parish_prices_2026-08-08.json.gz',
			constituency_access: 'index_constituency_access_2026-08-08.json.gz',
			constituency_pt_frequency: 'index_constituency_pt_frequency_2026-08-10.json.gz',
			constituency_vehicle_summary: 'index_constituency_vehicle_summary_2026-08-08.json.gz',
			constituency_epc_dom: 'index_constituency_epc_dom_2026-08-08.json.gz',
			constituency_gas_electric: 'index_constituency_gas_electric_2026-08-08.json.gz',
			constituency_prices: 'index_constituency_prices_2026-08-08.json.gz'
		});
	}

	// Redirect the report-card modules' data endpoints (see cards/*.js) to the
	// area aggregates - same JSON shapes as the per-LSOA data, produced by
	// ../build/R/area_summaries.R. The { bin: ... } form routes through capBin
	// (registered above); a plain string would be a pbcc-data folder path
	// override, but every level is published as a bin now.
	window.REPORT_CARD_ENDPOINTS = {
		'historical_emissions/v2/': { bin: cfg.emissionsBin || (level + '_emissions') },
		// The pbcc card's GB comparison row, whatever level this page reports on
		'la_emissions/v2/': { bin: 'la_emissions' },
		'vehicle_summary/v1/': { bin: level + '_vehicle_summary' },
		'PTfrequency/v2/': { bin: level + '_pt_frequency' },
		'Access/': { bin: level + '_access' },
		'epc_dom/v4/': { bin: level + '_epc_dom' },
		'lsoa_gas_electric/v2/': { bin: level + '_gas_electric' },
		'prices/v1/': { bin: level + '_prices' },
		// Population and community photo both have area-level aggregates.
		// lsoa_overview/oac_emissions do not (they describe a single
		// neighbourhood/classification), so the pbcc card's LSOA-classification
		// blocks are hidden after load - see hideLsoaOnlyPbccBlocks().
		'population/': { bin: level + '_population' },
		'community_photo/v1/': { bin: level + '_community_pics' }
	};

	fetch(cfg.nameJson)
		.then(function (r) { if (!r.ok) { throw new Error('names'); } return r.json(); })
		.then(function (list) {
			var match = Array.isArray(list) ? list.find(function (x) { return x.id === areaId; }) : null;
			render(match ? match.name : areaId);
		})
		.catch(function () { render(areaId); });

	function render(name) {
		// .textContent/document.title are plain text (no HTML parsing), so use
		// the raw name here - esc() is only for the innerHTML strings below.
		var heading = name + ' - ' + cfg.level + ' Report';
		titleEl.textContent = heading;
		document.title = heading + ' - Carbon & Place';
		ledeEl.textContent = 'This is the Carbon & Place report for ' + name + ' (' + cfg.level + ').';

		var ctxHtml =
			'<li><span class="context-label">Area type</span><span class="context-value">' + esc(cfg.level) + '</span></li>' +
			'<li><span class="context-label">ONS code</span><span class="context-value">' + esc(areaId) + '</span></li>';
		document.getElementById('context-list').innerHTML = ctxHtml;

		// Locator map showing this area's boundary (hidden if unavailable).
		// Boundary comes from the bounds_<level> bin (single binary + range request).
		if (typeof capAreaMap !== 'undefined' && typeof capBin !== 'undefined') {
			capAreaMap.initWithGeojson('area-map', capBin.fetchRecord('bounds_' + level, areaId));
		}

		// Tool links. Areas larger than an LSOA have no ?report= deep link
		// support in the tools yet, so these just open the tool's map.
		var tools = [
			['Place-Based Carbon Calculator', 'Carbon footprint and how it has changed', '/pbcc/'],
			['Transport & Accessibility', 'Public transport, accessibility and vehicles', '/transport/'],
			['Retrofit Explorer', 'Building energy performance and retrofit', '/retrofit/'],
			['Land Use & Planning', 'How land is used around here', '/landuse/'],
			['Land Ownership', 'Who owns land in this area', '/landownership/']
		];
		var toolHtml = '';
		tools.forEach(function (t) {
			toolHtml += '<li><a href="' + t[2] + '">' + esc(t[0]) + '<span>' + esc(t[1]) + '</span></a></li>';
		});
		document.getElementById('tool-links').innerHTML = toolHtml;

		bodyEl.style.display = 'block';

		if (typeof getCookie === 'function' && getCookie('analyticstrack') === 'true' && typeof gtag === 'function') {
			gtag('event', 'view_area_report', { 'level': level, 'id': areaId });
		}

		loadHighlights();
	}

	// ---------- Highlights (same chart-building logic as lsoa.html) ----------

	function ctx(id) { var c = document.getElementById(id); return c ? c.getContext('2d') : null; }
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

	function loadHighlights() {
		var emissionsPromise = capBin.fetchRecord(cfg.emissionsBin || (level + '_emissions'), areaId);

		emissionsPromise.then(renderFootprint).catch(function () {
			markMissing('chart-footprint', 'Carbon footprint data is not yet available for this area.');
			showDataNote('The detailed carbon footprint data for this area is not available yet. Other sections on this page may still work.');
		});

		capBin.fetchRecord(level + '_vehicle_summary', areaId).then(renderVehicles).catch(function () { markMissing('chart-vehicles'); });
		capBin.fetchRecord(level + '_gas_electric', areaId).then(renderEnergy).catch(function () { markMissing('chart-energy'); });
	}

	function showDataNote(msg) {
		var wrap = document.getElementById('report-warnings-wrap');
		var el = document.getElementById('report-warnings');
		if (!wrap || !el) { return; }
		el.textContent = msg;
		wrap.style.display = 'block';
	}

	function renderFootprint(d) {
		if (!d || !d.year) { throw new Error('shape'); }
		var groups = {
			'Home energy': ['dom_gas_kgco2e_percap', 'dom_elec_kgco2e_percap', 'heating_other_kgco2e_percap'],
			'Travel': ['car_kgco2e_percap', 'van_kgco2e_percap', 'company_bike_kgco2e_percap', 'transport_pt_kgco2e_percap', 'transport_vehiclepurchase_kgco2e_percap', 'transport_optranequip_other_kgco2e_percap'],
			'Flights': ['flights_kgco2e_percap'],
			'Food & drink': ['food_kgco2e_percap', 'alcohol_kgco2e_percap', 'restaurant_kgco2e_percap'],
			'Other goods & services': ['housing_other_kgco2e_percap', 'furnish_kgco2e_percap', 'clothing_kgco2e_percap', 'communication_kgco2e_percap', 'recreation_kgco2e_percap', 'health_kgco2e_percap', 'education_kgco2e_percap', 'misc_kgco2e_percap']
		};
		var colours = { 'Home energy': '#e6550d', 'Travel': '#3182bd', 'Flights': '#756bb1', 'Food & drink': '#31a354', 'Other goods & services': '#969696' };
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

	function renderVehicles(d) {
		if (!d || !d.year) { throw new Error('shape'); }
		new Chart(ctx('chart-vehicles'), {
			type: 'line',
			data: { labels: d.year, datasets: [
				{ label: 'Per person', data: d.vehiclesPPers, borderColor: '#07c220', backgroundColor: '#07c220' },
				{ label: 'Per adult', data: d.vehiclesPAdult, borderColor: '#0042f7', backgroundColor: '#0042f7' },
				{ label: 'Per household', data: d.vehiclesPHousehold, borderColor: '#f50c0c', backgroundColor: '#f50c0c' }
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

	// ---------- Expandable detail: each tool's real report card ----------
	// On first expand, fetch the tool's report-card fragment (every chart from
	// the tool's popup modal) plus its generated chart module, then load data
	// via REPORT_CARD_ENDPOINTS (registered above) - identical mechanism to
	// the LSOA report (lsoa.html), see reports/README.md.
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

	// The pbcc report card's LSOA-classification blocks (characteristics table,
	// ONS pen portrait) describe a single neighbourhood's 2011 classification and
	// have no area-level equivalent, so hide them on area reports. The community
	// photo and population chart in the same tab do have area aggregates and stay.
	function hideLsoaOnlyPbccBlocks(host) {
		host.querySelectorAll('#demographics .chart-wrapper').forEach(function (wrap) {
			var h = wrap.querySelector('h4');
			if (h && (/LSOA Characteristics/i.test(h.textContent) || /pen portrait/i.test(h.textContent))) {
				wrap.style.display = 'none';
			}
		});
	}

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
				if (tool === 'pbcc') { hideLsoaOnlyPbccBlocks(host); }
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
				var defaultBtn = document.getElementById(card.defaultOpen);
				if (defaultBtn) { defaultBtn.click(); }
				return card.load(areaId);
			})
			.catch(function (err) {
				console.warn('Full card failed for ' + tool + ':', err);
				host.innerHTML = '<p class="card-missing">Sorry, the full chart set could not be loaded. The aggregated data for this area may not have been published yet, or <a href="/' + tool + '/">open the ' + tool + ' tool instead</a>.</p>';
				loadedCards[tool] = false; // allow retry on next expand
			});
	}
})();
