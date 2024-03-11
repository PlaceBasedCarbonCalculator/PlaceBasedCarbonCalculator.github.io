// Data definitions, i.e. layers, charts, etc.
const datasets = {
	
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
		/*
		wards: {
			'id': 'wards',
			'type': 'line',
			'source': {
				'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/wards.pmtiles',
			},
			'source-layer': 'wards',
			'paint': {
				'line-color': 'rgba(32, 107, 7, 1)',
				'line-width': 2
			}
		},
		
		la: {
			'id': 'la',
			'type': 'line',
			'source': {
				'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/la.pmtiles',
			},
			'source-layer': 'la',
			'paint': {
				'line-color': 'rgba(107, 7, 7, 1)',
				'line-width': 2
			} 
		}
		*/
		
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
	// #!# Need to define more clearly the assumed data structure, e.g. the 'charts' key shows a part field
	charts: {
    /*
		// Data zones
		data_zones: {
			
			// Data fields
			// #!# Should use a main server URL setting
			dataUrl: 'https://nptscot.blob.core.windows.net/json/DataZone/%id.json',
			propertiesField: 'DataZone',
			titleField: 'DataZone',
			
			// Title
			titlePrefix: 'Zone Summary: ',

			charts: [
				[
					// Commute Origin
					'comm_orig',
					'Commuters leaving',
					'The bar chart shows estimated mode shares under different scenarios for commuters leaving this zone. (i.e they live here and commute to another zone).',
					'Annual Average Daily Flow'
				],
				[
					// Commute Destination
					'comm_dest',
					'Commuters arriving',
					'The bar chart shows estimated mode shares under different scenarios for commuters arriving this zone. (i.e they work here and live in another zone).',
					'Annual Average Daily Flow'
				],
				[
					// School Primary Origin
					'schl_primary_orig',
					'Primary school children',
					'The bar chart shows estimated mode shares under different scenarios for primary school childen that live in this zone.',
					'Annual Average Daily Flow'
				],
				[
					// School Secondary Origin
					'schl_secondary_orig',
					'Secondary school children',
					'The bar chart shows estimated mode shares under different scenarios for secondary school childen that live in this zone.',
					'Annual Average Daily Flow'
				],
				[
					// shopping Origin
					'shopping_orig',
					'Shoppers leaving',
					'The bar chart shows estimated mode shares of shopping trips under different scenarios for trips leaving this zone.',
					'Annual Average Daily Flow'
				],
				[
					// shopping Destination
					'shopping_dest',
					'Shoppers arriving',
					'The bar chart shows estimated mode shares of shopping trips under different scenarios for trips arriving this zone.',
					'Annual Average Daily Flow'
				],
				[
					// leisure Origin
					'leisure_orig',
					'Leisure trips leaving',
					'The bar chart shows estimated mode shares of leisure trips under different scenarios for trips leaving this zone.',
					'Annual Average Daily Flow'
				],
				[
					// leisure Destination
					'leisure_dest',
					'Leisure trips arriving',
					'The bar chart shows estimated mode shares of leisure trips under different scenarios for trips arriving this zone.',
					'Annual Average Daily Flow'
				],
				[
					// visiting Origin
					'visiting_orig',
					'visiting friends and family trips leaving',
					'The bar chart shows estimated mode shares of trips for visiting friends and family under different scenarios for trips leaving this zone.',
					'Annual Average Daily Flow'
				],
				[
					// visiting Destination
					'visiting_dest',
					'visiting friends and family trips arriving',
					'The bar chart shows estimated mode shares of trips for visiting friends and family under different scenarios for trips arriving this zone.',
					'Annual Average Daily Flow'
				],
			],

			modes: [
				// Label, field (e.g. bicycle => comm_orig_bicycle_ebike_fastest), background colour, border colour
				['Bicycle', 'bicycle', 'rgba(51,160,44, 0.8)', 'rgba(51,160,44, 1)'],
				['Foot', 'foot', 'rgba(178,223,138, 0.8)', 'rgba(178,223,138, 1)'],
				['Public transport', 'public_transport', 'rgba(56,108,176, 0.8)', 'rgba(56,108,176, 1)'],
				['Car', 'car', 'rgba(227,26,28, 0.8)', 'rgba(227,26,28, 1)'],
				['Taxi', 'taxi', 'rgba(166,206,227, 0.8)', 'rgba(166,206,227, 1)'],
			],

			// Scenario suffixes and their labels
			scenarios: [
				['', 'Baseline'],
				['_go_dutch_fastest', 'Go Dutch (Fastest)'],
				['_ebike_fastest', 'Ebike (Fastest)'],
				['_go_dutch_quietest', 'Go Dutch (Quietest)'],
				['_ebike_quietest', 'Ebike (Quietest)']
			]
		},
		
		
		// Travel to School Modeshare
		schools: {

			// Data fields
			dataUrl: 'https://nptscot.blob.core.windows.net/json/School/%id.json',
			propertiesField: 'SeedCode',
			titleField: 'SchoolName',

			// Title
			titlePrefix: '',

			charts: [
				[
					// School Primary Destination
					'schl_primary_dest',
					'Primary school modal split',
					'The bar chart shows estimated mode shares for primary school children under different scenarios.',
					'Annual Average Daily Flow'
				],
				[
					// School Secondary Destination
					'schl_secondary_dest',
					'Secondary school modal split',
					'The bar chart shows estimated mode shares for seconday school children under different scenarios.',
					'Annual Average Daily Flow'
				],
			],

			modes: [
				// Label, field (e.g. bicycle => comm_orig_bicycle_ebike_fastest), background colour, border colour
				['Bicycle', 'bicycle', 'rgba(51,160,44, 0.8)', 'rgba(51,160,44, 1)'],
				['Foot', 'foot', 'rgba(178,223,138, 0.8)', 'rgba(178,223,138, 1)'],
				['Public transport', 'public_transport', 'rgba(56,108,176, 0.8)', 'rgba(56,108,176, 1)'],
				['Car', 'car', 'rgba(227,26,28, 0.8)', 'rgba(227,26,28, 1)'],
				['Other', 'other', 'rgba(166,206,227, 0.8)', 'rgba(166,206,227, 1)'], // #!# NB the main modal has taxi rather than other
			],

			// Scenario suffixes and their labels
			scenarios: [
				['', 'Baseline'],
				['_go_dutch_fastest', 'Go Dutch (Fastest)'],
				['_ebike_fastest', 'Ebike (Fastest)'],
				['_go_dutch_quietest', 'Go Dutch (Quietest)'],
				['_ebike_quietest', 'Ebike (Quietest)']
			]
		}
		*/
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


// Callbacks
function popupCallback (feature)
{
	/*
	const layerPurpose = document.getElementById('rnet_purpose_input').value;
	const layerType = document.getElementById('rnet_type_input').value;
	const layerScenario = document.getElementById('rnet_scenario_input').value;
	const layerField = layerPurpose + '_' + layerType + '_' + layerScenario;
	feature.properties._ncycle = feature.properties[layerField];
	*/
	return feature;
}


function landownersStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	// Update the legend (even if map layer is off)
	const field = document.querySelector ('select.updatelayer[data-layer="landowners"][name="landowner_field"]').value
	createLegend (datasets.legends.landowners, field, 'landownerslegend');
	
	// Set paint properties
	map.setPaintProperty ('landowners', 'circle-color', ['match', ['get', field], ...nptUi.getStyleColumn(field, datasets)]);
	
}


