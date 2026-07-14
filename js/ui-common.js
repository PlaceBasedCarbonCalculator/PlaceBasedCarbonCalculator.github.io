// Carbon & Place Common  UI implementation code
// Shared Map UI, each map also has its own ui.js

/*jslint browser: true, white: true, single: true, for: true, unordered: true, long: true */
/*global alert, console, window, maplibregl, pmtiles, MaplibreGeocoder, noUiSlider, tippy */

/* Expectations in HTML:

- Layer toggles, to enable/disable a layer by a checkbox:
	Should be as follows, specifying the layerId in the data attribute, e.g.:
	<input type="checkbox" class="showlayer" data-layer="foo">
	
- Layer attributes, to set values for a layer:
	Should be as follows, specifying the layerId in the data attribute, and a name for the field, e.g.:
	<select name="purpose" class="updatelayer" data-layer="rnet" aria-label="Route network trip purpose">
	
- Slider UI:
	Sliders should have .slider-styled, with a name for the field, and an ID that matches a datalist name, e.g.:
	<div id="slider-gradient-ui" class="slider-styled" data-name="gradient"></div>
	<datalist name="slider-gradient-ui">...</datalist>
	<input type="hidden" name="gradient" class="updatelayer slider" data-layer="foo" />
	
- Modal dialogs:
	Modals should be defined as a <template> with an id ending -modal, include an X in a span.modal-close
	
- Popups:
	Popups should be defined as a <template> with an id ending -popup
	They should have placeholders like {some_field} which will be matched to the data properties
	Predefined placeholders {_streetViewUrl} and {_osmUrl} can be used for links to these services
	
- Help buttons:
	Help buttons should have .helpbutton and a data-help="..." value which matches a comment marker
	The comment marker in the .md file should be added around the relevant lines to be displayed, e.g.:
	<!-- #scenario -->...<!-- /#scenario -->
*/

const capUi = (function () {
	
	'use strict';
	
	
	// Settings
	let _settings = {};		// Will be populated by constructor
	let _datasets = {};		// Will be populated by constructor
	let _map;
	let _hashComponents = {layers: '/', map: ''};
	let _reportModals = {};			// Registry of report (chart) modal handles by map layer id, for programmatic opening
	let _lsoaCentroids = null;		// Lazily-loaded LSOA/Data Zone centroid lookup {code: [lng, lat]}
	let _reportDeepLinkHandled = false;	// Ensures a ?report= deep link is only auto-opened once
	
	// Functions
	return {
		
		// Main function
		initialise: function (settings, datasets)
		{
			console.log("Initialise UI function");
			// Populate the settings and datasets class properties
			_settings = settings;
			_datasets = datasets;
			
			// Create welcome screen
			capUi.welcomeScreen ();
			
			// Enable the accordion functionality for the layer controls box and popups
			capUi.accordion ();
			
			// Layer controls box UI
			capUi.layerControlsBoxUi ();
			
			// General GUI topnav function
			capUi.topnav ();
			
			// Parse URL hash state
			capUi.parseUrl ();
			
			// Create the map UI
			_map = capUi.createMap ();
			
			// Create popups
			capUi.createPopups ();
			
			// Create charts for the defined map layers
			capUi.charts ();
			
			// Handler for help buttons which have a data-help attribute indicating there is a manual section
			capUi.handleHelpButtons ();
			
			// Tooltip support
			capUi.tooltips ();
			
			// UI specialised function callback, if defined
			if (typeof _settings.uiCallback === 'function') {
				_settings.uiCallback ();
			}
			
			// Manage analytics cookie setting
	  		capUi.manageAnalyticsCookie ();

			// Manage layers
			capUi.manageLayers ();
			
			// Adjust opentool links to use current map state
			capUi.adjustOpenToolLinks ();

			// Setup print button handlers
			capUi.initPrintButtons ();
		},
		
		// Accessor for the MapLibre map handle, so tool-specific code (e.g. the
		// transport isochrones) can attach its own sources, layers and handlers
		getMap: function ()
		{
			return _map;
		},

		// Welcome screen
		welcomeScreen: function ()
		{
			// Show only first time
			//const cookieName = 'welcomescreen';
			//if (capUi.getCookie (cookieName)) {return;}
			
			// Create modal
			const welcomeModal = capUi.newModal ('welcome-modal');
			// Do not show the welcome splash when the page is opened directly to a
			// report (?report=...), so the report is not hidden behind the modal.
			// Tools without popup reports never carry this parameter, so they are
			// unaffected.
			if (!capUi.parseReportParam ()) {
				welcomeModal.show ();
			}

			// Set OSM and update dates in the text, if present
			/*
			if (document.getElementById ('osmupdatedate')) {
				document.getElementById ('osmupdatedate').innerHTML = _settings.osmDate;
			}
			*/
			if (document.getElementById ('updatedate')) {
				document.getElementById ('updatedate').innerText = capUi.formatAsUKDate (document.lastModified);
			}

			// Offer the optional guided tour from the welcome screen, if available
			const modalBody = document.querySelector ('#welcome-modal .modal-body');
			if (typeof capTour !== 'undefined' && modalBody && !modalBody.querySelector ('.welcome-tour-button')) {
				const tourButton = document.createElement ('button');
				tourButton.type = 'button';
				tourButton.className = 'welcome-tour-button';
				tourButton.innerHTML = '<i class="fa fa-compass" aria-hidden="true"></i> New here? Take a quick tour';
				tourButton.addEventListener ('click', function () {
					welcomeModal.hide ();
					capTour.start ();
				});
				const firstPara = modalBody.querySelector ('h1');
				if (firstPara && firstPara.nextSibling) {
					firstPara.parentNode.insertBefore (tourButton, firstPara.nextSibling);
				} else {
					modalBody.appendChild (tourButton);
				}
			}
			
			// Set cookie
			//capUi.setCookie (cookieName, 'true');
		},

		// Modal print buttons
		initPrintButtons:function () {
			const printButtons = document.querySelectorAll('.print-button');
			
			printButtons.forEach(function(button) {
				button.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				// Simply trigger the print dialog - CSS handles the rest
				window.print();
				});
			});
		},

		// Function to manage an accordion
		accordion: function ()
		{
			// Listen for accordion clicks, on a late-bound basis
			document.addEventListener('click', function (e) {
				if (e.target.classList.contains('accordion')) {
					const button = e.target;
					
					// Toggle between adding and removing the 'active' class, to highlight the button that controls the panel
					button.classList.toggle('active');
					
					// Toggle between hiding and showing the active panel
					const panel = button.nextElementSibling;
					panel.style.display = (panel.style.display == 'block' ? 'none' : 'block');
				}
			});
		},	

		// Expand accordion panels that contain any checked layer checkboxes
		expandAccordionsForCheckedLayers: function ()
		{
			// For each accordion button, open it if its following panel contains a checked .showlayer input
			document.querySelectorAll('button.accordion').forEach(function (button) {
				const panel = button.nextElementSibling;
				if (!panel) { return; }
				// If any checked layer checkbox exists inside this panel, open the accordion
				if (panel.querySelector('input.showlayer:checked')) {
					button.classList.add('active');
					panel.style.display = 'block';
				}
			});
		},
		
		
		// Function to manage the layer controls box UI
		layerControlsBoxUi: function ()
		{
			// Show the layer controls box
			showlayercontrols(true);

			// Auto-open a section if required
			if (document.getElementById('autoopen')) {
				document.getElementById('autoopen').click ();
			}
			
			// Show layer control box when button clicked on
			document.querySelector('#showrightbox button').addEventListener('click', function () {
				showlayercontrols(true);
			});
			
			// Close layer control box when X clicked on
			document.querySelector('#rightbox button.close-button').addEventListener('click', function () {
				showlayercontrols(false);
			});
			
			/* Show and hide UI */
			function showlayercontrols(show)
			{
				// Toggle box
				const box = document.getElementById ('rightbox');
				box.style.display = (show ? 'block' : 'none');
				
				const boxbutton = document.getElementById ('showrightbox');
				boxbutton.style.display = (show ? 'none' : 'block');
			}
		},
		
		
		// Main menu responsive display
		topnav: function ()
		{
			document.getElementById ('expandtopnav').addEventListener ('click', function (e) {
				const nav = document.querySelector ('nav');
				if (!nav.classList.contains ('responsive')) {
					nav.classList.add ('responsive');
				} else {
					nav.classList.remove ('responsive');
				}
				e.preventDefault ();
			});
		},
		
		// Function to parse the URL hash state

		parseUrl: function ()
		{
			console.log ("Parsing URL");
			// Get the hash, e.g. "/layer1,layer2/#8/55.953/-3.138" would be extracted from https://example.com/#/layer1,layer2/#8/55.953/-3.138
			const hash = window.location.hash.replace (/^#/, '');
			// Split path component from map compoment
			const hashComponents = hash.split ('#');
			// End if not the intended format of /layers/#map , thus retaining the default state of the _hashComponents property
			if (hashComponents.length != 2) {return;}
			// Register the change in the state.  The map component may include optional tilt and basemap
			// Expected map format: zoom/lat/lng[/tilt[/basemap]]
			_hashComponents.layers = hashComponents[0];
			_hashComponents.map = hashComponents[1];
			
			
		},

		// Function to register a state change, adjusting the URL
		registerUrlStateChange: function (component, value)
		{
			// Update the registry
			_hashComponents[component] = value;
			
			//console.log (_hashComponents);
			// Construct the new hash state Note: _hashComponents.map is expected to include a leading '#' (see manageMapHash.mapHash)
			const hashState = '#' + _hashComponents.layers + _hashComponents.map;

			// Update the hash state in the browser history
			const location = window.location.href.replace (/(#.+)?$/, hashState);	// Does correctly work from the first hash onwards (when multiple)
			window.history.replaceState (window.history.state, null, location);

		},
		
		// Function to set up the map UI and controls
		createMap: function ()
		{
			console.log("Create map function");
			
			// Create the layer switcher
			capUi.layerSwitcherHtml ();
			
			// Manage anti-aliasing
			capUi.antiAliasing ();
			
			// Determine initial centre/zoom location, based on the hash if present, else the settings location
			const initialPosition = (capUi.parseMapHash () || _settings.initialPosition);
			// If the hash contained a basemap choice, ensure the radio is selected so getBasemapStyle() matches
			let initialBasemap = capUi.getBasemapStyle();
			if (initialPosition && initialPosition.basemap) {
				initialBasemap = initialPosition.basemap;
				const basemapInput = document.getElementById(initialBasemap + '-basemap');
				if (basemapInput) { basemapInput.checked = true; }
			}
			
			// Main map setup - include bearing and pitch if provided in the parsed hash
			const map = new maplibregl.Map({
				container: 'map',
				style: '/tiles/style_' + initialBasemap + '.json',
				center: initialPosition.center,
				zoom: initialPosition.zoom,
				pitch: (initialPosition && initialPosition.pitch ? initialPosition.pitch : 0),
				bearing: (initialPosition && initialPosition.bearing ? initialPosition.bearing : 0),
				maxZoom: _settings.maxZoom,
				minZoom: _settings.minZoom,
				maxPitch: 85,
				hash: false,	// Emulating the hash manually for now; see layerStateUrl
				attributionControl: false, // Created manually below
				antialias: document.getElementById('antialiascheckbox').checked
			});
			
			// Manage Sky
			map.on('load', function () {
				map.setSky({
					"sky-color": "#00a2ff",
					"sky-horizon-blend": 0.2,
					"horizon-color": "#e3fbfc",
					"horizon-fog-blend": 0.5,
					"fog-color": "#e3fbfc",
					"fog-ground-blend": 0.99
				});
			});
			
			
			// Manage hash manually, while we need full control of hashes to contain layer state
			capUi.manageMapHash (map);
			
			// pmtiles
			let protocol = new pmtiles.Protocol();
			maplibregl.addProtocol('pmtiles', protocol.tile);
			
			// Add geocoder control; see: https://github.com/maplibre/maplibre-gl-geocoder/blob/main/API.md
			map.addControl (new MaplibreGeocoder(
				capUi.geocoderApi (), {
					maplibregl: maplibregl,
					collapsed: true,
					marker: false,
					flyTo: {
						// #!# Ideally should be bounds: ... but this requires using .on and then result, which means bigger changes
						zoom: 13
					}
				}
			), 'top-left');
			
			// Add +/- buttons
			map.addControl(new maplibregl.NavigationControl(), 'top-left');
			
			// Add terrain control
			
			map.addControl(new maplibregl.TerrainControl({
				source: 'terrainSource',

				exaggeration: 1//,
				//redFactor: 0.1,
				//greenFactor: 0.1,
				//blueFactor: 0.1,
				//baseShift: -10000,
				//encoding : "custom"
				
			}), 'top-left');
				
			// Add placenames support
			map.once('idle', function () {
				capUi.placenames(map);
			});
			
			// Add geolocation control
			map.addControl(new maplibregl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true
				},
				trackUserLocation: true
			}), 'top-left');
			
			// Add full-screen control
			map.addControl(new maplibregl.FullscreenControl(), 'top-left');
			
			// Add basemap change control
			class BasemapButton {
				onAdd(map) {
					const div = document.createElement('div');
					div.className = 'maplibregl-ctrl maplibregl-ctrl-group';
					div.innerHTML = '<button aria-label="Change basemap"><img src="/images/ui/basemaps/basemap.svg" alt="Change basemap" width="25" height="25" class="basemap" title="Change basemap" style="padding:5px"/></button>';
					div.addEventListener('contextmenu', (e) => e.preventDefault());
					div.addEventListener('click', function () {
						const box = document.getElementById('basemapcontrol');
						box.style.display = (window.getComputedStyle(box).display == 'none' ? 'block' : 'none');
					});
					return div;
				}
			}
			map.addControl(new BasemapButton(), 'top-left');
			
			
			
			// Add attribution
			map.addControl(new maplibregl.AttributionControl({
				compact: true,
				customAttribution: 'Contains <a href="https://osdatahub.os.uk/downloads/open/OpenZoomstack">OS data</a> © Crown copyright 2024, © <a href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9">ESRI</a>, © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, © <a href="https://www.thunderforest.com/terms/">Thunderforest</a>, © <a href="http://maps.nls.uk/projects/subscription-api/">National Library of Scotland</a>'
			}), 'bottom-left');
			
			// Antialias reload
			document.getElementById('antialiascheckbox').addEventListener('click', function () {
				location.reload();
			});
			
			// Add scale
			map.addControl(new maplibregl.ScaleControl({
				maxWidth: 80,
				unit: 'metric'
			}), 'bottom-left');

			// Add buildings; note that the style/colouring may be subsequently altered by data layers
			console.log("Adding buildings on initial load");
			capUi.addBuildings(map);
						
			document.getElementById('basemapform').addEventListener('change', function (e) {
			  console.log("basemapform changed, add buildings");
				capUi.addBuildings(map);
			});
			
			// Fire map ready when ready, which layer-enabling can be picked up
			map.once('idle', function () {
				document.dispatchEvent(new Event('@map/ready', {
					'bubbles': true
				}));
				
			});
			
			// Change map and reload state on basemap change
			document.getElementById('basemapform').addEventListener('change', function () {
				const styleName = capUi.getBasemapStyle();
				const styleCurrent = map.getStyle().name;
				if (styleCurrent == styleName) {
					return;
				}
				console.log('Restyling from ' + styleCurrent + ' to ' + styleName);
				map.setStyle('/tiles/style_' + styleName + '.json');
				
				// Fire map ready event when ready
				map.once('idle', function () {
					// Update the URL to include current bearing, pitch and basemap
					const center = map.getCenter();
					const zoom = Math.round(map.getZoom() * 100) / 100;
					const precision = Math.ceil((zoom * Math.LN2 + Math.log(512 / 360 / 0.5)) / Math.LN10);
					const m = Math.pow(10, precision);
					const lng = Math.round(center.lng * m) / m;
					const lat = Math.round(center.lat * m) / m;
					const bearing = Math.round(map.getBearing() * 10) / 10;
					const tilt = Math.round(map.getPitch() * 10) / 10;
					const mapHash = `#${zoom}/${lat}/${lng}/${bearing}/${tilt}/${styleName}`;
					capUi.registerUrlStateChange('map', mapHash);
					document.dispatchEvent(new Event('@map/ready', {
						'bubbles': true
					}));
				});
			});
			
			// Return the map handle
			return map;
		},
		
		// Function to manage the map hash manually; this covers zoom,lat,lng,bearing,pitch and basemap
		// Hash format produced: #zoom/lat/lng/bearing/pitch/basemap
		// Backwards-compatible parsing of legacy hashes (which may omit bearing)
		// Based on the native implementation at: https://github.com/maplibre/maplibre-gl-js/blob/main/src/ui/hash.ts#L11

		manageMapHash: function (map)
		{
			
			console.log("Manage map hash function");
			// Function to determine the map hash
			function mapHash (map)
			{
				// Assemble the map hash from the map position
				const center = map.getCenter ();
				const zoom = Math.round (map.getZoom () * 100) / 100;
				// derived from equation: 512px * 2^z / 360 / 10^d < 0.5px
				const precision = Math.ceil ((zoom * Math.LN2 + Math.log (512 / 360 / 0.5)) / Math.LN10);
				const m = Math.pow (10, precision);
				const lng = Math.round (center.lng * m) / m;
				const lat = Math.round (center.lat * m) / m;
				const bearing = Math.round(map.getBearing() * 10) / 10;
				const tilt = Math.round(map.getPitch() * 10) / 10;
				const basemap = capUi.getBasemapStyle();
				const mapHash = `#${zoom}/${lat}/${lng}/${bearing}/${tilt}/${basemap}`;
				// Update the hash state
				capUi.registerUrlStateChange ('map', mapHash);
			}

			// In initial state and after moving the map, set the hash in the URL
			mapHash (map);
			map.on ('moveend', function () {
				mapHash (map);
			});

			// Function to determine the map state
			function setLocationFromHash (map) {
				const location = capUi.parseMapHash ();
				if (location) {
					map.jumpTo (location);
				}
			}

			// On hash change, set the map location; initial is set in map initialisation for efficiency
			addEventListener ('hashchange', function () {
				setLocationFromHash (map);
			});

		},

		// Function to parse a map hash location to center and zoom components
		parseMapHash: function ()
		{
			// Extract the hash and split by /
			const mapHash = _hashComponents.map.replace (new RegExp ('^#'), '');	// Do not read window.location.hash directly, as that will contain layer state
			if (!mapHash) { return false; }
			const parts = mapHash.split ('/');

			// Need at least zoom, lat, lng
			// Supported modes:
			//  - short: zoom/lat/lng
			//  - full:  zoom/lat/lng/bearing/tilt/basemap
			if (parts.length === 3) {
				const zoom = Number(parts[0]);
				const lat = Number(parts[1]);
				const lng = Number(parts[2]);
				return {
					center: [lng, lat],
					zoom: (Number.isFinite(zoom) ? zoom : undefined)
				};
			}
			// Full format
			if (parts.length >= 6) {
				const zoom = Number(parts[0]);
				const lat = Number(parts[1]);
				const lng = Number(parts[2]);
				const bearing = Number(parts[3]);
				const pitch = Number(parts[4]);
				const basemap = parts[5];
				const result = {
					center: [lng, lat],
					zoom: (Number.isFinite(zoom) ? zoom : undefined)
				};
				if (Number.isFinite(bearing)) { result.bearing = bearing; }
				if (Number.isFinite(pitch)) { result.pitch = pitch; }
				if (basemap) { result.basemap = basemap; }
				return result;
			}

			// Else return false
			return false;
		},
		
		// Generate layer switcher HTML
		layerSwitcherHtml: function ()
		{
			// Create each switcher button
			const options = [];
			Object.entries(settings.basemapStyles).forEach(([id, basemap]) => {
				let option = `<input type="radio" name="basemap" id="${id}-basemap" value="${id}"` + (id == _settings.basemapStyleDefault ? ' checked="checked"' : '') + ' />';
				option += `<label for="${id}-basemap"><img src="/images/ui/basemaps/${id}.webp" title="${basemap.title}" loading="lazy"/></label>`;
				options.push(option);
			});
			
			// Insert radiobuttons into form
			document.getElementById('basemapform').innerHTML = options.join(' ');
		},
		
		// Generate layer switcher HTML

		antiAliasing: function ()

		{
			// Get the cookie value
			const cookieName = 'antialias';
			let cookieValue = capUi.getCookie (cookieName);
			// Enable anti-aliasing by default on desktop devices, since they are likely to have sufficient power
			if (cookieValue == '') {
				if (!capUi.isMobileDevice ()) {
					cookieValue = 'true';
					capUi.setCookie (cookieName, cookieValue);
				}
			}
			// Set form value if required
			document.getElementById ('antialiascheckbox').checked = (cookieValue == 'true' ? 'checked' : '');

			// Force system reload on change
			document.getElementById ('antialiascheckbox').addEventListener ('click', function () {
				capUi.setCookie (cookieName, (document.getElementById ('antialiascheckbox').checked ? 'true' : 'false'));
				location.reload ();
			});

		},


		// Determine whether the device is a mobile device
		isMobileDevice: function ()
		{
			return (typeof window.orientation !== 'undefined');
		},
		
		
		// Function to get the currently-checked basemap style
		getBasemapStyle: function ()
		{
			return document.querySelector('#basemapform input:checked').value;
		},
		
		
		// Function to add the buildings layer
		
		addBuildings: function (map)
		{
			
			console.log("Buildings function");
			// When ready
			map.once ('idle', function () {
				
				console.log("Buildings function map idle");
				// Add the source
				if (!map.getSource ('buildings')) {
					map.addSource ('buildings', {
						'type': 'vector',
						//'url': 'pmtiles://../tiles/buildings.pmtiles', // Temp Path
						'url': _settings.buildingsTilesUrl.replace ('%tileserverUrl', _settings.tileserverUrl),
					});
				}
				
				// Initialise the layer
				if (!map.getLayer('buildings')) {
					// Insert 3D buildings just below the road layers where that anchor
					// exists; otherwise append on top so historic/other basemap styles
					// without that layer do not throw
					const buildingsBeforeId = (map.getLayer('roads 0 Guided Busway Casing') ? 'roads 0 Guided Busway Casing' : undefined);
					map.addLayer({
						'id': 'buildings',
						'type': 'fill-extrusion',
						'source': 'buildings',
						'source-layer': 'buildings',
						'layout': {
							'visibility': 'none'
						},
						'paint': {
							'fill-extrusion-color': '#9c9898', // Default gray
							'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        12,
                        1,
                        14.05,
                        ['get', 'height']
                    ],
                'fill-extrusion-opacity': 0.9
						}
					}, buildingsBeforeId);
				}
			});
		},
		
		
		// Function to manage display of placenames
		placenames: function (map)
		{
			
			// Load the style definition
			// #!# The .json file is currently not a complete style definition, e.g. with version number etc.
			fetch ('/tiles/partial-style_oszoom_names.json')
				.then (function (response) {
					return response.json ();
				})
				.then (function (placenameLayers) {
					
					// Create a handle to the toggle handler; this is used to avoid compounding event listeners given that a @map/ready does not directly provide the ability to take down an existing handler, resulting in a dangling reference
					let placenamesVisibilityHandler = null;
					
					// Define load function
					const loadPlacenames = function ()
					{
						// Add the source, if not already present
						if (!map.getSource ('placenames')) {
							map.addSource ('placenames', {
								'type': 'vector',
								'url': _settings.placenamesTilesUrl.replace ('%tileserverUrl', _settings.tileserverUrl),
							});
						}

						// Add each placename layer, respecting the initial checkbox state
					  const checkbox = document.getElementById ('placenamescheckbox');
						Object.entries (placenameLayers).forEach (([layerId, layer]) => {
							layer.layout.visibility = (checkbox.checked ? 'visible' : 'none');
							if (!map.getLayer (layerId)) {
								map.addLayer (layer);
							}
						});

						// If an existing event listener exists, remove it to avoid compounding listeners unnecessarily
						if (placenamesVisibilityHandler) {
							document.getElementById('placenamescheckbox').removeEventListener('click', placenamesVisibilityHandler);
						}

						// Set handler function to change placenames visibility
						placenamesVisibilityHandler = function () {
							const checkbox = document.getElementById('placenamescheckbox');
							Object.entries (placenameLayers).forEach (([layerId, layer]) => {
								map.setLayoutProperty(layerId, 'visibility', (checkbox.checked ? 'visible' : 'none'));
							});
						};

						// Listen for checkbox changes
						document.getElementById('placenamescheckbox').addEventListener('click', placenamesVisibilityHandler);
					};
					
					// Run initially and on style change
					loadPlacenames ();
					document.addEventListener ('@map/ready', function () {
						loadPlacenames ();
					});
				});
		},
		
		
		// Geocoding API implementation
		geocoderApi: function ()
		{
			const geocoder_api = {
				forwardGeocode: async (config) => {
					const features = [];
					try {
						let request = 'https://nominatim.openstreetmap.org/search?q=' + config.query + '&format=geojson&polygon_geojson=1&addressdetails=1&countrycodes=gb';
						const response = await fetch(request);
						const geojson = await response.json();
						for (let feature of geojson.features) {
							let center = [
								feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
								feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2
							];
							let point = {
								type: 'Feature',
								geometry: {
									type: 'Point',
									coordinates: center
								},
								place_name: feature.properties.display_name,
								properties: feature.properties,
								text: feature.properties.display_name,
								place_type: ['place'],
								center: center
							};
							features.push(point);
						}
					} catch (e) {
						console.error (`Failed to forwardGeocode with error: ${e}`);
					}
					
					return {
						features: features
					};
				}
			};
			
			return geocoder_api;
		},
		
		
		// Function to manage layers
		manageLayers: function ()
		{
			// Add layers when the map is ready (including after a basemap change)
			document.addEventListener ('@map/ready', function () {
				
				// Initialise datasets (sources and layers)
				capUi.initialiseDatasets ();
				
				// Set initial visibility based on URL state, by ensuring each such checkbox is ticked
				const initialLayersString = _hashComponents.layers.replace (new RegExp ('^/'), '').replace (new RegExp ('/$'), '');		// Trim start/end slash(es)
				if (initialLayersString.length) {
					const initialLayers = initialLayersString.split (',');
					Object.keys (_datasets.layers).forEach (layerId => {
						const isEnabled = (initialLayers.includes (layerId));
						document.querySelector ('input.showlayer[data-layer="' + layerId + '"]').checked = isEnabled;
						document.querySelector ('input.showlayer[data-layer="' + layerId + '"]').dispatchEvent (new CustomEvent ('change'));
					});
				}
				document.dispatchEvent (new Event ('@map/initiallayersset', {'bubbles': true}));

				// Expand accordion panels that contain any checked layer inputs so users
				// can immediately see which layers were loaded from the URL
				capUi.expandAccordionsForCheckedLayers();
	
				// Handle layer change controls, each marked with .showlayer, .updatelayer
				// or .showlabels (boundary name labels)
				document.querySelectorAll ('.showlayer, .updatelayer, .showlabels').forEach ((input) => {
					input.addEventListener ('change', function () {
						const layerId = input.dataset.layer;
						//console.log ('Layer change for ' + layerId);
						capUi.toggleLayer(layerId);
					});
				});

				// Toggle each layer to ensure visibility is set as per the checkbox state
				Object.keys(_datasets.layers).forEach(layerId => {
					//console.log('Initial toggle of layer ' + layerId);
					capUi.toggleLayer(layerId);
				});

				// If the page was opened with a ?report=<code> deep link, pan to and open that report (once)
				capUi.handleReportDeepLink();

			});
		},
		
		
		// Function to initialise datasets (sources and layers)
		initialiseDatasets: function ()
		{
			console.log ('Initialising sources and layers');
			
			// Replace tileserver URL placeholder in layer definitions
			Object.entries(_datasets.layers).forEach(([layerId, layer]) => {
				let tileserverUrl = (_settings.tileserverTempLocalOverrides[layerId] ? _settings.tileserverTempLocalOverrides[layerId] : _settings.tileserverUrl);
				_datasets.layers[layerId].source.url = layer.source.url.replace ('%tileserverUrl', tileserverUrl)
			});
			
			// Add layers, and their sources, initially not visible when initialised.
			// Insertion order is controlled explicitly: a layer's anchor (the layer
			// it is inserted *below*) is taken from the optional _datasets.layerBeforeId
			// map, falling back to the global default. This keeps data fills below the
			// basemap's label/placename layers (the 'placeholder_name' anchor sits at
			// the top of every basemap style, just under the labels).
			const defaultBeforeId = (_settings.defaultLayerBeforeId || 'placeholder_name');
			const layerBeforeIds = (_datasets.layerBeforeId || {});
			Object.keys(_datasets.layers).forEach(layerId => {
				let beforeId = (layerBeforeIds[layerId] || defaultBeforeId);
				// Gracefully append on top if the anchor layer is absent in the active
				// basemap style (e.g. historic OS styles), rather than throwing
				if (beforeId && !_map.getLayer(beforeId)) { beforeId = undefined; }
				_datasets.layers[layerId].layout = {
					visibility: 'none'
				};
				_map.addLayer(_datasets.layers[layerId], beforeId);

				// Add a companion name-label layer for administrative boundaries, on
				// top of everything so the names remain readable at all zoom levels
				const labelField = (_datasets.boundaryLabels || {})[layerId];
				if (labelField && !_map.getLayer(layerId + '-labels')) {
					const lineColour = (_datasets.layers[layerId].paint && _datasets.layers[layerId].paint['line-color']) || '#333333';
					_map.addLayer({
						'id': layerId + '-labels',
						'type': 'symbol',
						'source': layerId,	// Inline sources are registered under the layer id
						'source-layer': _datasets.layers[layerId]['source-layer'],
						'layout': {
							'visibility': 'none',
							'symbol-placement': 'line',
							'text-field': ['get', labelField],
							'text-size': 12
						},
						'paint': {
							'text-color': lineColour,
							'text-halo-color': '#ffffff',
							'text-halo-width': 1.5
						}
					});
				}
			});
		},
		
		
		toggleLayer: function (layerId)
		{
				
			// Check for a dynamic styling callback and run it if present
			if (_datasets.layerStyling[layerId]) {
				//console.log('Running dynamic styling for ' + layerId);
				_datasets.layerStyling[layerId] (layerId, _map, _settings, _datasets, capUi.createLegend);
			} else {
				capUi.createLegend (datasets.legends, layerId, layerId + 'legend');
			}
			
			// Set the visibility of the layer, based on the checkbox value
			const isVisible = document.querySelector ('input.showlayer[data-layer="' + layerId + '"]').checked;
			_map.setLayoutProperty(layerId, 'visibility', (isVisible ? 'visible' : 'none'));
			console.log ('Toggling layer ' + layerId + ' visability ' + isVisible);
			capUi.trackEvent('layer_toggle', {'layer': layerId, 'visible': isVisible});

			// Sync the companion name-label layer, if present: labels show only when
			// the boundary itself is visible AND its names checkbox is ticked
			if (_map.getLayer (layerId + '-labels')) {
				const labelsCheckbox = document.querySelector ('input.showlabels[data-layer="' + layerId + '"]');
				const labelsVisible = (isVisible && labelsCheckbox && labelsCheckbox.checked);
				_map.setLayoutProperty (layerId + '-labels', 'visibility', (labelsVisible ? 'visible' : 'none'));
			}
			
			// Update the layer state for the URL
			capUi.layerStateUrl ();
		},
		
		
		createLegend: function (legendColours, selected, selector)
		{
      		// Do nothing if no selector for where the legend will be added
			if (!document.getElementById(selector)) {return;}
								
			const el = document.getElementById(selector);
			const cls = el ? el.className : '';
			
			// Normalize selected key to a valid property
			selected = (legendColours.hasOwnProperty(selected) ? selected : '_');
			
			// Get the selected legend data
			const selectedLegend = legendColours[selected];
			
			// Check if this is a bivariate legend
			if (selectedLegend && selectedLegend.mode === 'bivariate') {
				// Handle bivariate legend
				capUi.createBivariateLegend(selectedLegend, selector);
				return;
			}
			
			// Detect Horizontal, Vertical or Contextual modes
			// Create the legend HTML
			// #!# Should be a list, not nested divs
			let legendHtml;
			// Determine layout mode
			let mode = 'vertical';
			// Sum characters in the first element (label) of each legend entry
			const items = selectedLegend || [];
			let totalChars = 0;
			if (Array.isArray(items)) {
				items.forEach(it => {
					if (it && typeof it[0] !== 'undefined') {
						totalChars += String(it[0]).length;
					}
				});
			}
			mode = (totalChars > 39 ? 'vertical' : 'horizontal');
			//console.log('Legend mode: ' + mode + 'nchars: ' + totalChars);
						
			
			// Ensure the element receives the correct class so CSS rules apply.
			// If the element was originally 'legendContextual' keep that class and add the
			// chosen orientation class. If it was explicitly horizontal/vertical, keep that.
			if (mode === 'horizontal') {
				el.className ='legendContextual legendHorizontal';
			} else {
				el.className = 'legendContextual legendVertical';
			}
			
			
			if (mode === 'horizontal') {
				legendHtml = '<div class="l_rHorizontal">';
				(items || []).forEach(legendColour => {
					legendHtml += `<div class="lbHorizontal"><span style="background-color: ${legendColour[1]}"></span>${legendColour[0]}</div>`;
				});
				legendHtml += '</div>';
			} else {
				legendHtml = '<div class="l_rVertical">';
				(items || []).forEach(legendColour => {
					legendHtml += `<div class="lbVertical"><span style="background-color: ${legendColour[1]}"></span>${legendColour[0]}</div>`;
				});
				legendHtml += '</div>';
			}
  
		// Set the legend
		document.getElementById(selector).innerHTML = legendHtml;
		},
		
		// Function to create a bivariate legend (5x5 grid)
		createBivariateLegend: function (legendColours, selector)
		{
			const el = document.getElementById(selector);
			if (!el) { return; }
			
			// Create a color map for fast lookup: store colours indexed by their 2-digit code
			const colorMap = {};
			(legendColours.colours || []).forEach(item => {
				colorMap[item[0]] = item[1];
			});
			
			// Extract labels (first is x-axis, second is y-axis)
			const xLabel = (legendColours.labels && legendColours.labels[0]) ? legendColours.labels[0] : '';
			const yLabel = (legendColours.labels && legendColours.labels[1]) ? legendColours.labels[1] : '';
			
			// Create the bivariate legend HTML structure
			// Grid coordinates: XY where X is 1-5 (left to right), Y is 1-5 (bottom to top)
			let legendHtml = '<div class="bivariateContainer">';
			
			// Y-axis label (rotated)
			if (yLabel) {
				legendHtml += `<div class="bivariateYLabel">${yLabel}</div>`;
			}
			
			// Y-axis low/high labels
			legendHtml += '<div class="bivariateYLowHigh">';
			legendHtml += '<div class="bivariateYHigh">High</div>';
			legendHtml += '<div class="bivariateYLow">Low</div>';
			legendHtml += '</div>';
			
			// Grid wrapper
			legendHtml += '<div class="bivariateGridWrapper">';
			
			// Create the grid: iterate from top to bottom (5 to 1) for visual display
			for (let y = 5; y >= 1; y--) {
				legendHtml += '<div class="bivariateRow">';
				for (let x = 1; x <= 5; x++) {
					const cellCode = parseInt(String(x) + String(y));
					const cellColor = colorMap[cellCode] || '#cccccc';
					legendHtml += `<div class="bivariateCell" style="background-color: ${cellColor}"></div>`;
				}
				legendHtml += '</div>';
			}
			
			legendHtml += '</div>'; // End bivariateGridWrapper
			
			// X-axis low/high labels with center label
			legendHtml += '<div class="bivariateXLowHighLabel">';
			legendHtml += '<div class="bivariateXLow">Low</div>';
			if (xLabel) {
				legendHtml += `<div class="bivariateXLabel">${xLabel}</div>`;
			}
			legendHtml += '<div class="bivariateXHigh">High</div>';
			legendHtml += '</div>';
			
			legendHtml += '</div>'; // End bivariateContainer
			
			// Apply bivariate legend class and set innerHTML
			el.className = 'legendContextual bivariateLegend';
			el.innerHTML = legendHtml;
		},
		
		// Function to manage layer state URL
		layerStateUrl: function ()
		{
			// Register the IDs of all checked layers, first resetting the list
			const enabledLayers = [];
			Object.entries (_datasets.layers).forEach (([layerId, layer]) => {
			  //console.log('input.showlayer[data-layer="' + layerId + '"]');
				const isEnabled = document.querySelector ('input.showlayer[data-layer="' + layerId + '"]').checked;
				if (isEnabled) {
					enabledLayers.push (layerId);
				}
			});

			// Compile the layer state URL
			const enabledLayersHash = '/' + enabledLayers.join (',') + (enabledLayers.length ? '/' : '');

			// Register a state change for the URL
			capUi.registerUrlStateChange ('layers', enabledLayersHash);

		},
		
		// Function to create popups
		createPopups: function ()
		{
			// Add to each layer
			Object.entries (_datasets.popups).forEach (([layerId, options]) => {
				capUi.mapPopups (layerId, options);
			});
		},
		
		
    fetchJSON: function (dataUrl) {
    return fetch(dataUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    },
    
		manageLSOAOverview : function(mapLayerId, locationId)
		{

			capUi.fetchJSON('https://pbcc.blob.core.windows.net/pbcc-data/lsoa_overview/v1/' + locationId + '.json')
				.then(function (lsoaData) {
					// Make the fetched data globally available for other scripts
					window.lsoaHeadlineData = lsoaData;

					// Set the modal title
					const label = locationId.startsWith('S') ? 'Data Zone' : 'LSOA';
					const title = locationId + ' a "' + lsoaData[0].lsoa_class_name + '" '+ label + ' in ' + lsoaData[0].WD25NM;
					document.querySelector(`#${mapLayerId}-chartsmodal .modal-title`).innerHTML = title;
					//console.log(lsoaData);

					// Colour the modal header by the LSOA's area classification, using
					// the same palette as the PBCC Area Classification map layer
					capUi.colourModalHeader (mapLayerId, lsoaData[0].lsoa_class_code);
          
          // Hide all warning boxes
          const allWarnings = document.getElementsByClassName("warning");
          for (let i = 0; i < allWarnings.length; i++) {
            allWarnings[i].style.display = 'none';
          }
          
          // Show only relevant warnings
          const warnings = lsoaData[0].warnings;
          warnings.forEach(warn => {
            const el = document.getElementById("warning_" + warn);
            if (el) el.style.display = 'block';
          });
          
                    
          
          
        })
        .catch(function (error) {
            alert('Failed to get overview data for this location, or to process it correctly. Please try refreshing the page.');
            console.log(error);
        });
		  
		},
		
		// Colour a report modal's header bar by LSOA area classification. The
		// palette matches the PBCC Area Classification map layer exactly
		// (pbcc/datasets.js lineColours.zones.lsoa_class_code). Text colour is
		// switched between black and white based on the background's luminance,
		// so titles remain readable on both light and dark classification colours.
		colourModalHeader: function (mapLayerId, classCode)
		{
			const palette = {
				'1a': '#955123',
				'2a': '#007f42', '2b': '#3ea456', '2c': '#8aca8e', '2d': '#cfe8d1',
				'3a': '#00498d', '3b': '#2967ad', '3c': '#7b99c7', '3d': '#b9c8e1',
				'4a': '#e3ac20', '4b': '#edca1a', '4c': '#f6e896', '4d': '#fcf5d8',
				'5a': '#e64c2b', '5b': '#ec773c', '5c': '#faa460', '5d': '#fcc9a0', '5e': '#fee4ce',
				'6a': '#f79ff0',
				'7a': '#6a339a', '7b': '#9f84bd',
				'8a': '#576362', '8b': '#a1a2a1', '8c': '#e5e4e3'
			};
			const header = document.querySelector ('#' + mapLayerId + '-chartsmodal .modal-header');
			if (!header) { return; }
			const background = palette[classCode];
			if (!background) { return; }	// Unknown code: leave the default styling

			// Relative luminance (sRGB) decides black vs white foreground
			const r = parseInt (background.substr (1, 2), 16) / 255;
			const g = parseInt (background.substr (3, 2), 16) / 255;
			const b = parseInt (background.substr (5, 2), 16) / 255;
			const lin = function (c) { return (c <= 0.03928 ? c / 12.92 : Math.pow ((c + 0.055) / 1.055, 2.4)); };
			const luminance = (0.2126 * lin (r)) + (0.7152 * lin (g)) + (0.0722 * lin (b));
			const foreground = (luminance > 0.4 ? '#000000' : '#ffffff');

			header.style.backgroundColor = background;
			const titleEl = header.querySelector ('.modal-title');
			if (titleEl) { titleEl.style.color = foreground; }
			const closeEl = header.querySelector ('.modal-close');
			if (closeEl) { closeEl.style.color = foreground; }
		},

		// Function to handle chart creation
		// Pulling out of common file as too different between tools
		
		charts: function ()
		{
			// Function to create a chart modal
			const chartsModal = function (mapLayerId, chartDefinition) {

				console.log("Making chartsModal for: " + mapLayerId);

				// Create the modal (once per layer) and register the handle plus its
				// chart definition so a report can also be opened programmatically
				// (e.g. from a ?report= deep link), not only from a map click
				const location_modal = capUi.newModal (mapLayerId + '-chartsmodal');
				_reportModals[mapLayerId] = {modal: location_modal, definition: chartDefinition};

				// Add a Share button beside the Print button, copying the current URL
				// (which includes the ?report= deep link) to the clipboard
				capUi.addShareButton (mapLayerId);

				// Clear the ?report= param when this report modal is closed
				capUi.watchReportModalClose (mapLayerId);

				// Open modal on clicking the supported map layer
				_map.on ('click', mapLayerId, function (e) {

					// Ensure the source matches
					let clickedFeatures = _map.queryRenderedFeatures(e.point);
					clickedFeatures = clickedFeatures.filter(function (el) {
						const layersToExclude = ['composite', 'buildings', 'placenames']; // #!# Hard-coded list - need to clarify purpose
						return !layersToExclude.includes(el.source);
					});
					// Guard against no eligible features (e.g. click landed only on excluded layers)
					if (!clickedFeatures.length) { return; }
					if (clickedFeatures[0].sourceLayer != mapLayerId) {
						console.log("click blocked: " + clickedFeatures[0].sourceLayer + " != " + mapLayerId);
						return;
					}

					// Determine the location ID from the clicked feature and open the report
					const props = e.features[0].properties;
					const locationId = props[chartDefinition.propertiesField];

					// Some datasets are too large for a monolithic index (e.g. postcode),
					// so the record's byte range travels in the pmtiles feature itself.
					// Prime it here so the tool's fetchRecord() serves this ID directly
					// without downloading an index (see js/databin.js).
					if (chartDefinition.binDataset && typeof capBin !== 'undefined') {
						capBin.primeRange (chartDefinition.binDataset, locationId,
							props[chartDefinition.binOffsetField], props[chartDefinition.binLengthField]);
					}

					capUi.openReport (mapLayerId, locationId);
				});
			};

			// Create each set of charts
			Object.entries (_datasets.charts).forEach(([mapLayerId, chartDefinition]) => {
				Object.entries (chartDefinition).forEach(([dataLayerId, dataDefinition]) => {
					chartsModal (mapLayerId, dataDefinition);
				});
			});
		},


		// Open a location report modal for a given layer/location, building its
		// charts first. Shared by map clicks and by ?report= deep links.
		openReport: function (mapLayerId, locationId)
		{
			const entry = _reportModals[mapLayerId];
			if (!entry) { console.warn ('No report modal registered for layer ' + mapLayerId); return; }
			const location_modal = entry.modal;

			// Reflect the open report in the URL so it can be shared/deep-linked
			capUi.setReportParam (locationId);
			capUi.trackEvent('report_open', {'layer': mapLayerId, 'location': locationId});

			// Set the title (may be async)
			if (mapLayerId === 'zones') {
				capUi.manageLSOAOverview (mapLayerId, locationId);
			}

			// Show global spinner while charts are built
			const spinner = document.querySelector('.spinner');
			if (spinner) { spinner.style.display = 'block'; }

			const finish = function () {
				if (spinner) { spinner.style.display = 'none'; }
				location_modal.show();
			};

			// Call tool-specific manageCharts. If it returns a Promise, wait on it.
			try {
				const result = manageCharts(locationId, mapLayerId);
				if (result && typeof result.then === 'function') {
					result.then(finish).catch(finish);
					return;
				}
			} catch (err) {
				console.error('manageCharts threw error:', err);
			}

			// If manageCharts did not return a Promise, poll for Chart.js instances inside the modal canvases.
			const maxWaitMs = 8000; // total wait time
			const intervalMs = 200;
			let waited = 0;
			const canvases = Array.from(document.querySelectorAll('#' + mapLayerId + '-chartsmodal canvas'));
			const checkCharts = function () {
				if (canvases.length === 0) { finish(); return; }
				let ready = false;
				if (window.Chart && typeof window.Chart.getChart === 'function') {
					for (const c of canvases) {
						if (window.Chart.getChart(c)) { ready = true; break; }
					}
				} else {
					for (const c of canvases) {
						if (c.width > 0 && c.height > 0) { ready = true; break; }
					}
				}
				if (ready || waited >= maxWaitMs) { finish(); return; }
				waited += intervalMs;
				setTimeout(checkCharts, intervalMs);
			};
			setTimeout(checkCharts, intervalMs);
		},


		// ---- Shareable report deep-linking (?report=<code>) --------------------

		// Read the report code from the query string, if any
		parseReportParam: function ()
		{
			return new URLSearchParams(window.location.search).get('report');
		},

		// Write ?report=<code> into the URL without reloading, preserving the hash
		setReportParam: function (locationId)
		{
			if (!locationId) { return; }
			const url = new URL(window.location.href);
			if (url.searchParams.get('report') === String(locationId)) { return; }
			url.searchParams.set('report', locationId);
			window.history.replaceState(window.history.state, '', url.toString());
		},

		// Remove ?report= from the URL without reloading
		clearReportParam: function ()
		{
			const url = new URL(window.location.href);
			if (!url.searchParams.has('report')) { return; }
			url.searchParams.delete('report');
			window.history.replaceState(window.history.state, '', url.toString());
		},

		// Add a Share button to a report modal's header (next to Print). Clicking
		// opens a small dependency-free share menu: copy link, email, and the
		// standard social share-intent URLs (no third-party scripts involved).
		// The shared URL includes the ?report= deep link, so the exact report opens.
		addShareButton: function (mapLayerId)
		{
			const header = document.querySelector ('#' + mapLayerId + '-chartsmodal .modal-header');
			if (!header || header.querySelector ('.share-button')) { return; }
			const printButton = header.querySelector ('.print-button');

			// Wrapper provides the positioning context for the dropdown menu
			const wrap = document.createElement ('span');
			wrap.className = 'share-wrap';

			const btn = document.createElement ('button');
			btn.className = 'share-button';	// Deliberately NOT print-button, which has a print handler bound to it
			btn.setAttribute ('aria-label', 'Share this report');
			btn.setAttribute ('title', 'Share this report');
			btn.setAttribute ('aria-haspopup', 'true');
			btn.setAttribute ('aria-expanded', 'false');
			btn.innerHTML = '<i class="fa fa-share-nodes" aria-hidden="true"></i> Share';

			const menu = document.createElement ('div');
			menu.className = 'share-menu';
			menu.setAttribute ('role', 'menu');
			menu.style.display = 'none';

			const pageTitle = document.title;

			// Menu entries: [label, icon class, hrefBuilder]; all plain share-intent
			// URLs opened in a new tab - no SDKs or third-party scripts
			const entries = [
				['Email', 'fa-envelope', function (url) { return 'mailto:?subject=' + encodeURIComponent (pageTitle) + '&body=' + encodeURIComponent (url); }],
				['Facebook', null, function (url) { return 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent (url); }],
				['X (Twitter)', null, function (url) { return 'https://twitter.com/intent/tweet?url=' + encodeURIComponent (url) + '&text=' + encodeURIComponent (pageTitle); }],
				['LinkedIn', null, function (url) { return 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent (url); }],
				['WhatsApp', null, function (url) { return 'https://wa.me/?text=' + encodeURIComponent (pageTitle + ' ' + url); }],
				['Bluesky', null, function (url) { return 'https://bsky.app/intent/compose?text=' + encodeURIComponent (pageTitle + ' ' + url); }]
			];

			// Copy link (first item)
			const copyItem = document.createElement ('button');
			copyItem.type = 'button';
			copyItem.className = 'share-menu-item';
			copyItem.setAttribute ('role', 'menuitem');
			copyItem.innerHTML = '<i class="fa fa-copy" aria-hidden="true"></i> Copy link';
			copyItem.addEventListener ('click', function () {
				const url = window.location.href;
				const confirmCopied = function () {
					copyItem.innerHTML = '<i class="fa fa-copy" aria-hidden="true"></i> Link copied!';
					setTimeout (function () {
						copyItem.innerHTML = '<i class="fa fa-copy" aria-hidden="true"></i> Copy link';
						hideMenu ();
					}, 1200);
				};
				if (navigator.clipboard && navigator.clipboard.writeText) {
					navigator.clipboard.writeText (url).then (confirmCopied).catch (function () {
						window.prompt ('Copy this link to share the report:', url);
						hideMenu ();
					});
				} else {
					window.prompt ('Copy this link to share the report:', url);
					hideMenu ();
				}
				capUi.trackEvent ('report_share', {'layer': mapLayerId, 'method': 'copy'});
			});
			menu.appendChild (copyItem);

			entries.forEach (function (entry) {
				const item = document.createElement ('button');
				item.type = 'button';
				item.className = 'share-menu-item';
				item.setAttribute ('role', 'menuitem');
				item.innerHTML = (entry[1] ? '<i class="fa ' + entry[1] + '" aria-hidden="true"></i> ' : '') + entry[0];
				item.addEventListener ('click', function () {
					window.open (entry[2] (window.location.href), '_blank', 'noopener');
					capUi.trackEvent ('report_share', {'layer': mapLayerId, 'method': entry[0]});
					hideMenu ();
				});
				menu.appendChild (item);
			});

			// Native device share sheet where supported (mobile), as a final option
			if (navigator.share) {
				const nativeItem = document.createElement ('button');
				nativeItem.type = 'button';
				nativeItem.className = 'share-menu-item';
				nativeItem.setAttribute ('role', 'menuitem');
				nativeItem.textContent = 'More…';
				nativeItem.addEventListener ('click', function () {
					navigator.share ({title: pageTitle, url: window.location.href}).catch (function () {});
					capUi.trackEvent ('report_share', {'layer': mapLayerId, 'method': 'native'});
					hideMenu ();
				});
				menu.appendChild (nativeItem);
			}

			function hideMenu ()
			{
				menu.style.display = 'none';
				btn.setAttribute ('aria-expanded', 'false');
			}

			btn.addEventListener ('click', function (e) {
				e.preventDefault ();
				e.stopPropagation ();
				const isOpen = (menu.style.display === 'block');
				menu.style.display = (isOpen ? 'none' : 'block');
				btn.setAttribute ('aria-expanded', (isOpen ? 'false' : 'true'));
			});

			// Close the menu when clicking elsewhere or pressing Escape
			document.addEventListener ('click', function (e) {
				if (!wrap.contains (e.target)) { hideMenu (); }
			});
			document.addEventListener ('keyup', function (e) {
				if (e.key === 'Escape') { hideMenu (); }
			});

			wrap.appendChild (btn);
			wrap.appendChild (menu);
			if (printButton) {
				printButton.insertAdjacentElement ('afterend', wrap);
			} else {
				header.insertBefore (wrap, header.firstChild);
			}
		},

		// Observe a report modal and clear the ?report= param once it is closed
		watchReportModalClose: function (mapLayerId)
		{
			const modalEl = document.getElementById(mapLayerId + '-chartsmodal');
			if (!modalEl || typeof MutationObserver === 'undefined') { return; }
			const observer = new MutationObserver(function () {
				if (window.getComputedStyle(modalEl).display === 'none') {
					capUi.clearReportParam();
				}
			});
			observer.observe(modalEl, {attributes: true, attributeFilter: ['style']});
		},

		// Lazily load the combined LSOA/Data Zone centroid lookup (only fetched
		// when a report needs to be located, e.g. a deep link or postcode search)
		loadCentroids: function ()
		{
			if (_lsoaCentroids) { return Promise.resolve(_lsoaCentroids); }
			return capUi.fetchJSON('/data/lsoa_centroids.json').then(function (data) {
				_lsoaCentroids = data;
				return data;
			});
		},

		// On initial load, if ?report=<code> is present, pan to the target and open its report
		handleReportDeepLink: function ()
		{
			if (_reportDeepLinkHandled) { return; }
			const reportId = capUi.parseReportParam();
			if (!reportId) { return; }
			_reportDeepLinkHandled = true;

			// Choose the target layer: prefer 'zones', else the first charts layer
			const layerIds = Object.keys(_datasets.charts || {});
			const mapLayerId = (layerIds.includes('zones') ? 'zones' : layerIds[0]);
			if (!mapLayerId) { return; }

			// Enable the layer if its checkbox is currently off, so the area is shown behind the report
			const checkbox = document.querySelector('input.showlayer[data-layer="' + mapLayerId + '"]');
			if (checkbox && !checkbox.checked) {
				checkbox.checked = true;
				checkbox.dispatchEvent(new CustomEvent('change'));
			}

			// Pan to the target centroid (if known) then open the report
			capUi.loadCentroids().then(function (centroids) {
				const centre = centroids[reportId];
				if (centre && _map) {
					_map.flyTo({center: centre, zoom: Math.max(_map.getZoom(), 12)});
				}
				capUi.openReport(mapLayerId, reportId);
			}).catch(function () {
				// Even if the centroid lookup fails, still open the report
				capUi.openReport(mapLayerId, reportId);
			});
		},
		
		// Popup handler
		// Options are: {preprocessingCallback, smallValuesThreshold, literalFields}
		mapPopups: function (layerId, options)
		{
			// Enable cursor pointer
			layerPointer (layerId);
			
			// Register popup on click
			_map.on ('click', layerId, function (e) {
				
				// Get the clicked co-ordinates
				const coordinates = e.lngLat;
				
				// Obtain the clicked feature
				let feature = e.features[0];
				
				// Process any preprocessing callback
				if (options.preprocessingCallback) {
					feature = options.preprocessingCallback(feature);
				}
				
				// Number formatting
				Object.entries(feature.properties).forEach(([key, value]) => {
					if (options.literalFields && options.literalFields.includes(key)) {
						return; /* i.e. continue */
					}
					if (Number.isFinite(value)) { // Number check means strings/percentages/etc. get skipped
						
						// Suppress small numeric values
						if (value < options.smallValuesThreshold) {
							if (options.smallValuesThreshold) {
								feature.properties[key] = '<' + options.smallValuesThreshold;
								return; // i.e. continue
							}
						}
						
						// Thousands separator
						feature.properties[key] = value.toLocaleString('en-GB');
					}
				});
				
				// Make external links properties available to the template
				feature.properties = addExternalLinks(feature.properties, coordinates);
				
				// Create the popup HTML from the template in the HTML
				const popupHtml = processTemplate(options.templateId, feature.properties);
				
				// Create the popup
				new maplibregl.Popup ({
						className: 'layerpopup'
					})
					.setLngLat (coordinates)
					.setHTML (popupHtml)
					.addTo (_map);

				capUi.trackEvent('popup_open', {'layer': layerId});
					
				// #!# Need to close popup when layer visibility changed - currently a popup is left hanging if the layer is toggled on/off (e.g. due to simplification or field change)
			});
			
			
			// Function to handle pointer hover changes for a layer
			function layerPointer (layerId)
			{
				// Change the cursor to a pointer when the mouse is over the layer.
				_map.on('mouseenter', layerId, function () {
					_map.getCanvas().style.cursor = 'pointer';
				});
				
				// Change it back to a pointer when it leaves.
				_map.on('mouseleave', layerId, function () {
					_map.getCanvas().style.cursor = '';
				});
			}
			
			
			// Function to convert a template to HTML, substituting placeholders
			function processTemplate (templateId, properties)
			{
				// Get template for the popup (from the HTML page), which defines fields to be used from feature.properties
				const template = document.querySelector('template#' + templateId).innerHTML;

				// Substitute placeholders in template
				return template.replace(/{([^}]+)}/g, (placeholderString, field) => properties[field]); // See: https://stackoverflow.com/a/52036543/
			}
			
			
			// Function to add external links
			function addExternalLinks (properties, coordinates)
			{
				properties._streetViewUrl = 'https://maps.google.com/maps?q=&layer=c&cbll=' + coordinates.lat + ',' + coordinates.lng + '&cbp=11,0,0,0,0';
				properties._osmUrl = 'https://www.openstreetmap.org/#map=19/' + coordinates.lat + '/' + coordinates.lng;
				return properties;
			}
		},
		
		
		// Click handler for manual help buttons
		handleHelpButtons: function ()
		{
			document.querySelectorAll ('.helpbutton').forEach (function (button) {
				if (button.dataset.help) { // E.g. data-help="scenario" refers to the scenario section
					button.addEventListener ('click', function () {
						capUi.trackEvent('help_open', {'section': button.dataset.help});
						capUi.showHelp (button.dataset.help);
					});
				}
			});
		},
		
		
		// Function to handle (?) tooltips, loading extracts from the manual
		showHelp: function (sectionId)
		{
			//console.log("Trigger help for sectionId: " + sectionId);
			fetch ('/manual/index.md')
				.then (response => response.text())
				.then (text => {
					
					// Extract the Markdown text between comments
					const regex = new RegExp (`<!-- #${sectionId} -->(.+)<!-- /#${sectionId} -->`, 's'); // s flag is for 'match newlines'
					const result = regex.exec (text);
					// Guard against a missing/mismatched manual section so a help button
					// never throws; show a friendly message pointing to the full manual
					if (!result) {
						document.getElementById ('helpcontent').innerHTML = '<p><strong>Help for this item is not available yet.</strong></p><p>See the <a href="/manual/">manual</a> for more information.</p>';
						return;
					}
					const extract = result[1];

					// Convert to HTML
					const html = capUi.mdToHtml (extract);
					
					// Parse to HTML
					const parser = new DOMParser ();
					const otherPage = parser.parseFromString (html, 'text/html');
					const contentHtml = otherPage.querySelector ('body');
					//console.log(otherDiv.innerHTML);

					// Add the HTML (fall back to a message if the body could not be parsed)
					document.getElementById ('helpcontent').innerHTML = (contentHtml ? contentHtml.innerHTML : '<p><strong>Help missing!</strong></p>');
				});
			
			// Show in modal
			const help_modal = capUi.newModal ('help_modal');
			help_modal.show();
		},
		
		
		// Function to convert the loaded Markdown file text to HTML
		// #!# Copied from manual.js
		mdToHtml: function (mdText)
		{
			const converter = new showdown.Converter();
			const html = converter.makeHtml(mdText);
			return html;
		},
		
		// Function to add tooltips
		tooltips: function ()
		{
			// Run once the map is ready; seems that the geolocation button loads too late
			_map.once ('idle', function () {

				// Apply tooltips to the map control buttons and to help buttons, as these have no visible labelling; title is used else ARIA label
				tippy('.maplibregl-control-container [title], .maplibregl-control-container [aria-label], .helpbutton', {
					content (element) {
						const title = element.getAttribute ('title');
						if (title) {
							element.removeAttribute ('title');	// Avoid native browser tooltips also showing
						}
						const ariaLabel = element.getAttribute ('aria-label');
						return title || ariaLabel;
					},
				});
			});
		},
		
		// function to manage analytics cookie setting

		manageAnalyticsCookie: function ()
		{

			// Disable tracking if the opt-out cookie exists.
			const disableStr = 'ga-disable-' + _settings.gaProperty;
			if (document.cookie.indexOf(disableStr + '=true') > -1) {
				window[disableStr] = true;
			}

			// Define the cookie name
			const cookieName = 'analyticstrack';

			// Handle cookie warning buttons

			document.querySelectorAll('#cookiewarning button').forEach(function (button) {
				button.addEventListener('click', function (e) {
					cookieButton(button.value);
				});
			});

			// Show the cookie warning
			showCookieWarning();

			// Opt-out function
			function gaOptout ()
			{
				document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/; SameSite=None; Secure';
				window[disableStr] = true;
			}

			// Warning Control
			function cookieButton (accepted)
			{
				if (accepted) {
					capUi.setCookie(cookieName, 'true');
				} else {
					//alert("Tracking Op-Out Disabled");
					gaOptout();
					capUi.setCookie(cookieName, 'false');
				}
				const cookiewarning = document.getElementById ('cookiewarning');
				cookiewarning.style.display = 'none';
			}

			// Cookie warning
			function showCookieWarning ()
			{
				const cookiewarning = document.getElementById ('cookiewarning');
				const cookie = capUi.getCookie (cookieName);
				//console.log ("Cookie status: '" + cookie + "'");
				cookiewarning.style.display = (cookie === '' ? 'block' : 'none');

			}

		},

		// Function to manage modal dialogs
		newModal: function (modalId)
		{
			// Identify the modal
			const modal = document.getElementById(modalId);
      console.log("Modal setup: " + modalId);
			// When the user clicks on <span> (x), close the modal
			const closeButton = document.querySelector('#' + modalId + ' .modal-close');
			closeButton.addEventListener('click', function () {
				hide();
			});
			
			if(closeButton.style.visibility != 'hidden'){
			  // Treat clicking outside of the modal as implied close
  			window.addEventListener('click', function (event) {
  				if (event.target == modal || event.target.id == 'overlay') {
  					hide();
  				}
  			});
  
  			// Treat escape key as implied close
  			window.addEventListener('keyup', function (event) {
  				if (event.key == 'Escape') {
  					if (window.getComputedStyle(modal).display == 'block') { // I.e. is displayed
  						hide();
  					}
  				}
  			});
      }
			
			

			// Show
			const show = function ()
			{
				document.getElementById('overlay').style.display = 'block';
				modal.style.display = 'block';
			};

			// Hide
			const hide = function ()
			{
				modal.style.display = 'none';
				document.getElementById('overlay').style.display = 'none';
			};

			// Accessor functions
			return {
				show: show,
				hide: hide
			};

		},


		// Function to format a date
		formatAsUKDate: function (date)
		{
			const options = {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};
			return new Date(date).toLocaleDateString('en-GB', options);
		},
		
		
		// Generic cookie managment functions
		setCookie: function (name, value, days = 100)
		{
			const d = new Date();
			d.setTime(d.getTime() + (24 * 60 * 60 * days * 1000));	// setTime is in ms
			const expires = 'expires=' + d.toUTCString();
			document.cookie = name + '=' + value + ';' + expires + ';path=/';
		},
		
		
		getCookie: function (name)
		{
			name = name + '=';
			const ca = document.cookie.split(';');
			for (let i = 0; i < ca.length; i++) {
				let c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) === 0) {
					return c.substring(name.length, c.length);
				}
			}
			return "";
		},
		
		
		// Send a custom analytics event, but only once the user has explicitly
		// accepted analytics cookies (the 'analyticstrack' cookie is set to 'true'
		// by the "OK" button in the cookie banner). This ensures no interaction
		// events are sent before the user has opted in.
		trackEvent: function (action, params)
		{
			if (capUi.getCookie('analyticstrack') !== 'true') { return; }
			if (typeof window.gtag === 'function') {
				window.gtag('event', action, params || {});
			}
		},


		// Function to adjust opentool links to use current map state
		// When a user clicks a link with class 'opentool' that contains map coordinates,
		// this function dynamically updates the coordinates to match the current map view
		// (zoom, lat, lng, bearing, pitch) while preserving layer state and other URL parts
		adjustOpenToolLinks: function ()
		{
			// Listen for clicks on opentool links
			document.addEventListener('click', function (e) {
				const link = e.target.closest('a.opentool');
				if (!link) { return; }
				
				// Get the href
				let href = link.getAttribute('href');
				if (!href || !href.includes('#')) { return; }
				
				// Parse the current page's map hash to extract map orientation
				const mapHash = _hashComponents.map.replace(/^#/, '');
				if (!mapHash) { return; } // No map state to copy
				
				const mapParts = mapHash.split('/');
				
				// We need at least zoom/lat/lng; full format is zoom/lat/lng/bearing/pitch/basemap
				if (mapParts.length < 3) { return; }
				
				const currentZoom = mapParts[0];
				const currentLat = mapParts[1];
				const currentLng = mapParts[2];
				const currentBearing = mapParts[3] || '0';
				const currentPitch = mapParts[4] || '0';
				const currentBasemap = mapParts[5] || '';
				
				// Split the link href by # to separate path from hash
				const hashIndex = href.indexOf('#');
				const basePath = href.substring(0, hashIndex);
				const hashPart = href.substring(hashIndex + 1); // Everything after #
				
				// Split hash by # to separate layers from map components
				const hashComponents = hashPart.split('#');
				
				// Reconstruct the URL with updated map coordinates
				// Format: path/#layers/#zoom/lat/lng/bearing/pitch/basemap
				let newHash = basePath + '#';
				
				// Add layers component if it exists
				if (hashComponents.length >= 1) {
					newHash += hashComponents[0]; // layers part
				}
				
				// Add the updated map component with current map state
				newHash += '#' + currentZoom + '/' + currentLat + '/' + currentLng + '/' + currentBearing + '/' + currentPitch;
				
				// Add basemap if one exists
				if (currentBasemap) {
					newHash += '/' + currentBasemap;
				}
				
				// Update the link's href
				link.setAttribute('href', newHash);
			}, true); // Use capture phase to intercept before navigation
		}
	};
	
} ());

// Ensure external links open in a new tab and use safe rel attributes
(function ensureExternalLinksOpenNewTab() {
	document.addEventListener('DOMContentLoaded', function () {
		try {
			var anchors = document.querySelectorAll('a[href^="http"]');
			anchors.forEach(function (a) {
				try {
					var url = new URL(a.href, location.href);
					if (url.hostname !== location.hostname) {
						if (!a.hasAttribute('target') || a.getAttribute('target') !== '_blank') {
							a.setAttribute('target', '_blank');
						}
						var rel = a.getAttribute('rel') || '';
						var parts = rel.split(/\s+/).filter(Boolean);
						if (parts.indexOf('noopener') === -1) { parts.push('noopener'); }
						if (parts.indexOf('noreferrer') === -1) { parts.push('noreferrer'); }
						a.setAttribute('rel', parts.join(' '));
					}
				} catch (e) {
					// ignore malformed URLs
				}
			});
		} catch (e) {
			// no-op
		}
	});
})();
