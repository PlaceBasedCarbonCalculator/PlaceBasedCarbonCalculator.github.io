// Chart Globals
var accessChart;


// Data definitions, i.e. layers, charts, etc.

// Single-binary datasets used by this tool (see js/databin.js). Record the
// current index file name for each; the matching data_*.bin is named inside
// the index (meta.bin_file). Bump a file name when that dataset is rebuilt and
// re-uploaded - datasets are rebuilt independently, so the dates will diverge.
if (typeof capBin !== 'undefined') {
	capBin.register({
		pt_frequency: 'index_pt_frequency_2026-08-25.json.gz',
		access: 'index_access_2026-08-25.json.gz',
		vehicle_summary: 'index_vehicle_summary_2026-08-26.json.gz'
	});
}


// Which year and modes the zone tiles carry. These MUST match
// select_transport_vars() in the build repo (R/public_transport_frequency.R):
// it writes one tph_daytime_avg_<year>_<mode> column per mode below, plus
// change_bus_2008_<year>. Changing the year here without rebuilding the tiles
// gives an all-black map.
const transportTphYear = 2025;
const transportTphModes = [0, 1, 2, 3, 4];

// Colour ramps. Every mode of trips-per-hour shares one scale - that is the
// point, since the map exists to compare places against each other - so each
// ramp is written once here and expanded over the modes below, rather than the
// near-identical copies this file used to carry.
const tphLegendRamp = [
	['NA','#111111'],
	['<1','#b2182b'],
	[1,'#d6604d'],
	[2,'#f4a582'],
	[5,'#fddbc7'],
	[10,'#f7f7f7'],
	[20,'#d1e5f0'],
	[30,'#92c5de'],
	[50,'#4393c3'],
	['>100','#053061']
];
const tphColourRamp = [
	0,'#b2182b',
	1,'#d6604d',
	2,'#f4a582',
	5,'#fddbc7',
	10,'#f7f7f7',
	20,'#d1e5f0',
	30,'#92c5de',
	50,'#4393c3',
	100,'#053061'
];

const changeLegendRamp = [
	['-100%','#67001f'],
	['-80%','#b2182b'],
	['-60%','#d6604d'],
	['-40%','#f4a582'],
	['-20%','#fddbc7'],
	['-10%','#f7f7f7'],
	['0%','#d1e5f0'],
	['+10%','#92c5de'],
	['+20%','#4393c3'],
	['>50%','#053061']
];
const changeColourRamp = [
	-101,'#67001f',
	-80,'#b2182b',
	-60,'#d6604d',
	-40,'#f4a582',
	-20,'#fddbc7',
	-10,'#f7f7f7',
	0,'#d1e5f0',
	10,'#92c5de',
	20,'#4393c3',
	50,'#053061'
];

const evLegendRamp = [
	['<0%','#b2182b'],
	['0.5%','#d6604d'],
	['1%','#f4a582'],
	['1.5%','#fddbc7'],
	['2%','#f7f7f7'],
	['4%','#d1e5f0'],
	['8%','#92c5de'],
	['10%','#4393c3'],
	['>12%','#053061']
];
const evColourRamp = [
	0,'#b2182b',
	0.5,'#d6604d',
	1,'#f4a582',
	1.5,'#fddbc7',
	2,'#f7f7f7',
	4,'#d1e5f0',
	8,'#92c5de',
	10,'#4393c3',
	12,'#053061'
];

const vehiclesLegendRamp = [
	['<0.4','#053061'],
	[0.4,'#4393c3'],
	[0.6,'#d1e5f0'],
	[0.8,'#f7f7f7'],
	[1,'#fddbc7'],
	[1.2,'#f4a582'],
	[1.6,'#d6604d'],
	['>2','#b2182b']
];
const vehiclesColourRamp = [
	0,'#053061',
	0.4,'#4393c3',
	0.6,'#d1e5f0',
	0.8,'#f7f7f7',
	1,'#fddbc7',
	1.2,'#f4a582',
	1.6,'#d6604d',
	2,'#b2182b'
];

// PCT route network. The Propensity to Cycle Tool estimates how many people
// could cycle a road under each scenario; the legacy tool coloured the network
// with a step ramp on the selected scenario's rider count, drawing anything
// below one rider fully transparent. The same bands and colours are kept here so
// the two tools agree, and all three scenarios share one scale so they can be
// compared with each other as well as between places.
const pctScenarios = ['bicycle', 'govtarget_slc', 'dutch_slc'];
const pctLegendRamp = [
	['1-9','#9C9C9C'],
	['10-49','#FFFF73'],
	['50-99','#AFFF00'],
	['100-249','#00FFFF'],
	['250-499','#30B0FF'],
	['500-999','#2E5FFF'],
	['1000-1999','#0000FF'],
	['2000+','#FF00C5']
];
const pctColourRamp = [
	1,'#9C9C9C',
	10,'#FFFF73',
	50,'#AFFF00',
	100,'#00FFFF',
	250,'#30B0FF',
	500,'#2E5FFF',
	1000,'#0000FF',
	2000,'#FF00C5'
];


// Expand the ramps over every field the tiles actually contain.
const zoneLegends = {};
const zoneColours = {};

zoneLegends['change_bus_2008_' + transportTphYear] = changeLegendRamp;
zoneColours['change_bus_2008_' + transportTphYear] = changeColourRamp;

transportTphModes.forEach (function (mode) {
	const field = 'tph_daytime_avg_' + transportTphYear + '_' + mode;
	zoneLegends[field] = tphLegendRamp;
	zoneColours[field] = tphColourRamp;
});

['pBEV_PRIVATE', 'pULEV_PRIVATE', 'pBEV_COMPANY', 'pULEV_COMPANY'].forEach (function (field) {
	zoneLegends[field] = evLegendRamp;
	zoneColours[field] = evColourRamp;
});

zoneLegends['vehiclesPHousehold'] = vehiclesLegendRamp;
zoneColours['vehiclesPHousehold'] = vehiclesColourRamp;

const pctLegends = {};
const pctColours = {};

pctScenarios.forEach (function (field) {
	pctLegends[field] = pctLegendRamp;
	pctColours[field] = pctColourRamp;
});


const datasets_extra = {

	// Data layers
	layers: {

	  zones: {
			'id': 'zones',
			'type': 'fill',
			'source': {
			'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/zones_transport_20260828.pmtiles',
				},
			'source-layer': 'zones',
			'paint': {
				'fill-color': '#9c9898',
				'fill-opacity': 0.8,
				'fill-outline-color': '#000000'
			}
		},

		// Propensity to Cycle Tool route network, carried over from the legacy tool.
		// The tiles hold one rider count per scenario (bicycle / govtarget_slc /
		// dutch_slc); pctStyling() below picks the one the layer menu asks for.
		pct: {
			'id': 'pct',
			'type': 'line',
			'source': {
			'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/pct_legacy.pmtiles',
				},
			'source-layer': 'pct',
			'paint': {
				'line-color': '#9C9C9C',
				'line-width': 2
			}
		}


	},

	// Layer styling callbacks functions, each defined below
	layerStyling: {
	  zones:			zonesStyling,
	  pct:				pctStyling,
	},


	// #!# These need to be merged with lineColours
	legends: {
		zones: zoneLegends,
		pct: pctLegends,
	},

	lineColours: {
		zones: zoneColours,
		pct: pctColours,
	},


	// Chart definitions, indexed by map layer ID, then datasource ID, different from NPT wich has one data soruce per modal per map layer
	// I.e. charts > Layer clicked on to trigger modal > datasource to fill the modal
	
	charts: {
	  zones: {
	    zones: {
	      // Data fields
  			// No dataUrl: this modal's data comes from the bins registered at the
  			// top of this file, fetched by capBin.fetchRecord() in ui.js.
  			propertiesField: 'LSOA21CD',
  			titleField: 'LSOA11CD',
  			
  			// Title
  			titlePrefix: 'Neighbourhood Summary: LSOA ',
  			
  			charts: [
  				[
  					// Access Proximity
  					'access_proximity',
  					'Access Proximity',
  					'Description goes here',
  					'Access by public transport'
  				]
  		  ]
	    },
	    
	    PTfrequency: {
  	    
  	    // Data fields
  			// No dataUrl: served from the pt_frequency bin, as above.
  			propertiesField: 'LSOA21CD',
  			titleField: 'LSOA21CD',
  			
  			// Title
  			titlePrefix: 'Neighbourhood Summary: LSOA ',
  			
  			charts: [
  				[
  					// Access Proximity
  					'PTFrequnecy',
  					'PT Frequnecy',
  					'Description goes here',
  					'Public Transport Frequency'
  				]
  		  ]
  		  
  	   
  	  }
	  },
	},
	
	// Popups
	popups: {
	}
};


const datasets = mergeObjects(datasets_extra, datasets_common);


// Function to determine the style column
function getStyleColumn (layerId, datasets)
{
	const style_col_selected = datasets.lineColours.zones.hasOwnProperty(layerId) ? layerId : '_';
	return datasets.lineColours.zones[style_col_selected];
	//return datasets.lineColours.zones['Grade'];
}

// The tile attribute to colour by, taken straight from the layer menu: each
// option's value is the full column name in the tiles.
function getTransportField ()
{
	return document.querySelector ('select.updatelayer[data-layer="zones"][name="field"]').value;
}


// The PCT scenario to colour by, taken straight from the layer menu: each
// option's value is the full column name in the tiles.
function getPctField ()
{
	return document.querySelector ('select.updatelayer[data-layer="pct"][name="field"]').value;
}


// Styling callback for the PCT route network
function pctStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	// Update the legend (even if map layer is off)
	const field = getPctField ();
	createLegend (datasets.legends.pct, field, 'pctlegend');
	
	// Colour by the selected scenario. Roads carrying less than one rider are
	// drawn transparent rather than in the lowest band, as in the legacy tool, and
	// a missing value is treated the same way so 'step' is never handed a null.
	const ramp = (datasets.lineColours.pct[field] || pctColourRamp);
	map.setPaintProperty (layerId, 'line-color', ['case',
		['==', ['typeof', ['get', field]], 'number'],
		['step', ['get', field], 'rgba(0,0,0,0)', ...ramp],
		'rgba(0,0,0,0)'
	]);
}


// Styling callback for data zones (including buildings styling)
function zonesStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	// Update the legend (even if map layer is off)
	const field = getTransportField ();
	createLegend (datasets.legends.zones, field, 'zoneslegend'); // Fixed Legeng for Grades
	
	// Get UI state
	const daysymetricMode = document.querySelector ('input.updatelayer[data-layer="zones"][name="daysymetricmode"]').checked;
	
	// Set paint properties. Features with a null/missing value (e.g. no timetabled
	// services) are shown in near-black to match the 'NA' legend entry, and are
	// excluded from the interpolate ramp to avoid "expected number, found null"
	// evaluation warnings from MapLibre.
	map.setPaintProperty (layerId, 'fill-color', ['case',
		['==', ['typeof', ['get', field]], 'number'],
		['interpolate', ['linear'], ['get', field], ...getStyleColumn (field, datasets)],
		'#111111'
	]);
	map.setPaintProperty (layerId, 'fill-opacity', (daysymetricMode ? 0.1 : 0.8)); // Very faded-out in daysymetric mode, as the buildings are coloured
	map.setPaintProperty (layerId, 'fill-outline-color', 'rgba(0, 0, 0, 0.2)'); 
	
	// Set buildings layer colour/visibility
	const buildingColour = getBuildingsColour(settings);
	//console.log(buildingColour);
	map.setPaintProperty ('buildings', 'fill-extrusion-color', (buildingColour || '#9c9898'));
	//map.setPaintProperty ('buildings', 'fill-extrusion-color', '#9c9898');
	map.setLayoutProperty ('buildings', 'visibility', (buildingColour ? 'visible' : 'none'));
}


// Function to determine the buildings colour
function getBuildingsColour (settings)
{
	// If datazones is off, buildings shown, if vector style, as static colour appropriate to the basemap
	
	if (!document.querySelector ('input.showlayer[data-layer="zones"]').checked) {
		const styleName = document.querySelector('#basemapform input:checked').value;	// Same as nptUi.getBasemapStyle()
		return settings.basemapStyles[styleName].buildingColour;
	}
	
	// If dasymetric mode, use a colour set based on the layer (guarding null values
	// so buildings in areas without data render near-black rather than erroring)
	if (document.querySelector ('input.updatelayer[data-layer="zones"][name="daysymetricmode"]').checked) {
		const field = getTransportField ();
		return ['case',
			['==', ['typeof', ['get', field]], 'number'],
			['interpolate', ['linear'], ['get', field], ...getStyleColumn (field, datasets)],
			'#111111'
		];
	}
	
	// Default to gray
	return '#9c9898';
}








