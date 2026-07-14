// Carbon & Place guided tour
// A lightweight, dependency-free "spotlight" tutorial for the map tools. It
// dims the page, highlights one UI element at a time and explains it, with
// Back / Next / Skip controls. The tour is strictly optional: it only runs
// when started (from the welcome screen button or the layer-controls link),
// never automatically, and it does not change any map or layer state.
//
// Public API:
//   capTour.start(steps?)  - start the tour (default steps cover the shared UI)
//   capTour.end()          - dismiss the tour
const capTour = (function () {

	'use strict';

	let _steps = [];
	let _index = 0;
	let _els = null;	// {overlay, spotlight, popover}

	// Default steps: these reference the shared UI that every map tool has via
	// js/ui-common.js. Steps whose element is missing or hidden are skipped
	// automatically, so tool differences are handled gracefully. The wording
	// adapts to whether this tool has clickable neighbourhood reports (PBCC,
	// transport, retrofit) or feature popups instead (land use, land ownership).
	function defaultSteps() {
		const hasReports = !!document.getElementById('zones-chartsmodal');
		const mapText = (hasReports
			? 'Drag to pan and scroll to zoom. The map colours each neighbourhood by the measure you have selected. <b>Click any neighbourhood</b> to open a detailed report about it.'
			: 'Drag to pan and scroll to zoom. <b>Click items on the map</b> to see more information about them.');
		const finalText = (hasReports
			? 'The web address updates as you explore, capturing your position, layers and any open report. Copy it to share exactly what you are looking at. That\'s it: click a neighbourhood to get started!'
			: 'The web address updates as you explore, capturing your position and layers. Copy it to share exactly what you are looking at. That\'s it: turn on a layer to get started!');
		return [
			{
				element: null,
				title: 'Welcome to the tour',
				text: 'This quick tour points out the main controls. You can leave at any time with the Skip button or the Escape key; nothing on the map will change.'
			},
			{
				element: '#map',
				title: 'The map',
				text: mapText
			},
			{
				element: '.maplibregl-ctrl-geocoder',
				title: 'Search',
				text: 'Use the magnifying glass to search for a place name or postcode and jump straight there.'
			},
			{
				element: '#rightbox',
				title: 'Layer controls',
				text: 'This panel controls what the map shows. Tick a layer to display it, and use the drop-down menus to change which measure colours the map. Sections expand and collapse when clicked.'
			},
			{
				element: 'select.updatelayer[name="field"]',
				title: 'Choose a measure',
				text: 'This menu changes what the map colours mean; the legend below it updates to match.'
			},
			{
				element: '.helpbutton',
				title: 'Help buttons',
				text: 'Every option has a <b>?</b> button that opens a short explanation from the manual, so you never need to guess what something means.'
			},
			{
				element: 'img.basemap',
				title: 'Basemap',
				text: 'Change the background map style here, including satellite imagery and historical Ordnance Survey maps.'
			},
			{
				element: null,
				title: 'Sharing what you find',
				text: finalText
			}
		];
	}

	function build() {
		if (_els) { return; }
		const overlay = document.createElement('div');
		overlay.className = 'tour-overlay';
		const spotlight = document.createElement('div');
		spotlight.className = 'tour-spotlight';
		const popover = document.createElement('div');
		popover.className = 'tour-popover';
		popover.setAttribute('role', 'dialog');
		popover.setAttribute('aria-label', 'Guided tour');
		document.body.appendChild(overlay);
		document.body.appendChild(spotlight);
		document.body.appendChild(popover);
		_els = { overlay: overlay, spotlight: spotlight, popover: popover };
		window.addEventListener('resize', reposition);
		document.addEventListener('keyup', onKey);
	}

	function onKey(e) {
		if (!_els) { return; }
		if (e.key === 'Escape') { end(true); }
		if (e.key === 'ArrowRight') { next(); }
		if (e.key === 'ArrowLeft') { back(); }
	}

	function targetFor(step) {
		if (!step.element) { return null; }
		const el = document.querySelector(step.element);
		if (!el) { return null; }
		const rect = el.getBoundingClientRect();
		if (rect.width === 0 && rect.height === 0) { return null; }	// hidden
		return el;
	}

	function show(index, direction) {
		if (index < 0) { index = 0; }
		if (index >= _steps.length) { end(false); return; }
		const step = _steps[index];
		const target = targetFor(step);
		// Skip steps whose element is absent/hidden in this tool
		if (step.element && !target) {
			show(index + (direction < 0 ? -1 : 1), direction);
			return;
		}
		_index = index;
		render(step, target);
	}

	function render(step, target) {
		const spotlight = _els.spotlight;
		const popover = _els.popover;

		// Spotlight
		if (target) {
			const pad = 6;
			const r = target.getBoundingClientRect();
			spotlight.style.display = 'block';
			spotlight.style.left = (r.left - pad) + 'px';
			spotlight.style.top = (r.top - pad) + 'px';
			spotlight.style.width = (r.width + pad * 2) + 'px';
			spotlight.style.height = (r.height + pad * 2) + 'px';
		} else {
			spotlight.style.display = 'none';
		}

		// Popover content
		const isLast = (_index === _steps.length - 1);
		popover.innerHTML =
			'<h3>' + step.title + '</h3>' +
			'<p>' + step.text + '</p>' +
			'<div class="tour-controls">' +
				'<span class="tour-count">' + (_index + 1) + ' / ' + _steps.length + '</span>' +
				'<button type="button" class="tour-back"' + (_index === 0 ? ' disabled' : '') + '>Back</button>' +
				'<button type="button" class="tour-next">' + (isLast ? 'Finish' : 'Next') + '</button>' +
				'<button type="button" class="tour-skip">Skip tour</button>' +
			'</div>';
		popover.querySelector('.tour-back').addEventListener('click', back);
		popover.querySelector('.tour-next').addEventListener('click', next);
		popover.querySelector('.tour-skip').addEventListener('click', function () { end(true); });

		// Position the popover near the target (below, else above), or centred
		popover.style.display = 'block';
		const pw = popover.offsetWidth;
		const ph = popover.offsetHeight;
		if (target) {
			const r = target.getBoundingClientRect();
			let top = r.bottom + 14;
			if (top + ph > window.innerHeight - 10) { top = Math.max(10, r.top - ph - 14); }
			let left = Math.min(Math.max(10, r.left), window.innerWidth - pw - 10);
			popover.style.top = top + 'px';
			popover.style.left = left + 'px';
		} else {
			popover.style.top = Math.max(10, (window.innerHeight - ph) / 2) + 'px';
			popover.style.left = Math.max(10, (window.innerWidth - pw) / 2) + 'px';
		}
	}

	function reposition() {
		if (_els && _els.popover.style.display === 'block') {
			render(_steps[_index], targetFor(_steps[_index]));
		}
	}

	function next() { show(_index + 1, 1); }
	function back() { show(_index - 1, -1); }

	function track(action) {
		if (typeof capUi !== 'undefined' && typeof capUi.trackEvent === 'function') {
			capUi.trackEvent(action, { 'step': _index + 1 });
		}
	}

	function start(steps) {
		_steps = (steps && steps.length ? steps : defaultSteps());
		build();
		_els.overlay.style.display = 'block';
		track('tour_start');
		show(0, 1);
	}

	function end(skipped) {
		if (!_els) { return; }
		_els.overlay.style.display = 'none';
		_els.spotlight.style.display = 'none';
		_els.popover.style.display = 'none';
		track(skipped ? 'tour_skip' : 'tour_complete');
	}

	// Offer a restart point inside the layer controls box, so the tour can be
	// retaken after the welcome screen has been dismissed. Styled to match the
	// tour button on the welcome splash.
	function addRestartLink() {
		const box = document.getElementById('rightbox');
		if (!box || box.querySelector('.tour-restart')) { return; }
		const p = document.createElement('p');
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'welcome-tour-button tour-restart';
		btn.innerHTML = '<i class="fa fa-compass" aria-hidden="true"></i> Take a quick tour';
		btn.addEventListener('click', function (e) {
			e.preventDefault();
			start();
		});
		p.appendChild(btn);
		box.appendChild(p);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', addRestartLink);
	} else {
		addRestartLink();
	}

	return { start: start, end: end };

}());
