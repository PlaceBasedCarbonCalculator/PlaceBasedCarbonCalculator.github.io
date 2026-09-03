// Locator map for report pages: shows the boundary of the reported area on a
// small non-interactive basemap. Lazily loads MapLibre GL + the pmtiles
// protocol (same pinned versions as the map tools) only when a map is actually
// initialised, so report pages stay light when the boundary data is missing.
//
// Usage: capAreaMap.init('area-map', 'https://.../bounds_lsoa/v1/E01000001.geojson')
// The container is hidden if the boundary file cannot be loaded.
const capAreaMap = (function () {

	'use strict';

	// Single-binary boundary datasets (see js/databin.js). The report pages have
	// no per-tool datasets.js, so the boundary index file names are recorded here
	// - the one module every report page that draws a locator map loads. The
	// matching data_*.bin is named inside each index (meta.bin_file). Bump a file
	// name when that boundary set is rebuilt and re-uploaded.
	if (typeof capBin !== 'undefined') {
		capBin.register({
			bounds_lsoa: 'index_bounds_lsoa_2026-07-14.json.gz',
			bounds_ward: 'index_bounds_ward_2026-07-14.json.gz',
			bounds_parish: 'index_bounds_parish_2026-07-14.json.gz',
			bounds_constituency: 'index_bounds_constituency_2026-07-14.json.gz',
			bounds_la: 'index_bounds_la_2026-07-14.json.gz'
		});
	}

	const MAPLIBRE_MJS = 'https://unpkg.com/maplibre-gl@6.4.1/dist/maplibre-gl.mjs';
	const MAPLIBRE_CSS = 'https://unpkg.com/maplibre-gl@6.4.1/dist/maplibre-gl.css';
	const PMTILES_JS = 'https://unpkg.com/pmtiles@4.5.0/dist/pmtiles.js';

	let _depsPromise = null;

	function loadScript(src) {
		return new Promise(function (resolve, reject) {
			const s = document.createElement('script');
			s.src = src;
			s.onload = resolve;
			s.onerror = reject;
			document.head.appendChild(s);
		});
	}

	function loadDeps() {
		if (_depsPromise) { return _depsPromise; }
		_depsPromise = Promise.resolve()
			.then(function () {
				if (!document.querySelector('link[href="' + MAPLIBRE_CSS + '"]')) {
					const l = document.createElement('link');
					l.rel = 'stylesheet';
					l.href = MAPLIBRE_CSS;
					document.head.appendChild(l);
				}
				// MapLibre 6 is ESM-only, so it is pulled in with a dynamic import
				// rather than a <script> tag, and the namespace is published as the
				// global the code below expects (copied, as a namespace is frozen).
				if (typeof maplibregl !== 'undefined') { return null; }
				return import(MAPLIBRE_MJS).then(function (module) {
					window.maplibregl = {...module};
				});
			})
			.then(function () {
				return (typeof pmtiles === 'undefined') ? loadScript(PMTILES_JS) : null;
			})
			.then(function () {
				// Register the pmtiles protocol once (the basemap style uses pmtiles:// sources)
				if (!window._capAreaMapProtocol) {
					window._capAreaMapProtocol = new pmtiles.Protocol();
					maplibregl.addProtocol('pmtiles', window._capAreaMapProtocol.tile);
				}
			});
		return _depsPromise;
	}

	// Recursively collect [lng, lat] positions from any GeoJSON geometry
	function collectBounds(coords, bounds) {
		if (typeof coords[0] === 'number') {
			bounds[0] = Math.min(bounds[0], coords[0]);
			bounds[1] = Math.min(bounds[1], coords[1]);
			bounds[2] = Math.max(bounds[2], coords[0]);
			bounds[3] = Math.max(bounds[3], coords[1]);
			return;
		}
		coords.forEach(function (c) { collectBounds(c, bounds); });
	}

	function geojsonBounds(geojson) {
		const bounds = [Infinity, Infinity, -Infinity, -Infinity];
		const features = (geojson.type === 'FeatureCollection' ? geojson.features : [geojson]);
		features.forEach(function (f) {
			const geom = (f.type === 'Feature' ? f.geometry : f);
			if (geom && geom.coordinates) { collectBounds(geom.coordinates, bounds); }
		});
		return (bounds[0] === Infinity ? null : bounds);
	}

	function init(containerId, geojsonUrl) {
		return initWithGeojson(containerId, fetch(geojsonUrl)
			.then(function (r) { if (!r.ok) { throw new Error('HTTP ' + r.status); } return r.json(); }));
	}

	// Render a locator map from a GeoJSON object (or a promise of one). Used by
	// the report cards, which fetch the area boundary from the bounds_<level>
	// bin (single binary + range request) via capBin rather than a per-area file.
	function initWithGeojson(containerId, geojsonOrPromise) {
		const container = document.getElementById(containerId);
		if (!container) { return Promise.resolve(null); }

		return Promise.resolve(geojsonOrPromise)
			.then(function (geojson) {
				const bounds = geojsonBounds(geojson);
				if (!bounds) { throw new Error('no geometry'); }
				return loadDeps().then(function () {
					const map = new maplibregl.Map({
						container: containerId,
						style: '/tiles/style_greyscale_nobuild.json',
						bounds: [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
						fitBoundsOptions: { padding: 30 },
						interactive: false,
						attributionControl: false
					});
					map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
					map.on('load', function () {
						map.addSource('reportarea', { type: 'geojson', data: geojson });
						map.addLayer({
							id: 'reportarea-fill',
							type: 'fill',
							source: 'reportarea',
							paint: { 'fill-color': '#ac1a40', 'fill-opacity': 0.12 }
						});
						map.addLayer({
							id: 'reportarea-line',
							type: 'line',
							source: 'reportarea',
							paint: { 'line-color': '#ac1a40', 'line-width': 2.5 }
						});
					});
					return map;
				});
			})
			.catch(function (err) {
				// Boundary not available (e.g. data not yet published): hide the map slot
				console.warn('Area map unavailable:', err);
				container.style.display = 'none';
				return null;
			});
	}

	// Rough MapLibre zoom level that fits [minLng,minLat,maxLng,maxLat] in a
	// typical map viewport. Used to build "Open in <tool>" deep links
	// (la-report.js) that land the tool's map on this report's area, since the
	// actual container size on the destination page isn't known at link-build
	// time - this assumes a generous desktop viewport and pads the fit, so an
	// area reads slightly under-zoomed rather than cropped at the edges.
	function boundsToZoom(bounds) {
		var VIEWPORT = { width: 900, height: 650 };
		var WORLD = 256;
		var PADDING = 0.85;

		function latRad(lat) {
			var sin = Math.sin(lat * Math.PI / 180);
			var rad = Math.log((1 + sin) / (1 - sin)) / 2;
			return Math.max(Math.min(rad, Math.PI), -Math.PI) / 2;
		}
		function zoomFor(px, worldPx, fraction) {
			if (fraction <= 0) { return 18; }
			return Math.log(px / worldPx / fraction) / Math.LN2;
		}

		var latFraction = (latRad(bounds[3]) - latRad(bounds[1])) / Math.PI;
		var lngDiff = bounds[2] - bounds[0];
		var lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

		var z = Math.min(
			zoomFor(VIEWPORT.height, WORLD, latFraction),
			zoomFor(VIEWPORT.width, WORLD, lngFraction)
		);
		z += Math.log(PADDING) / Math.LN2;
		return Math.max(3, Math.min(15, Math.floor(z)));
	}

	return { init: init, initWithGeojson: initWithGeojson, geojsonBounds: geojsonBounds, boundsToZoom: boundsToZoom };

}());
