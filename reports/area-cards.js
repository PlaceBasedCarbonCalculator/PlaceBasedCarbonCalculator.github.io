// Adds the transport and retrofit report cards (every chart from each tool's
// popup modal) to an area-level report page (LA / ward / parish / constituency).
// The emissions (PBCC-equivalent) report is already provided by la-report.js.
//
// Requires window.REPORT_CONFIG.cardLevel = 'la' | 'ward' | 'parish' | 'constituency'
// and an ?id=<area code> query parameter. Uses the same generated report-card
// modules as the LSOA report (reports/cards/), pointed at the area-aggregated
// data via window.REPORT_CARD_ENDPOINTS.
(function () {
	'use strict';

	var cfg = window.REPORT_CONFIG || {};
	var level = cfg.cardLevel;
	var areaId = new URLSearchParams(window.location.search).get('id');
	if (!level || !areaId) { return; }

	// Redirect the report-card modules' data endpoints to the area aggregates.
	// Same JSON shapes as the per-LSOA data - see ../build/R/area_summaries.R.
	window.REPORT_CARD_ENDPOINTS = {
		'vehicle_summary/v1/': level + '_vehicle_summary/v1/',
		'PTfrequency/v2/': level + '_pt_frequency/v1/',
		'Access/': level + '_access/v1/',
		'epc_dom/v4/': level + '_epc_dom/v1/',
		'lsoa_gas_electric/v2/': level + '_gas_electric/v1/',
		// No area-level aggregation for house prices yet; the card degrades gracefully
		'prices/v1/': level + '_prices/v1/'
	};

	// Styles for the expandable tool sections (shared look with the LSOA report)
	var style = document.createElement('style');
	style.textContent = '.tool-section{border:1px solid #e2e2e2;border-radius:10px;padding:14px 16px 18px;margin:18px 0;}' +
		'.tool-head{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;}' +
		'.tool-head h3{margin:0;}.tool-head .card-tool-link{font-size:13px;white-space:nowrap;}' +
		'.expand-toggle{margin-top:8px;background:none;border:1px solid #ac1a40;color:#ac1a40;border-radius:6px;padding:7px 14px;cursor:pointer;font-size:14px;}' +
		'.expand-toggle:hover{background:#ac1a40;color:#fff;}' +
		'.tool-more[hidden]{display:none;}' +
		'.card-missing{color:#888;font-style:italic;padding:24px 0;}' +
		'.aggregation-note{color:#666;font-size:13px;font-style:italic;}';
	document.head.appendChild(style);

	function section(tool, title, note) {
		var el = document.createElement('section');
		el.className = 'tool-section';
		el.innerHTML =
			'<div class="tool-head"><h3>' + title + '</h3>' +
			'<a class="card-tool-link" href="/' + tool + '/">Open the ' + title + ' tool &rarr;</a></div>' +
			'<p class="card-note">' + note + '</p>' +
			'<button type="button" class="expand-toggle" data-target="' + tool + '-more" data-tool="' + tool + '">Show all ' + title.toLowerCase() + ' charts</button>' +
			'<div id="' + tool + '-more" class="tool-more" hidden>' +
			'<div class="fullcard-host" id="' + tool + '-fullcard-host"><p class="card-missing">Loading all charts&hellip;</p></div>' +
			'</div>';
		return el;
	}

	function init() {
		var container = document.querySelector('.content');
		if (!container) { return; }

		var wrap = document.createElement('div');

		// Locator map showing this area's boundary (hidden if data unavailable)
		var mapHeading = document.createElement('h2');
		mapHeading.textContent = 'Where is this?';
		var mapDiv = document.createElement('div');
		mapDiv.id = 'area-map';
		mapDiv.setAttribute('aria-label', 'Map showing the boundary of this area');
		mapDiv.style.cssText = 'height:300px;border:1px solid #e2e2e2;border-radius:10px;margin:8px 0 16px;';
		wrap.appendChild(mapHeading);
		wrap.appendChild(mapDiv);
		if (typeof capAreaMap !== 'undefined' && typeof capBin !== 'undefined') {
			// Area boundary now comes from the bounds_<level> bin (single binary
			// + range request) instead of one GeoJSON file per area.
			capAreaMap.initWithGeojson('area-map', capBin.fetchRecord('bounds_' + level, areaId))
				.then(function (map) {
					// Hide the heading too if the boundary could not be loaded
					if (!map) { mapHeading.style.display = 'none'; }
				});
		} else {
			mapHeading.style.display = 'none';
			mapDiv.style.display = 'none';
		}

		var heading = document.createElement('h2');
		heading.textContent = 'Transport and buildings in this area';
		var aggNote = document.createElement('p');
		aggNote.className = 'aggregation-note';
		aggNote.innerHTML = 'Area figures are aggregated from neighbourhood-level data: counts are summed, averages are weighted, and <b>medians are population/meter-weighted approximations</b>.';
		wrap.appendChild(heading);
		wrap.appendChild(aggNote);
		wrap.appendChild(section('transport', 'Transport', 'Vehicle ownership, public transport frequency, and accessibility for this area.'));
		wrap.appendChild(section('retrofit', 'Retrofit', 'Building energy use, EPC ratings, and housing stock for this area.'));
		container.appendChild(wrap);

		var loadedCards = {};
		function loadFullCard(tool) {
			if (loadedCards[tool]) { return; }
			loadedCards[tool] = true;
			var host = document.getElementById(tool + '-fullcard-host');
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
					var defaultBtn = document.getElementById(card.defaultOpen);
					if (defaultBtn) { defaultBtn.click(); }
					return card.load(areaId);
				})
				.catch(function (err) {
					console.warn('Full card failed for ' + tool + ':', err);
					host.innerHTML = '<p class="card-missing">Charts for this area are not available yet (the aggregated data may not have been published).</p>';
					loadedCards[tool] = false;
				});
		}

		wrap.querySelectorAll('.expand-toggle').forEach(function (btn) {
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
					btn.textContent = btn.dataset.orig;
				}
			});
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
