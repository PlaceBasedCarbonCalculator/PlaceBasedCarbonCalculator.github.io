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
			'source-layer': 'postcodes',
			'paint': {
				'fill-color': '#9c9898',
				'fill-opacity': 0.8,
				'fill-outline-color': '#000000'
			}
		},
		
		epc_dom: {
			'id': 'epc_dom',
			'type': 'circle',
			'source': {
			'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/epc_dom.pmtiles',
				},
			'source-layer': 'epc_dom',
			'paint': {
			  // make circles larger as the user zooms from z12 to z22
        'circle-radius': {
          'base': 2.5,
          'stops': [
            [8, 3],
            [22, 180]
          ]
        }
			}
		},
		
		
		epc_nondom: {
			'id': 'epc_nondom',
			'type': 'circle',
			'source': {
			'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/epc_nondom.pmtiles',
				},
			'source-layer': 'epc_nondom',
			'paint': {
			  // make circles larger as the user zooms from z12 to z22
        'circle-radius': {
          'base': 2.5,
          'stops': [
            [8, 3],
            [22, 180]
          ]
        }
			}
		}
	},
	
	// Layer styling callbacks functions, each defined below
	layerStyling: {
	  postcodes:	postcodesStyling,
	  epc_dom:    EPCDomStyling,
	  epc_nondom: EPCNonDomStyling
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
		epc_dom: {
			'cur_rate': [
				['A','#0e7e58'],
  			['B' ,'#2aa45b'],
  			['C','#8cbc42'],
  			['D','#f6cc15'],
  			['E' ,'#f2a867'],
  			['F','#f17e23'],
  			['G','#e31d3e']
			],
			'b_type': [
				['Detached','#1f78b4'],
  			['Semi-Detached' ,'#33a02c'],
  			['Mid-Terrace','#e31a1c'],
  			['Enclosed Mid-Terrace','#ff7f00'],
  			['End-Terrace' ,'#6a3d9a'],
  			['Enclosed End-Terrace','#b15928']
			],
			'p_type': [
				['Flat','#e31a1c'],
  			['House' ,'#33a02c'],
  			['Maisonette','#1f78b4'],
  			['Bungalow','#6a3d9a'],
  			['Park home' ,'#ff7f00']
			],
			'age': [
				['<1900','#9e0142'],
  			['1900-1929' ,'#d53e4f'],
  			['1930-1949','#f46d43'],
  			['1950-1966','#fdae61'],
  			['1967-1975' ,'#fee08b'],
  			['1976-1982','#ffffbf'],
  			['1983-1990','#e6f598'],
  			['1991-1995','#abdda4'],
  			['1996-2002' ,'#66c2a5'],
  			['2003-2006','#3288bd'],
  			['2007-2011','#5e4fa2'],
  			['>2012','#934fa2']
			],
			'year': [
				['<2014','#e31d3e'],
  			['2016','#f17e23'],
  			['2018','#f2a867'],
  			['2020','#f6cc15'],
  			['2022','#8cbc42'],
  			['2024','#0e7e58']
			],
			'area': [
				['<40','#4d9221'],
  			['40-60' ,'#7fbc41'],
  			['60-80','#b8e186'],
  			['80-100','#e6f5d0'],
  			['100-120' ,'#fde0ef'],
  			['120-140','#f1b6da'],
  			['140-160','#de77ae'],
  			['>160','#c51b7d']
			],
			
			'floor_ee': [
				['Very Good','#2c7bb6'],
  			['Good' ,'#abd9e9'],
  			['Average','#ffffbf'],
  			['Poor','#fdae61'],
  			['Very Poor' ,'#d7191c']
			],
			'water_ee': [
				['Very Good','#2c7bb6'],
  			['Good' ,'#abd9e9'],
  			['Average','#ffffbf'],
  			['Poor','#fdae61'],
  			['Very Poor' ,'#d7191c']
			],
			'wind_ee': [
				['Very Good','#2c7bb6'],
  			['Good' ,'#abd9e9'],
  			['Average','#ffffbf'],
  			['Poor','#fdae61'],
  			['Very Poor' ,'#d7191c']
			],
			'wall_ee': [
				['Very Good','#2c7bb6'],
  			['Good' ,'#abd9e9'],
  			['Average','#ffffbf'],
  			['Poor','#fdae61'],
  			['Very Poor' ,'#d7191c']
			],
			'roof_ee': [
				['Very Good','#2c7bb6'],
  			['Good' ,'#abd9e9'],
  			['Average','#ffffbf'],
  			['Poor','#fdae61'],
  			['Very Poor' ,'#d7191c']
			],
			'heat_ee': [
				['Very Good','#2c7bb6'],
  			['Good' ,'#abd9e9'],
  			['Average','#ffffbf'],
  			['Poor','#fdae61'],
  			['Very Poor' ,'#d7191c']
			],
			'con_ee': [
				['Very Good','#2c7bb6'],
  			['Good' ,'#abd9e9'],
  			['Average','#ffffbf'],
  			['Poor','#fdae61'],
  			['Very Poor' ,'#d7191c']
			],
			'light_ee': [
				['Very Good','#2c7bb6'],
  			['Good' ,'#abd9e9'],
  			['Average','#ffffbf'],
  			['Poor','#fdae61'],
  			['Very Poor' ,'#d7191c']
			],
		  'sol_wat': [
				['yes','#fdae61'],
  			['no','#2c7bb6']
			]
			
		},
		
		epc_nondom: {
			'band': [
				['A','#0e7e58'],
  			['B' ,'#2aa45b'],
  			['C','#8cbc42'],
  			['D','#f6cc15'],
  			['E' ,'#f2a867'],
  			['F','#f17e23'],
  			['G','#e31d3e']
			],
			'transaction': [
				['Detached','#1f78b4'],
  			['Semi-Detached' ,'#33a02c'],
  			['Mid-Terrace','#e31a1c'],
  			['Enclosed Mid-Terrace','#ff7f00'],
  			['End-Terrace' ,'#6a3d9a'],
  			['Enclosed End-Terrace','#b15928']
			],
			'year': [
				['<2014','#e31d3e'],
  			['2016','#f17e23'],
  			['2018','#f2a867'],
  			['2020','#f6cc15'],
  			['2022','#8cbc42'],
  			['2024','#0e7e58']
			],
			'area': [
				['<40','#4d9221'],
  			['40-60' ,'#7fbc41'],
  			['60-80','#b8e186'],
  			['80-100','#e6f5d0'],
  			['100-120' ,'#fde0ef'],
  			['120-140','#f1b6da'],
  			['140-160','#de77ae'],
  			['>160','#c51b7d']
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
		
		epc_dom: {
			'cur_rate': [
				'A','#0e7e58',
  			'B' ,'#2aa45b',
  			'C','#8cbc42',
  			'D','#f6cc15',
  			'E' ,'#f2a867',
  			'F','#f17e23',
  			'G','#e31d3e',
  			'#000000'
			],
			'b_type': [
				'Detached','#1f78b4',
  			'Semi-Detached' ,'#33a02c',
  			'Mid-Terrace','#e31a1c',
  			'Enclosed Mid-Terrace','#ff7f00',
  			'End-Terrace' ,'#6a3d9a',
  			'Enclosed End-Terrace','#b15928',
  			'#000000'
			],
			'p_type': [
				'Flat','#e31a1c',
  			'House' ,'#33a02c',
  			'Maisonette','#1f78b4',
  			'Bungalow','#6a3d9a',
  			'Park home' ,'#ff7f00',
  			'#000000'
			],
			'age': [
				'before 1900','#9e0142',
  			'1900-1929' ,'#d53e4f',
  			'1930-1949','#f46d43',
  			'1950-1966','#fdae61',
  			'1967-1975' ,'#fee08b',
  			'1976-1982','#ffffbf',
  			'1983-1990','#e6f598',
  			'1991-1995','#abdda4',
  			'1996-2002' ,'#66c2a5',
  			'2003-2006','#3288bd',
  			'2007-2011','#5e4fa2',
  			'2012 onwards','#934fa2',
  			'#000000'
			],
			'year': [
				2014,'#e31d3e',
  			2016,'#f17e23',
  			2018,'#f6cc15',
  			2020 ,'#f2a867',
  			2022,'#8cbc42',
  			2024,'#0e7e58'
			],
			'area': [
				0,'#4d9221',
  			40 ,'#7fbc41',
  			60,'#b8e186',
  			80,'#e6f5d0',
  			100 ,'#fde0ef',
  			120,'#f1b6da',
  			140,'#de77ae',
  			160,'#c51b7d'
			],
			
			
			'floor_ee': [
				'Very Good','#2c7bb6',
  			'Good' ,'#abd9e9',
  			'Average','#ffffbf',
  			'Poor','#fdae61',
  			'Very Poor' ,'#d7191c',
  			'#000000'
			],
			'water_ee': [
				'Very Good','#2c7bb6',
  			'Good' ,'#abd9e9',
  			'Average','#ffffbf',
  			'Poor','#fdae61',
  			'Very Poor' ,'#d7191c',
  			'#000000'
			],
			'wind_ee': [
				'Very Good','#2c7bb6',
  			'Good' ,'#abd9e9',
  			'Average','#ffffbf',
  			'Poor','#fdae61',
  			'Very Poor' ,'#d7191c',
  			'#000000'
			],
			'wall_ee': [
				'Very Good','#2c7bb6',
  			'Good' ,'#abd9e9',
  			'Average','#ffffbf',
  			'Poor','#fdae61',
  			'Very Poor' ,'#d7191c',
  			'#000000'
			],
			'roof_ee': [
				'Very Good','#2c7bb6',
  			'Good' ,'#abd9e9',
  			'Average','#ffffbf',
  			'Poor','#fdae61',
  			'Very Poor' ,'#d7191c',
  			'#000000'
			],
			'heat_ee': [
				'Very Good','#2c7bb6',
  			'Good' ,'#abd9e9',
  			'Average','#ffffbf',
  			'Poor','#fdae61',
  			'Very Poor' ,'#d7191c',
  			'#000000'
			],
			'con_ee': [
				'Very Good','#2c7bb6',
  			'Good' ,'#abd9e9',
  			'Average','#ffffbf',
  			'Poor','#fdae61',
  			'Very Poor' ,'#d7191c',
  			'#000000'
			],
			'light_ee': [
				'Very Good','#2c7bb6',
  			'Good' ,'#abd9e9',
  			'Average','#ffffbf',
  			'Poor','#fdae61',
  			'Very Poor' ,'#d7191c',
  			'#000000'
			],
		  'sol_wat': [
				'yes','#fdae61',
  			'no','#2c7bb6',
  			'#000000'
			]
			
		},
		
		epc_nondom: {
			'band': [
				'A','#0e7e58',
  			'B' ,'#2aa45b',
  			'C','#8cbc42',
  			'D','#f6cc15',
  			'E' ,'#f2a867',
  			'F','#f17e23',
  			'G','#e31d3e',
  			'#000000'
			],
			'transaction': [
				'Detached','#1f78b4',
  			'Semi-Detached' ,'#33a02c',
  			'Mid-Terrace','#e31a1c',
  			'Enclosed Mid-Terrace','#ff7f00',
  			'End-Terrace' ,'#6a3d9a',
  			'Enclosed End-Terrace','#b15928',
  			'#000000'
			],
			'year': [
				2014,'#e31d3e',
  			2016,'#f17e23',
  			2018,'#f6cc15',
  			2020 ,'#f2a867',
  			2022,'#8cbc42',
  			2024,'#0e7e58'
			],
			'area': [
				0,'#4d9221',
  			40 ,'#7fbc41',
  			60,'#b8e186',
  			80,'#e6f5d0',
  			100 ,'#fde0ef',
  			120,'#f1b6da',
  			140,'#de77ae',
  			160,'#c51b7d'
			]
			
		},
	},
	
	// Chart definitions, indexed by map layer ID
	charts: {
	  postcodes: {
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
	  }
	  
	},
	
	// Popups
	popups: {
	  'epc_dom': {
			layerId: 'epc_dom',
			templateId: 'epc_dom-popup',
			preprocessingCallback: popupCallback,	// Defined below
		}
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


// Function to determine the style column
function getEPCDomStyleColumn (layerId, datasets)
{
	const style_col_selected = datasets.lineColours.epc_dom.hasOwnProperty(layerId) ? layerId : '_';
	//console.log(style_col_selected);
	//console.log(datasets.lineColours.epc_dom[style_col_selected]);
	return datasets.lineColours.epc_dom[style_col_selected];
}

// Styling callback for data epc_dom (including buildings styling)
function EPCDomStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	// Update the legend (even if map layer is off)
	const field = document.querySelector ('select.updatelayer[data-layer="epc_dom"][name="field"]').value

	createLegend (datasets.legends.epc_dom, field, 'epcdomlegend');
	//console.log("Field is ",field);
	const style = getEPCDomStyleColumn (field, datasets);
	//console.log(style);

  let interpolate = ['area', 'year'];

	// Set paint properties
	if(interpolate.includes(field)){
	  map.setPaintProperty (layerId, 'circle-color', ['interpolate', ['linear'], ['get', field], ...style]);
	} else {
	  map.setPaintProperty (layerId, 'circle-color', ['match', ['get', field], ...style]);
	}

}

// Function to determine the style column
function getEPCNonDomStyleColumn (layerId, datasets)
{
	const style_col_selected = datasets.lineColours.epc_nondom.hasOwnProperty(layerId) ? layerId : '_';
	//console.log(style_col_selected);
	//console.log(datasets.lineColours.epc_dom[style_col_selected]);
	return datasets.lineColours.epc_nondom[style_col_selected];
}

// Styling callback for data epc_dom (including buildings styling)
function EPCNonDomStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	// Update the legend (even if map layer is off)
	const field = document.querySelector ('select.updatelayer[data-layer="epc_nondom"][name="field"]').value

	createLegend (datasets.legends.epc_nondom, field, 'epcnondomlegend');
	//console.log("Field is ",field);
	const style = getEPCNonDomStyleColumn (field, datasets);
	//console.log(style);

  let interpolate = ['area', 'year'];

	// Set paint properties
	if(interpolate.includes(field)){
	  map.setPaintProperty (layerId, 'circle-color', ['interpolate', ['linear'], ['get', field], ...style]);
	} else {
	  map.setPaintProperty (layerId, 'circle-color', ['match', ['get', field], ...style]);
	}

}




