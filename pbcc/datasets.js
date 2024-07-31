// Data definitions, i.e. layers, charts, etc.
const datasets_extra = {
	
	// Data layers
	layers: {
	  
	  zones: {
			'id': 'zones',
			'type': 'fill',
			'source': {
			'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/zones.pmtiles',
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
	  zones: {
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
	
	circleColours: {
		
				// #!# These are presumably restatements of dzLegendColours
		landowners: {
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
	  zones: {
	    
	    // Data fields
			// #!# Should use a main server URL setting
			dataUrl: 'https://pbcc.blob.core.windows.net/pbcc-data/LSOA/%id.json',
			propertiesField: 'LSOA21CD',
			titleField: 'LSOA21CD',
			
			// Title
			titlePrefix: 'Neighbourhood Summary: ',
			
			charts: [
				[
					// Commute Origin
					'comm_orig',
					'Total Footprint',
					'Description goes here',
					'kgCO2e per year'
				]
		  ],
		  
		  component: [
		    // Label, field (e.g. Gas => dgkp2020), background colour, border colour
				['Gas', 'dgkp', 'rgba(166,206,227, 0.8)', 'rgba(166,206,227, 1)'],
				['Electricity', 'dekp', 'rgba(31,120,180, 0.8)', 'rgba(31,120,180, 1)'],
				['Other Housing', 'osep', 'rgba(51,160,44, 0.8)', 'rgba(51,160,44, 1)'],
				['Cars', 'cep', 'rgba(251,154,153, 0.8)', 'rgba(251,154,153, 1)'],
				['Vans', 'vep', 'rgba(227,26,28, 0.8)', 'rgba(227,26,28, 1)'],
				['Flights', 'efp', 'rgba(255,127,0, 0.8)', 'rgba(255,127,0, 1)'],
				['Food & Drink', 'nep', 'rgba(202,178,214, 0.8)', 'rgba(202,178,214, 1)'],
				['Consumable Goods', 'cep', 'rgba(106,61,154, 0.8)', 'rgba(106,61,154, 1)'],
				['Recreation', 'rep', 'rgba(255,255,153, 0.8)', 'rgba(255,255,153, 1)'],
				['Services', 'sep', 'rgba(177,89,40, 0.8)', 'rgba(177,89,40, 1)'],
				
		  ],
		  
	   years: [
				['2010', '2010'],
				['2011', '2011'],
				['2012', '2012'],
				['2013', '2013'],
				['2014', '2014'],
				['2015', '2015'],
				['2016', '2016'],
				['2017', '2017'],
				['2018', '2018'],
				['2019', '2019'],
				['2020', '2020'],
			]
	   
	  }
	  
	},
	
	// Popups
	popups: {
	}
};


const datasets = { ...datasets_common, ...datasets_extra };


// Function to create all charts
function createCharts (chartDefinition, locationData)
{
	// Create each chart
	chartDefinition.charts.forEach((chart, i) => {
	  
	  // Clear existing if present
		if (chartHandles[i]) {
			chartHandles[i].destroy();
		}
		
		// Assemble the datasets to be shown
		const datasets = [];
		chartDefinition.component.forEach(component => {
			datasets.push({
				label: component[0],
				data: chartDefinition.years.map(years => locationData[component[1] + years[0]]),
				backgroundColor: component[2],
				borderColor: component[3],
				borderWidth: 1
			});
		});
		
		console.log(locationData);
		console.log(chartDefinition);
		console.log(datasets);
		
		// Bar labels
		const labels = chartDefinition.years.map(years => years[1]);
		
		// Clear existing if present
		if (chartHandles[i]) {
			chartHandles[i].destroy();
		}
		
		// Render the chart (and register it to a handle so it can be cleared in future)
		chartHandles[i] = renderChart(chart[0] + '-chart', chart[3], datasets, labels);
	});
};
			
			
// Function to render a chart
function renderChart (divId, title, datasets, labels)
{
	// Create and return the chart
	return new Chart(document.getElementById(divId).getContext('2d'), {
		type: 'bar',
		data: {
			labels: labels,
			datasets: datasets
		},
		options: {
			scales: {
				y: {
					stacked: true,
					title: {
						display: true,
						text: title
					},
					ticks: {
						beginAtZero: true,
					}
				},
				x: {
					stacked: true
				},
			},
			responsive: true,
			maintainAspectRatio: false
		}
	});
}




// Function to determine the style column
function getStyleColumn (layerId, datasets)
{
  
  console.log("Hi")
	const style_col_selected = datasets.lineColours.zones.hasOwnProperty(layerId) ? layerId : '_';
	//return datasets.lineColours.zones[style_col_selected];
	return datasets.lineColours.zones['Grade'];
}

// Styling callback for data zones (including buildings styling)
function zonesStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	// Update the legend (even if map layer is off)
	const field = document.querySelector ('select.updatelayer[data-layer="zones"][name="field"]').value
	createLegend (datasets.legends.zones, "Grade", 'zoneslegend'); // Fixed Legeng for Grades
	
	// Get UI state
	const daysymetricMode = document.querySelector ('input.updatelayer[data-layer="zones"][name="daysymetricmode"]').checked;
	
	// Set paint properties
	//map.setPaintProperty (layerId, 'fill-color', ['step', ['get', field], getStyleColumn (field, datasets)]);
	map.setPaintProperty (layerId, 'fill-color', ['match', ['get', field], ...getStyleColumn (field, datasets)]);
	map.setPaintProperty (layerId, 'fill-opacity', (daysymetricMode ? 0.1 : 0.8)); // Very faded-out in daysymetric mode, as the buildings are coloured
	
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
	
	if (!document.querySelector ('input.showlayer[data-layer="zones"]').checked) {
		const styleName = document.querySelector('#basemapform input:checked').value;	// Same as nptUi.getBasemapStyle()
		return settings.basemapStyles[styleName].buildingColour;
	}
	
	// If dasymetric mode, use a colour set based on the layer
	if (document.querySelector ('input.updatelayer[data-layer="zones"][name="daysymetricmode"]').checked) {
		const field = document.querySelector ('select.updatelayer[data-layer="zones"][name="field"]').value;
		return ['match', ['get', field], ...getStyleColumn (field, datasets)];
	}
	
	// Default to gray
	return '#9c9898';
}




