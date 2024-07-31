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
				['<-50','#67001f'],
        [-50,'#b2182b'],
        [-20,'#d6604d'],
        [-10,'#f4a582'],
        [-5,'#fddbc7'],
        [-1,'#f7f7f7'],
        [0,'#d1e5f0'],
        [1,'#92c5de'],
        [5,'#4393c3'],
        ['>20','#053061']
			],
			'tph_daytime_avg_2023_0': [
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
  		],
  		
  		'tph_daytime_avg_2023_1': [
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
  		],
  		'tph_daytime_avg_2023_2': [
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
  		],
  		'tph_daytime_avg_2023_3': [
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
  		],
  		'tph_daytime_avg_2023_4': [
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
  		]
		},
	},
	
	lineColours: {
	  zones: {
			'change_bus_2008_2023': [
				-1000,'#67001f',
        -50,'#b2182b',
        -20,'#d6604d',
        -10,'#f4a582',
        -5,'#fddbc7',
        -1,'#f7f7f7',
        0,'#d1e5f0',
        1,'#92c5de',
        5,'#4393c3',
        20,'#053061'
			],
			'tph_daytime_avg_2023_0': [
				0,'#b2182b',
        1,'#d6604d',
        2,'#f4a582',
        5,'#fddbc7',
        10,'#f7f7f7',
        20,'#d1e5f0',
        30,'#92c5de',
        50,'#4393c3',
        100,'#053061'
			],
			'tph_daytime_avg_2023_1': [
				0,'#b2182b',
        1,'#d6604d',
        2,'#f4a582',
        5,'#fddbc7',
        10,'#f7f7f7',
        20,'#d1e5f0',
        30,'#92c5de',
        50,'#4393c3',
        100,'#053061'
			],
			'tph_daytime_avg_2023_2': [
				0,'#b2182b',
        1,'#d6604d',
        2,'#f4a582',
        5,'#fddbc7',
        10,'#f7f7f7',
        20,'#d1e5f0',
        30,'#92c5de',
        50,'#4393c3',
        100,'#053061'
			],
			'tph_daytime_avg_2023_3': [
				0,'#b2182b',
        1,'#d6604d',
        2,'#f4a582',
        5,'#fddbc7',
        10,'#f7f7f7',
        20,'#d1e5f0',
        30,'#92c5de',
        50,'#4393c3',
        100,'#053061'
			],
			'tph_daytime_avg_2023_4': [
				0,'#b2182b',
        1,'#d6604d',
        2,'#f4a582',
        5,'#fddbc7',
        10,'#f7f7f7',
        20,'#d1e5f0',
        30,'#92c5de',
        50,'#4393c3',
        100,'#053061'
			]
		},
	},
	
	
	
	// Chart definitions, indexed by map layer ID, then datasource ID, different from NPT wich has one data soruce per modal per map layer
	// I.e. charts > Layer clicked on to trigger modal > datasource to fill the modal
	
	charts: {
	  zones: {
	    zones: {
	      // Data fields
  			// #!# Should use a main server URL setting
  			dataUrl: 'https://pbcc.blob.core.windows.net/pbcc-data/Access/%id.json',
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
  			// #!# Should use a main server URL setting
  			dataUrl: 'https://pbcc.blob.core.windows.net/pbcc-data/PTfrequency/%id.json',
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
	map.setPaintProperty (layerId, 'fill-outline-color', 'rgba(0, 0, 0, 0.2)'); 
	
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








