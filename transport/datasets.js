// Chart Globals
var accessChart;


// Data definitions, i.e. layers, charts, etc.
const datasets_extra = {
	
	// Data layers
	layers: {
	  
	  zones: {
			'id': 'zones',
			'type': 'fill',
			'source': {
			'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/zones_transport.pmtiles',
				},
			'source-layer': 'zones',
			'paint': {
				'fill-color': '#9c9898',
				'fill-opacity': 0.8,
				'fill-outline-color': '#000000'
			}
		}/*,
		
		buildings: {
			'id': 'buildings',
			'type': 'fill',
			'source': {
			'type': 'vector',
				'url': 'pmtiles://../tiles/buildings.pmtiles',
				},
			'source-layer': 'buildings',
			'paint': {
				'fill-color': '#9c9898',
				'fill-opacity': 0.8,
				'fill-outline-color': '#000000'
			}
		}
		*/
	},
	
	// Layer styling callbacks functions, each defined below
	layerStyling: {
	  zones:			zonesStyling,
	},
	
	
	// #!# These need to be merged with lineColours
	legends: {

		zones: {
			'change_bus_2008_2023': [
				[0,'#313695'],
  			[1 ,'#4575b4'],
  			[4,'#4575b4'],
  			[10,'#74add1'],
  			[20 ,'#abd9e9'],
  			[30,'#abd9e9'],
  			[40,'#e0f3f8'],
  			[50 ,'#e0f3f8'],
  			[60,'#ffffbf'],
  			[70,'#ffffbf'],
  			[80 ,'#fee090'],
  			[90,'#fee090'],
  			[100,'#fdae61'],
  			[150 ,'#fdae61'],
  			[200,'#f46d43'],
  			[300,'#d73027'],
  			[400 ,'#d73027'],
  			[500,'#a50026']
			],
			'tph_daytime_avg_2023_0': [
				[0  ,'#313695'],
  			[1  ,'#4575b4'],
  			[2  ,'#4575b4'],
  			[5 ,'#74add1'],
  			[10 ,'#abd9e9'],
  			[15 ,'#abd9e9'],
  			[20 ,'#e0f3f8'],
  			[40 ,'#e0f3f8'],
  			[60 ,'#ffffbf'],
  			[80 ,'#ffffbf'],
  			[100 ,'#fee090'],
  			[200 ,'#fee090'],
  			[300,'#fdae61'],
  			[400,'#fdae61'],
  			[500,'#a50026']
  		],
  		'tph_daytime_avg_2023_1': [
				[0  ,'#313695'],
  			[1  ,'#4575b4'],
  			[2  ,'#4575b4'],
  			[5 ,'#74add1'],
  			[10 ,'#abd9e9'],
  			[15 ,'#abd9e9'],
  			[20 ,'#e0f3f8'],
  			[40 ,'#e0f3f8'],
  			[60 ,'#ffffbf'],
  			[80 ,'#ffffbf'],
  			[100 ,'#fee090'],
  			[200 ,'#fee090'],
  			[300,'#fdae61'],
  			[400,'#fdae61'],
  			[500,'#a50026']
  		],
  		'tph_daytime_avg_2023_2': [
				[0  ,'#313695'],
  			[1  ,'#4575b4'],
  			[2  ,'#4575b4'],
  			[5 ,'#74add1'],
  			[10 ,'#abd9e9'],
  			[15 ,'#abd9e9'],
  			[20 ,'#e0f3f8'],
  			[40 ,'#e0f3f8'],
  			[60 ,'#ffffbf'],
  			[80 ,'#ffffbf'],
  			[100 ,'#fee090'],
  			[200 ,'#fee090'],
  			[300,'#fdae61'],
  			[400,'#fdae61'],
  			[500,'#a50026']
  		],
  		'tph_daytime_avg_2023_3': [
				[0  ,'#313695'],
  			[1  ,'#4575b4'],
  			[2  ,'#4575b4'],
  			[5 ,'#74add1'],
  			[10 ,'#abd9e9'],
  			[15 ,'#abd9e9'],
  			[20 ,'#e0f3f8'],
  			[40 ,'#e0f3f8'],
  			[60 ,'#ffffbf'],
  			[80 ,'#ffffbf'],
  			[100 ,'#fee090'],
  			[200 ,'#fee090'],
  			[300,'#fdae61'],
  			[400,'#fdae61'],
  			[500,'#a50026']
  		],
  		'tph_daytime_avg_2023_4': [
				[0  ,'#313695'],
  			[1  ,'#4575b4'],
  			[2  ,'#4575b4'],
  			[5 ,'#74add1'],
  			[10 ,'#abd9e9'],
  			[15 ,'#abd9e9'],
  			[20 ,'#e0f3f8'],
  			[40 ,'#e0f3f8'],
  			[60 ,'#ffffbf'],
  			[80 ,'#ffffbf'],
  			[100 ,'#fee090'],
  			[200 ,'#fee090'],
  			[300,'#fdae61'],
  			[400,'#fdae61'],
  			[500,'#a50026']
  		]
		},
	},
	
	lineColours: {
	  zones: {
			'change_bus_2008_2023': [
				-100,'#313695',
  			1 ,'#4575b4',
  			4,'#4575b4',
  			10,'#74add1',
  			20 ,'#abd9e9',
  			30,'#abd9e9',
  			40,'#e0f3f8',
  			50 ,'#e0f3f8',
  			60,'#ffffbf',
  			70,'#ffffbf',
  			80 ,'#fee090',
  			90,'#fee090',
  			100,'#fdae61',
  			150 ,'#fdae61',
  			200,'#f46d43',
  			300,'#d73027',
  			400 ,'#d73027',
  			500,'#a50026'
			],
			'tph_daytime_avg_2023_0': [
				0  ,'#313695',
  			1  ,'#4575b4',
  			2  ,'#4575b4',
  			5 ,'#74add1',
  			10 ,'#abd9e9',
  			15 ,'#abd9e9',
  			20 ,'#e0f3f8',
  			40 ,'#e0f3f8',
  			60 ,'#ffffbf',
  			80 ,'#ffffbf',
  			100 ,'#fee090',
  			200 ,'#fee090',
  			300,'#fdae61',
  			400,'#fdae61',
  			500,'#a50026'
			],
			'tph_daytime_avg_2023_1': [
				0  ,'#313695',
  			1  ,'#4575b4',
  			2  ,'#4575b4',
  			5 ,'#74add1',
  			10 ,'#abd9e9',
  			15 ,'#abd9e9',
  			20 ,'#e0f3f8',
  			40 ,'#e0f3f8',
  			60 ,'#ffffbf',
  			80 ,'#ffffbf',
  			100 ,'#fee090',
  			200 ,'#fee090',
  			300,'#fdae61',
  			400,'#fdae61',
  			500,'#a50026'
			],
			'tph_daytime_avg_2023_2': [
				0  ,'#313695',
  			1  ,'#4575b4',
  			2  ,'#4575b4',
  			5 ,'#74add1',
  			10 ,'#abd9e9',
  			15 ,'#abd9e9',
  			20 ,'#e0f3f8',
  			40 ,'#e0f3f8',
  			60 ,'#ffffbf',
  			80 ,'#ffffbf',
  			100 ,'#fee090',
  			200 ,'#fee090',
  			300,'#fdae61',
  			400,'#fdae61',
  			500,'#a50026'
			],
			'tph_daytime_avg_2023_3': [
				0  ,'#313695',
  			1  ,'#4575b4',
  			2  ,'#4575b4',
  			5 ,'#74add1',
  			10 ,'#abd9e9',
  			15 ,'#abd9e9',
  			20 ,'#e0f3f8',
  			40 ,'#e0f3f8',
  			60 ,'#ffffbf',
  			80 ,'#ffffbf',
  			100 ,'#fee090',
  			200 ,'#fee090',
  			300,'#fdae61',
  			400,'#fdae61',
  			500,'#a50026'
			],
			'tph_daytime_avg_2023_4': [
				0  ,'#313695',
  			1  ,'#4575b4',
  			2  ,'#4575b4',
  			5 ,'#74add1',
  			10 ,'#abd9e9',
  			15 ,'#abd9e9',
  			20 ,'#e0f3f8',
  			40 ,'#e0f3f8',
  			60 ,'#ffffbf',
  			80 ,'#ffffbf',
  			100 ,'#fee090',
  			200 ,'#fee090',
  			300,'#fdae61',
  			400,'#fdae61',
  			500,'#a50026'
			]
		},
	},
	
	
	
	// Chart definitions, indexed by map layer ID
	charts: {
	  zones: {
	    
	    // Data fields
			// #!# Should use a main server URL setting
			dataUrl: 'https://pbcc.blob.core.windows.net/pbcc-data/Access/%id.json',
			propertiesField: 'LSOA21CD',
			titleField: 'LSOA11CD',
			
			// Title
			titlePrefix: 'Neighbourhood Summary: ',
			
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
			// #!# Should use a main server URL setting
			dataUrl: 'https://pbcc.blob.core.windows.net/pbcc-data/PTFrequnecy/%id.json',
			propertiesField: 'LSOA21CD',
			titleField: 'LSOA21CD',
			
			// Title
			titlePrefix: 'Neighbourhood Summary: ',
			
			charts: [
				[
					// Access Proximity
					'access_proximity',
					'Access Proximity',
					'Description goes here',
					'Access by public transport'
				]
		  ]
		  
	   
	  }
	  
	},
	
	// Popups
	popups: {
	}
};


const datasets = { ...datasets_common, ...datasets_extra };


// Function to determine the style column
function getStyleColumn (layerId, datasets)
{
	const style_col_selected = datasets.lineColours.zones.hasOwnProperty(layerId) ? layerId : '_';
	return datasets.lineColours.zones[style_col_selected];
	//return datasets.lineColours.zones['Grade'];
}

// Styling callback for data zones (including buildings styling)
function zonesStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	// Update the legend (even if map layer is off)
	const field = document.querySelector ('select.updatelayer[data-layer="zones"][name="field"]').value
	createLegend (datasets.legends.zones, field, 'zoneslegend'); // Fixed Legeng for Grades
	
	// Get UI state
	// const daysymetricMode = document.querySelector ('input.updatelayer[data-layer="zones"][name="daysymetricmode"]').checked;
	
	// Set paint properties
	//map.setPaintProperty (layerId, 'fill-color', ['step', ['get', field], getStyleColumn (field, datasets)]);
	// map.setPaintProperty (layerId, 'fill-color', ['interpolate', ['linear'], ['get', field], ...getStyleColumn (field, datasets)]);
	//console.log({'fill-color' : ['interpolate', ['linear'], ['get', field], ...getStyleColumn (field, datasets)]});
	map.setPaintProperty (layerId, 'fill-color', ['interpolate', ['linear'], ['get', field], ...getStyleColumn (field, datasets)]);
	map.setPaintProperty (layerId, 'fill-opacity', 0.8); 
	
	// Set buildings layer colour/visibility
	const buildingColour = getBuildingsColour(settings);
	map.setPaintProperty ('buildings', 'fill-extrusion-color', (buildingColour || '#9c9898'));
	//map.setPaintProperty ('buildings', 'fill-extrusion-color', '#9c9898');
	map.setLayoutProperty ('buildings', 'visibility', (buildingColour ? 'visible' : 'none'));
}


// Function to determine the buildings colour
function getBuildingsColour (settings)
{
	// If datazones is off, buildings shown, if vector style, as static colour appropriate to the basemap
	/*
	if (!document.querySelector ('input.showlayer[data-layer="zones"]').checked) {
		const styleName = document.querySelector('#basemapform input:checked').value;	// Same as nptUi.getBasemapStyle()
		return settings.basemapStyles[styleName].buildingColour;
	}
	
	// If dasymetric mode, use a colour set based on the layer
	if (document.querySelector ('input.updatelayer[data-layer="zones"][name="daysymetricmode"]').checked) {
		const field = document.querySelector ('select.updatelayer[data-layer="zones"][name="field"]').value;
		return ['match', ['get', field], ...getStyleColumn (field, datasets)];
	}
	*/
	// Default to gray
	return '#9c9898';
}








