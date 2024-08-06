// Data definitions, i.e. layers, charts, etc.
const datasets_extra = {
	
	// Data layers
	layers: {
	  postcodes: {
			'id': 'postcodes',
			'type': 'fill',
			'source': {
			'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/postcodes.pmtiles',
				},
			'source-layer': 'postcode',
			'paint': {
				'fill-color': '#9c9898',
				'fill-opacity': 0.8,
				'fill-outline-color': '#000000'
			}
		}
	},
	
	// Layer styling callbacks functions, each defined below
	layerStyling: {
	  postcodes:			postcodesStyling,
	},
	
	
	// #!# These need to be merged with lineColours
	legends: {

		postcodes: {
			'Grade': [
				['A+','#313695'],
  			['A' ,'#4575b4'],
  			['A-','#4575b4'],
  			['B+','#74add1'],
  			['B' ,'#abd9e9'],
  			['B-','#abd9e9'],
  			['C+','#e0f3f8'],
  			['C' ,'#e0f3f8'],
  			['C-','#ffffbf'],
  			['D+','#ffffbf'],
  			['D' ,'#fee090'],
  			['D-','#fee090'],
  			['E+','#fdae61'],
  			['E' ,'#fdae61'],
  			['E-','#f46d43'],
  			['F+','#d73027'],
  			['F' ,'#d73027'],
  			['F-','#a50026']
			]
		},
	},
	
	lineColours: {
	  postcodes: {
			'Grade': [
				'A+','#313695',
  			'A' ,'#4575b4',
  			'A-','#4575b4',
  			'B+','#74add1',
  			'B' ,'#abd9e9',
  			'B-','#abd9e9',
  			'C+','#e0f3f8',
  			'C' ,'#e0f3f8',
  			'C-','#ffffbf',
  			'D+','#ffffbf',
  			'D' ,'#fee090',
  			'D-','#fee090',
  			'E+','#fdae61',
  			'E' ,'#fdae61',
  			'E-','#f46d43',
  			'F+','#d73027',
  			'F' ,'#d73027',
  			'F-','#a50026',
  			'#000000'
			]
		},
	},
	
	// Chart definitions, indexed by map layer ID
	charts: {
	  postcodes : {
	    // Data fields
  			// #!# Should use a main server URL setting
  			dataUrl: 'https://pbcc.blob.core.windows.net/pbcc-data/Postcode/%id.json',
  			propertiesField: 'postcode',
  			titleField: 'postcode',
  			
  			// Title
  			titlePrefix: 'Postcode Summary: ',
  			
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

//console.log(datasets_common);
const datasets = mergeObjects(datasets_extra, datasets_common);
//const datasets = { ...datasets_common, ...datasets_extra };
//console.log(datasets);

// Function to determine the style column
function getStyleColumn (layerId, datasets)
{
	const style_col_selected = datasets.lineColours.postcodes.hasOwnProperty(layerId) ? layerId : '_';
	return datasets.lineColours.postcodes['Grade'];
}

// Styling callback for data postcodes (including buildings styling)
function postcodesStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	// Update the legend (even if map layer is off)
	const field = document.querySelector ('select.updatelayer[data-layer="postcodes"][name="field"]').value
	createLegend (datasets.legends.postcodes, "Grade", 'postcodeslegend'); // Fixed Legeng for Grades

	// Set paint properties
	//map.setPaintProperty (layerId, 'fill-color', ['step', ['get', field], getStyleColumn (field, datasets)]);
	//map.setPaintProperty (layerId, 'fill-color', '#000000');
	map.setPaintProperty (layerId, 'fill-color', ['match', ['get', field], ...getStyleColumn (field, datasets)]);
	map.setPaintProperty (layerId, 'fill-opacity', 0.8); 
	
	// Set buildings layer colour/visibility
	const buildingColour = getBuildingsColour(settings);
	map.setPaintProperty ('buildings', 'fill-extrusion-color', (buildingColour || '#9c9898'));
	map.setLayoutProperty ('buildings', 'visibility', (buildingColour ? 'visible' : 'none'));
	map.setPaintProperty (layerId, 'fill-outline-color', 'rgba(0, 0, 0, 0.2)'); 
	
	
}

// Function to determine the buildings colour
function getBuildingsColour (settings)
{
	// Default to gray
	return '#9c9898';
}







