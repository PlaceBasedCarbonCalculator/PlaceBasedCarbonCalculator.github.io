// Data definitions, i.e. layers, charts, etc.
// For PBCC tool
const datasets_extra = {
	
	// Data layers
	layers: {
	  
	  zones: {
			'id': 'zones',
			'type': 'fill',
			'source': {
			'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/zones_pbcc_20251115.pmtiles',
				},
			'source-layer': 'zones',
			'paint': {
				'fill-color': '#9c9898',
				'fill-opacity': 0.8,
				'fill-outline-color': '#000000'
			}
		},
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
				],
			'lsoa_class_code': [
				['Cosmopolitan student neighbourhoods','#955123'],
				['Ageing rural neighbourhoods','#007f42'],
				['Prospering countryside life','#3ea456'],
				['Remoter communities','#8aca8e'],
				['Rural traits','#cfe8d1'],
				['Achieving neighbourhoods','#00498d'],
				['Asian traits','#2967ad'],
				['Highly qualified professionals','#7b99c7'],
				['Households in terraces and flats','#b9c8e1'],
				['Challenged white communities','#e3ac20'],
				['Constrained renters','#edca1a'],
				['Hampered neighbourhoods','#f6e896'],
				['Hard-pressed flat dwellers','#fcf5d8'],
				['Ageing urban communities','#e64c2b'],
				['Aspiring urban households','#ec773c'],
				['Comfortable neighbourhoods','#faa460'],
				['Endeavouring social renters','#fcc9a0'],
				['Primary sector workers','#fee4ce'],
				['Inner city cosmopolitan','#f79ff0'],
				['Urban cultural mix','#6a339a'],
				['Young ethnic communities','#9f84bd'],
				['Affluent communities','#576362'],
				['Ageing suburbanites','#a1a2a1'],
				['Comfortable suburbia','#e5e4e3'],
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
			],
			'lsoa_class_code': [
				'1a','#955123',
				'2a','#007f42',
				'2b','#3ea456',
				'2c','#8aca8e',
				'2d','#cfe8d1',
				'3a','#00498d',
				'3b','#2967ad',
				'3c','#7b99c7',
				'3d','#b9c8e1',
				'4a','#e3ac20',
				'4b','#edca1a',
				'4c','#f6e896',
				'4d','#fcf5d8',
				'5a','#e64c2b',
				'5b','#ec773c',
				'5c','#faa460',
				'5d','#fcc9a0',
				'5e','#fee4ce',
				'6a','#f79ff0',
				'7a','#6a339a',
				'7b','#9f84bd',
				'8a','#576362',
				'8b','#a1a2a1',
				'8c','#e5e4e3',
				'#000000'
				]
		},
	},
	
	circleColours: {
		
	},
	
	
	// Chart definitions, indexed by map layer ID, then datasource ID, different from NPT wich has one data soruce per modal per map layer
	// I.e. charts > Layer clicked on to trigger modal > datasource to fill the modal
	
	charts: {
	  zones: {
	    zones: {
	      // Data fields
  			// #!# Should use a main server URL setting
  			dataUrl: 'https://pbcc.blob.core.windows.net/pbcc-data/lsoa_overview/v1/%id.json',
  			propertiesField: 'LSOA21CD',
  			titleField: 'LSOA21CD',
  			
  			// Title
  			titlePrefix: 'LSOA ',
  			
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
	},
	
	// Popups
	popups: {
	}
};

const datasets = mergeObjects(datasets_extra, datasets_common);

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
	const style_col_selected = datasets.lineColours.zones.hasOwnProperty(layerId) ? layerId : '_';
	return datasets.lineColours.zones[style_col_selected];
}

// Styling callback for data zones (including buildings styling)
function zonesStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	// Update the legend (even if map layer is off)
	const field = document.querySelector ('select.updatelayer[data-layer="zones"][name="field"]').value
	const standardGrade = ['total_grade','reduction_grade','dom_gas_grade','dom_elec_grade','car_grade','van_grade','goods_services_combined_grade','flights_grade'];
				
	// Get UI state
	const daysymetricMode = document.querySelector ('input.updatelayer[data-layer="zones"][name="daysymetricmode"]').checked;
	
	let buildingColour = null;
	// Set paint properties
	if (standardGrade.includes(field)) {
		console.log('Using standard grade colour scheme');
		createLegend (datasets.legends.zones, 'Grade', 'zoneslegend');
		map.setPaintProperty (layerId, 'fill-color', ['match', ['get', field], ...getStyleColumn ('Grade', datasets)]);
		buildingColour = getBuildingsColour(settings, true);
	} else {
		createLegend (datasets.legends.zones, field, 'zoneslegend');
		map.setPaintProperty (layerId, 'fill-color', ['match', ['get', field], ...getStyleColumn (field, datasets)]);
		buildingColour = getBuildingsColour(settings, false);
	}

	map.setPaintProperty (layerId, 'fill-opacity', (daysymetricMode ? 0.1 : 0.8)); // Very faded-out in daysymetric mode, as the buildings are coloured
	map.setPaintProperty (layerId, 'fill-outline-color', 'rgba(0, 0, 0, 0.2)'); 
	// Set buildings layer colour/visibility
	map.setPaintProperty ('buildings', 'fill-extrusion-color', (buildingColour || '#9c9898'));
	map.setLayoutProperty ('buildings', 'visibility', (buildingColour ? 'visible' : 'none'));
}


// Function to determine the buildings colour
function getBuildingsColour (settings, isStandardGrade)
{
	// If datazones is off, buildings shown, if vector style, as static colour appropriate to the basemap
	
	if (!document.querySelector ('input.showlayer[data-layer="zones"]').checked) {
		const styleName = document.querySelector('#basemapform input:checked').value;	// Same as nptUi.getBasemapStyle()
		return settings.basemapStyles[styleName].buildingColour;
	}
	
	// If dasymetric mode, use a colour set based on the layer
	if (document.querySelector ('input.updatelayer[data-layer="zones"][name="daysymetricmode"]').checked) {
		const field = document.querySelector ('select.updatelayer[data-layer="zones"][name="field"]').value;
		if(isStandardGrade){
			return ['match', ['get', field], ...getStyleColumn ('Grade', datasets)];
		} else {
			return ['match', ['get', field], ...getStyleColumn (field, datasets)];
		}
	}
	
	// Default to gray
	return '#9c9898';
}




