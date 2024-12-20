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
	
	// Functions
	return {
		
		// Main function
		initialise: function (settings, datasets)
		{
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
			
			// Manage layers
			capUi.manageLayers ();
			
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
		},
		
		// Welcome screen
		welcomeScreen: function ()
		{
			// Show only first time
			//const cookieName = 'welcomescreen';
			//if (capUi.getCookie (cookieName)) {return;}
			
			// Create modal
			const welcomeModal = capUi.newModal ('welcome-modal');
			welcomeModal.show ();
			
			// Set OSM and update dates in the text, if present
			/*
			if (document.getElementById ('osmupdatedate')) {
				document.getElementById ('osmupdatedate').innerHTML = _settings.osmDate;
			}
			*/
			if (document.getElementById ('updatedate')) {
				document.getElementById ('updatedate').innerText = capUi.formatAsUKDate (document.lastModified);
			}
			
			// Set cookie
			//capUi.setCookie (cookieName, 'true');
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
			// Get the hash, e.g. "/layer1,layer2/#8/55.953/-3.138" would be extracted from https://example.com/#/layer1,layer2/#8/55.953/-3.138
			const hash = window.location.hash.replace (/^#/, '');
			// Split path component from map compoment
			const hashComponents = hash.split ('#');
			// End if not the intended format of /layers/#map , thus retaining the default state of the _hashComponents property
			if (hashComponents.length != 2) {return;}
			// Register the change in the state
			_hashComponents.layers = hashComponents[0];
			_hashComponents.map = hashComponents[1];
			
			//console.log (_hashComponents);
		},

		// Function to register a state change, adjusting the URL
		registerUrlStateChange: function (component, value)
		{
			// Update the registry
			_hashComponents[component] = value;
			
			//console.log (_hashComponents);
			// Construct the new hash state
			const hashState = '#' + _hashComponents.layers + _hashComponents.map;

			// Update the hash state in the browser history
			const location = window.location.href.replace (/(#.+)?$/, hashState);	// Does correctly work from the first hash onwards (when multiple)
			window.history.replaceState (window.history.state, null, location);

		},
		
		// Function to set up the map UI and controls
		createMap: function ()
		{
			// Create the layer switcher
			capUi.layerSwitcherHtml ();
			
			// Manage anti-aliasing
			capUi.antiAliasing ();
			
			// Determine initial centre/zoom location, based on the hash if present, else the settings location
			const initialPosition = (capUi.parseMapHash () || _settings.initialPosition);
			
			// Main map setup
			const map = new maplibregl.Map({
				container: 'map',
				style: '/tiles/style_' + capUi.getBasemapStyle() + '.json',
				center: initialPosition.center,
				zoom: initialPosition.zoom,
				maxZoom: _settings.maxZoom,
				minZoom: _settings.minZoom,
				maxPitch: 85,
				hash: false,	// Emulating the hash manually for now; see layerStateUrl
				attributionControl: false, // Created manually below
				antialias: document.getElementById('antialiascheckbox').checked
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
			
			// Add buildings; note that the style/colouring may be subsequently altered by data layers
			
			capUi.addBuildings(map);
			document.getElementById('basemapform').addEventListener('change', function (e) {
			  console.log("basemapform changed, add buildings");
				capUi.addBuildings(map);
			});
			
			
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
					document.dispatchEvent(new Event('@map/ready', {
						'bubbles': true
					}));
				});
			});
			
			// Return the map handle
			return map;
		},
		
		// Function to manage the map hash manually; this is a minimal implementation covering only what we need
		// Covers zoon,lat,lon; no support for bearing or pitch
		// Based on the native implementation at: https://github.com/maplibre/maplibre-gl-js/blob/main/src/ui/hash.ts#L11

		manageMapHash: function (map)
		{
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
				const mapHash = `#${zoom}/${lat}/${lng}`;
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
			const parts = mapHash.split ('/');

			// If three parts, parse out
			if (parts.length == 3) {
				return {
					center: [parts[2], parts[1]],
					zoom: parts[0]
				};
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
			// When ready
			map.once ('idle', function () {
				
				console.log("Buildings fucnction");
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
					}, 'roads 0 Guided Busway Casing');  
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

				// Implement initial visibility state for all layers
				Object.keys(_datasets.layers).forEach(layerId => {
					capUi.toggleLayer(layerId);
				});
				
				// Handle layer change controls, each marked with .showlayer or .updatelayer
				document.querySelectorAll ('.showlayer, .updatelayer').forEach ((input) => {
					input.addEventListener ('change', function () {
						const layerId = input.dataset.layer;
						capUi.toggleLayer(layerId);
					});
				});
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
			
			// Add layers, and their sources, initially not visible when initialised
			Object.keys(_datasets.layers).forEach(layerId => {
				const beforeId = (layerId == 'data_zones' ? 'roads 0 Guided Busway Casing' : 'placeholder_name'); // #!# Needs to be moved to definitions
				_datasets.layers[layerId].layout = {
					visibility: 'none'
				};
				_map.addLayer(_datasets.layers[layerId], beforeId);
			});
		},
		
		
		toggleLayer: function (layerId)
		{
			//console.log ('Toggling layer ' + layerId);
			
			// Check for a dynamic styling callback and run it if present
			if (_datasets.layerStyling[layerId]) {
				_datasets.layerStyling[layerId] (layerId, _map, _settings, _datasets, capUi.createLegend);
			} else {
				capUi.createLegend (datasets.legends, layerId, layerId + 'legend');
			}
			
			// Set the visibility of the layer, based on the checkbox value
			const isVisible = document.querySelector ('input.showlayer[data-layer="' + layerId + '"]').checked;
			_map.setLayoutProperty(layerId, 'visibility', (isVisible ? 'visible' : 'none'));
			console.log ('Toggling layer ' + layerId + ' visability ' + isVisible);
			
			// Update the layer state for the URL
			capUi.layerStateUrl ();
		},
		
		
		createLegend: function (legendColours, selected, selector)
		{
      // Do nothing if no selector for where the legend will be added
			if (!document.getElementById(selector)) {return;}
			
			//console.log(legendColours);
			//console.log(selected);
			//console.log(selector);
			
			// Detect Horizontal or Vertical modes
			// Create the legend HTML
			// #!# Should be a list, not nested divs
			let legendHtml;
			if(document.getElementById(selector).className == "legendHorizontal") {
			  legendHtml = '<div class="l_rHorizontal">';
  			  selected = (legendColours.hasOwnProperty(selected) ? selected : '_');
  			  //console.log(legendColours[selected]);
  			  legendColours[selected].forEach(legendColour => {
  				legendHtml += `<div class="lbHorizontal"><span style="background-color: ${legendColour[1]}"></span>${legendColour[0]}</div>`;
  			})
  			legendHtml += '</div>';
			} else {
			  legendHtml = '<div class="l_rVertical">';
  			  selected = (legendColours.hasOwnProperty(selected) ? selected : '_');
  			  legendColours[selected].forEach(legendColour => {
  				legendHtml += `<div class="lbVertial"><span style="background-color: ${legendColour[1]}"></span>${legendColour[0]}</div>`;
  			})
			  legendHtml += '</div>';
			}
      
			// Set the legend
			document.getElementById(selector).innerHTML = legendHtml;
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
		
		/*
		fetchJSON: function (dataUrl)
		{
		  // Get the data
			fetch(dataUrl)
				.then(function (response) {
					return response.json();
				})
				.then(function (json) {
					//const locationData = json[0]; //TODO this is what PBCC expects
					const locationData = json;
					console.log ('Retrieved data for layer '+  mapLayerId + ' location ' + locationId);
					
					//Hide Spinner
					//document.getElementById('loader').style.display = 'none';
					
					// Set the title
					//const title = chartDefinition.titlePrefix + featureProperties[chartDefinition.titleField];
					//document.querySelector(`#${mapLayerId}-chartsmodal .modal-title`).innerHTML = title;
					
					// Create the charts
					//manageCharts(chartDefinition, locationData);
					return locationData;
				})
				.catch(function (error) {	// Any error, including within called code, not just retrieval failure
					alert ('Failed to get data for this location, or to process it correctly. Please try refreshing the page.');
					console.log (error);
				});
		},
		*/
		
		fetchJSON: function (dataUrl) {
    return fetch(dataUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(function (error) {
            alert('Failed to get data for this location, or to process it correctly. Please try refreshing the page.');
            console.log(error);
        });
    },

		
		// Function to handle chart creation
		// Pulling out of common file as too different between tools
		
		charts: function ()
		{
		  
		  // Handles to charts
			const chartHandles = {};
		  
		  // Function to create a chart modal
			const chartsModal = function (mapLayerId, chartDefinition) {
				
				console.log("Making chartsModal for: " + mapLayerId)
				
				// Initialise the HTML structure for this modal
				//initialiseChartsModalHtml (mapLayerId);
				
				// Create the modal
				const location_modal = capUi.newModal (mapLayerId + '-chartsmodal');
				
				// Initialise the HTML structure for the set of chart boxes, writing in the titles and descriptions, and setting the canvas ID
				//initialiseChartBoxHtml(mapLayerId, chartDefinition.charts);
				
				// Open modal on clicking the supported map layer
				_map.on ('click', mapLayerId, function (e) {
				  
				  
					
					// Ensure the source matches
					let clickedFeatures = _map.queryRenderedFeatures(e.point);
					clickedFeatures = clickedFeatures.filter(function (el) {
						const layersToExclude = ['composite', 'buildings', 'placenames']; // #!# Hard-coded list - need to clarify purpose
						return !layersToExclude.includes(el.source);
						//return el.source != 'composite';
					});
					if (clickedFeatures[0].sourceLayer != mapLayerId) {
						console.log("click blocked: " + clickedFeatures[0].sourceLayer + " != " + mapLayerId);
						return;
					}
					
					// Assemble the JSON data file URL
					const featureProperties = e.features[0].properties;
					const locationId = featureProperties[chartDefinition.propertiesField];
					//const dataUrl = chartDefinition.dataUrl.replace('%id', locationId);
					
					// Set the title
					// TODO this is run muliple times when muliple data sources, but still works
					console.log(chartDefinition.titlePrefix);
					const title = chartDefinition.titlePrefix + featureProperties[chartDefinition.titleField];
					document.querySelector(`#${mapLayerId}-chartsmodal .modal-title`).innerHTML = title;
					
					// Display the modal
					location_modal.show();
					console.log(mapLayerId);
					// Tool Specific Function in each ui.js
					manageCharts(locationId, mapLayerId);
					
					
				});
			}
			
			// Create each set of charts
			
			Object.entries (_datasets.charts).forEach(([mapLayerId, chartDefinition]) => {
			   //console.log(mapLayerId);
			   //console.log(chartDefinition);
			   //chartsModal (mapLayerId, chartDefinition);
			   Object.entries (chartDefinition).forEach(([dataLayerId, dataDefinition]) => {
  			   //console.log(dataLayerId);
  			   //console.log(dataDefinition);
  			   chartsModal (mapLayerId, dataDefinition);
  			 });
			   
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
					const extract = result[1];
					
					// Convert to HTML
					const html = capUi.mdToHtml (extract);
					
					// Parse to HTML
					const parser = new DOMParser ();
					const otherPage = parser.parseFromString (html, 'text/html');
					const contentHtml = otherPage.querySelector ('body');
					//console.log(otherDiv.innerHTML);
					if (!contentHtml) {
						contentHtml = '<p><strong>Help missing!</strong></p>';
					}
					
					// Add the HTML
					document.getElementById ('helpcontent').innerHTML = contentHtml.innerHTML;
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
			tippy('[title]', {
				content (reference) {
					const title = reference.getAttribute('title');
					reference.removeAttribute('title');
					return title;
				},
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
		}
	};
	
} ());
