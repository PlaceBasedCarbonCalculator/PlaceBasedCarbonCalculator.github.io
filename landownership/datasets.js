// Data definitions, i.e. layers, charts, etc.
const datasets_extra = {
	
	// Data layers
	layers: {
	  
	  inspire: {
			'id': 'inspire',
			'type': 'fill',
			'source': {
			'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/inspire_20260811.pmtiles',
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
				'url': 'pmtiles://%tileserverUrl/landowners_20260824.pmtiles',
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
	  inspire:			inspireStyling,
	},
	
	
	// #!# These need to be merged with lineColours
	legends: {

		// The INSPIRE parcel colourings. 'uprn_class' counts the CURRENT
		// properties whose address point falls inside the parcel: exactly one
		// means the parcel is that property's plot, none means bare land or a
		// garden/access strip, several means a block or a shared site.
		// 'price_per_m2' is only defined for the one-property case - it is the
		// property's estimated 2025 value divided by the parcel area, which
		// only means anything when the parcel IS the plot.
		inspire: {
			'uprn_class': [
				['No properties',	'#bdbdbd'],
				['One property',	'#1f78b4'],
				['Several',		'#e31a1c'],
			],
			'price_per_m2': [
				['£0',		'#f7fcf0'],
				['£250',	'#ccebc5'],
				['£500',	'#7bccc4'],
				['£1,000',	'#2b8cbe'],
				['£2,000',	'#0868ac'],
				['£4,000',	'#084081'],
				['>£8,000',	'#4d004b'],
			],
		},

		landowners: {
			'Category': [
				['Community Benefit Society', 	'#1f78b4'],
				['Housing Association',		'#33a02c'],
				['Industrial and Provident Society', 	'#b2df8a'],
				['Local Authority/County Council', 	'#6a3d9a'],
				['Registered Society', 	'#ff7f00'],
				['Unlimited Company', 	'#cab2d6'],
				['Corporate Body', 	'#b15928'],
				['(Public) Limited Company', 	'#e31a1c'],
				['Limited Liability Partnership', 	'#fb9a99'],
				['Other',	'#000000'],
			],
			// How much to trust the dot's position. Replaces the old
			// 'geocode_type' (a Bing geocoder precision code): the 2026 pipeline
			// locates most titles by matching them to a UPRN rather than by
			// geocoding an address string, so geocoder precision no longer
			// describes where the majority of these points came from.
			'match_quality': [
				['High',	'#1a9641'],
				['Medium',	'#a6d96a'],
				['Street',	'#ffffbf'],
				['Low',		'#fdae61'],
				['Fuzzy',	'#f46d43'],
				['Guess',	'#d7191c'],
				['Other',	'#000000'],
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
	
	
	// Fill colours for the INSPIRE parcels. uprn_class is categorical (a
	// 'match' expression), price_per_m2 continuous (an 'interpolate' one);
	// inspireStyling() picks the right form for the selected field.
	fillColours: {
		inspire: {
			'uprn_class': [
				'0',	'#bdbdbd',
				'1',	'#1f78b4',
				'2+',	'#e31a1c',
				'#000000',
			],
			'price_per_m2': [
				0,	'#f7fcf0',
				250,	'#ccebc5',
				500,	'#7bccc4',
				1000,	'#2b8cbe',
				2000,	'#0868ac',
				4000,	'#084081',
				8000,	'#4d004b',
			],
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
			'match_quality': [
				'High',		'#1a9641',
				'Medium',	'#a6d96a',
				'Street',	'#ffffbf',
				'Low',		'#fdae61',
				'Fuzzy',	'#f46d43',
				'Guess',	'#d7191c',
				'#000000',
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
		},
		
		'inspire': {
			layerId: 'inspire',
			templateId: 'inspire-popup',
			preprocessingCallback: popupCallback,	// Defined below
			smallValuesThreshold: 10,
			literalFields: ['Gradient', 'Quietness'] // #!# Gradient and Quietness are capitalised unlike other
		}

	}
};


const datasets = mergeObjects(datasets_extra, datasets_common);

// Callbacks
function landownersStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	// Update the legend (even if map layer is off)
	const field = document.querySelector ('select.updatelayer[data-layer="landowners"][name="landowner_field"]').value
	createLegend (datasets.legends.landowners, field, 'landownerslegend');
	
	// Set paint properties
	map.setPaintProperty ('landowners', 'circle-color', ['match', ['get', field], ...getStyleColumn(field, datasets)]);
	map.setLayoutProperty ('buildings', 'visibility', 'visible');

	
}


// Function to determine the style column
// TODO: Move this out of main UI code as tool specific
function getStyleColumn (layerId, datasets)
{
	const style_col_selected = datasets.circleColours.landowners.hasOwnProperty(layerId) ? layerId : '_';
	return datasets.circleColours.landowners[style_col_selected];
}






// Styling callback for the INSPIRE parcels.
//
// The parcels are drawn as a flat wash by default, because that is what the
// layer is usually for - seeing where the boundaries of registered freehold
// land actually run. The two colourings are opt-in from the drop-down:
//
//   uprn_class    categorical (no properties / one / several), so a 'match'
//   price_per_m2  continuous, so an 'interpolate'
//
// price_per_m2 is null for every parcel that does not have exactly one current
// property on it - about half of them - so the interpolate is wrapped in a
// 'case' that checks the value is a number first. Feeding null into interpolate
// makes MapLibre log "expected number, found null" for every such feature on
// every frame, and there are twelve million of them.
function inspireStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	const select = document.querySelector ('select.updatelayer[data-layer="inspire"][name="inspire_field"]');
	const field = (select ? select.value : 'none');

	createLegend (datasets.legends.inspire, field, 'inspirelegend');

	if (field === 'uprn_class') {
		map.setPaintProperty (layerId, 'fill-color',
			['match', ['get', field], ...datasets.fillColours.inspire.uprn_class]);
		map.setPaintProperty (layerId, 'fill-opacity', 0.6);
	} else if (field === 'price_per_m2') {
		map.setPaintProperty (layerId, 'fill-color', ['case',
			['==', ['typeof', ['get', field]], 'number'],
			['interpolate', ['linear'], ['get', field], ...datasets.fillColours.inspire.price_per_m2],
			'#bdbdbd'
		]);
		map.setPaintProperty (layerId, 'fill-opacity', 0.6);
	} else {
		map.setPaintProperty (layerId, 'fill-color', '#bc80bd');
		map.setPaintProperty (layerId, 'fill-opacity', 0.3);
	}
}

