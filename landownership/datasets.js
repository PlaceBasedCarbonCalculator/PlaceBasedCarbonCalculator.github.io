// Data definitions, i.e. layers, charts, etc.
const datasets_extra = {
	
	// Data layers
	layers: {
		
		inspire: {
			'id': 'inspire',
			'type': 'fill',
			'source': {
			'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/inspire.pmtiles',
				},
			'source-layer': 'inspire',
			'paint': {
				'fill-color': '#bc80bd',
				'fill-opacity': 0.3,
				'fill-outline-color': '#000000'
			}
		},
		
		landowners: {
			'id': 'landowners',
			'type': 'circle',
			'source': {
				'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/landowners.pmtiles',
			},
			'source-layer': 'landowners',
			'paint': {
				"circle-color": [
          			'match',
          			['get', 'Category'],
          			'Co-operative Society (Company)','#a6cee3',
                'Co-operative Society (Corporate Body)','#a6cee3',
                'Community Benefit Society (Company)','#1f78b4',
                'Community Benefit Society (Corporate Body)','#1f78b4',
                'Housing Association Co-operative Society (Company)','#33a02c',
                'Housing Association Co-operative Society (Corporate Body)','#33a02c',
                'Housing Association Community Benefit Society (Company)','#33a02c',
                'Housing Association Community Benefit Society (Corporate Body)','#33a02c',
                'Housing Association Registered Society (Company)','#33a02c',
                'Housing Association Registered Society (Corporate Body)','#33a02c',
                'Housing Association/Society (Company)','#33a02c',
                'Housing Association/Society (Corporate Body)','#33a02c',
                'Industrial and Provident Society (Company)','#b2df8a',
                'Industrial and Provident Society (Corporate Body)','#b2df8a',
                'Local Authority','#6a3d9a',
                'County Council','#6a3d9a',
                'Registered Society (Company)','#ff7f00',
                'Registered Society (Corporate Body)','#ff7f00',
                'Unlimited Company','#cab2d6',
                'Corporate Body','#b15928',
                'Limited Company or Public Limited Company','#e31a1c',
                'Limited Liability Partnership','#fb9a99',
          			/* other */ '#000000'
          			],
				// make circles larger as the user zooms
				'circle-radius': {
					'base': 2.5,
          'stops': [
            [8, 3],
            [22, 180]
          ]
				},
			}
		}
	},
	
	// Layer styling callbacks functions, each defined below
	layerStyling: {
	  landowners:			landownersStyling,
	},
	
	
	// #!# These need to be merged with lineColours
	legends: {
		
		
		
		landowners: {
			'Category': [
				['Community Benefit Society', 	'#1f78b4'],
				['Housing Association',		'#33a02c'],
				['Industrial and Provident Society', 	'#b2df8a'],
				['Local Authority/County Council', 	'#6a3d9a'],
				['Registered Society', 	'#ff7f00'],
				['Unlimited Company', 	'#cab2d6'],
				['Corporate Body', 	'#b15928'],
				['Limited Company or Public Limited Company', 	'#e31a1c'],
				['Limited Liability Partnership', 	'#fb9a99'],
				['Other',	'#000000'],
			],
			'geocode_type': [
				['Address',		      '#4daf4a'],
				['Admin Division 1',	'#bd0026'],
				['Admin Division 2', 	'#f03b20'],
				['Admin Division 3',	'#fd8d3c'],
				['Region',		'#fecc5c'],
				['Populated Place',	'#ffffb2'],
				['Postcode',		    '#377eb8'],
				['Road',		    '#e41a1c'],
				['Road Intersection','#f781bf'],
				['Other',	          '#000000'],
			],
			'Tenure': [
				['Freehold',		'#4daf4a'],
				['Leasehold',		'#e41a1c'],
				['Other',		    '#000000'],
			],
			'Country': [
				['UK', 	        '#b15928'],
				['Jersey', 	    '#a6cee3'],
				['Guernsey', 	  '#1f78b4'],
				['Isle of Man',	'#b2df8a'],
				['British Virgin Islands', 	'#fb9a99'],
				['Cayman Islands',	'#e31a1c'],
				['Luxembourg',	'#fdbf6f'],
				['Gibraltar',	  '#33a02c'],
				['Netherlands',	'#ff7f00'],
				['Ireland',	    '#cab2d6'],
				['Cyprus',		  '#6a3d9a'],
				['Panama',		  '#ffff99'],
				['Other',		    '#000000'],
			]
		},
	},
	
	
	circleColours: {
		
				// #!# These are presumably restatements of dzLegendColours
		landowners: {
			'Category': [
			  'Co-operative Society (Company)','#a6cee3',
        'Co-operative Society (Corporate Body)','#a6cee3',
        'Community Benefit Society (Company)','#1f78b4',
        'Community Benefit Society (Corporate Body)','#1f78b4',
        'Housing Association Co-operative Society (Company)','#33a02c',
        'Housing Association Co-operative Society (Corporate Body)','#33a02c',
        'Housing Association Community Benefit Society (Company)','#33a02c',
        'Housing Association Community Benefit Society (Corporate Body)','#33a02c',
        'Housing Association Registered Society (Company)','#33a02c',
        'Housing Association Registered Society (Corporate Body)','#33a02c',
        'Housing Association/Society (Company)','#33a02c',
        'Housing Association/Society (Corporate Body)','#33a02c',
        'Industrial and Provident Society (Company)','#b2df8a',
        'Industrial and Provident Society (Corporate Body)','#b2df8a',
        'Local Authority','#6a3d9a',
        'County Council','#6a3d9a',
        'Registered Society (Company)','#ff7f00',
        'Registered Society (Corporate Body)','#ff7f00',
        'Unlimited Company','#cab2d6',
        'Corporate Body','#b15928',
        'Limited Company or Public Limited Company','#e31a1c',
        'Limited Liability Partnership','#fb9a99',
				'#000000'
			],
			'geocode_type': [
				'Address',		      '#4daf4a',
				'AdminDivision1',	'#bd0026',
				'AdminDivision2', 	'#f03b20',
				'AdminDivision3',	'#fd8d3c',
				'CountryRegion',		'#fecc5c',
				'PopulatedPlace',	'#ffffb2',
				'Postcode1',		    '#377eb8',
				'RoadBlock',		    '#e41a1c',
				'RoadIntersection','#f781bf',
				'#e0e0e0',
			],
			'Tenure': [
				'Freehold',		'#4daf4a',
				'Leasehold',		'#e41a1c',
				'#000000',
			],
			'Country': [
				'UK', 	        '#b15928',
				'JERSEY', 	    '#a6cee3',
				'GUERNSEY', 	  '#1f78b4',
				'BRITISH VIRGIN ISLANDS', 	'#fb9a99',
				'ISLE OF MAN',	'#b2df8a',
				'LUXEMBOURG',	'#fdbf6f',
				'GIBRALTAR',	  '#33a02c',
				'NETHERLANDS',	'#ff7f00',
				'IRELAND',	    '#cab2d6',
				'CAYMAN ISLANDS',	'#e31a1c',
				'PANAMA',		  '#ffff99',
				'CYPRUS',		  '#6a3d9a',
				'#000000',
			]
		},
	},
	
	// Chart definitions, indexed by map layer ID
	charts: {
	},
	
	// Popups
	popups: {
	  
		'landowners': {
			layerId: 'landowners',
			templateId: 'landowners-popup',
			preprocessingCallback: popupCallback,	// Defined below
			smallValuesThreshold: 10,
			literalFields: ['Gradient', 'Quietness'] // #!# Gradient and Quietness are capitalised unlike other
		}

	}
};


const datasets = { ...datasets_common, ...datasets_extra };

// Callbacks
function landownersStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	// Update the legend (even if map layer is off)
	const field = document.querySelector ('select.updatelayer[data-layer="landowners"][name="landowner_field"]').value
	createLegend (datasets.legends.landowners, field, 'landownerslegend');
	
	// Set paint properties
	map.setPaintProperty ('landowners', 'circle-color', ['match', ['get', field], ...capUi.getStyleColumn(field, datasets)]);
	
}


// Function to determine the style column
// TODO: Move this out of main UI code as tool specific
function getStyleColumn (layerId, datasets)
{
	const style_col_selected = datasets.circleColours.landowners.hasOwnProperty(layerId) ? layerId : '_';
	return datasets.circleColours.landowners[style_col_selected];
}


