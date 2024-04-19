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
				'url': 'pmtiles://../tiles/zones.pmtiles',
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
	
	
	
	// Chart definitions, indexed by map layer ID
	charts: {
	  zones: {
	    
	    // Data fields
			// #!# Should use a main server URL setting
			dataUrl: '/data/json/Access/%id.json',
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
	
	const datax = locationData["a60"];
	const datay = locationData["p60"];
	const datasets1 = datax.map((xVal, index) => ({ x: xVal, y: datay[index] }));
	
	console.log(datasets1); 
  const labels = 'foo'
	
	renderChart('access_proximity-chart', 'chart title here', datasets1, labels);
		
		// Bar labels
		//const labels = chartDefinition.years.map(years => years[1]);
		
		// Clear existing if present
		/*
		if (chartHandles[i]) {
			chartHandles[i].destroy();
		}
		*/
		// Render the chart (and register it to a handle so it can be cleared in future)
		//chartHandles[i] = 
	
	
	
	// Create each chart
	//chartDefinition.charts.forEach((chart, i) => {
	  
	  // Clear existing if present
	  /*
		if (chartHandles[i]) {
			chartHandles[i].destroy();
		}
		*/
		
		// Assemble the datasets to be shown
		/*
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
		*/
		
	//});
};
			
			
// Function to render a chart
function renderChart (divId, title, datasets1, labels)
{
	
	console.log(datasets1);
	
	// Create and return the chart
	return new Chart(document.getElementById(divId).getContext('2d'), {
		type: 'scatter',
		data: {
			datasets: datasets1
		},
		options: {
			scales: {
				x: {
          type: 'linear',
          position: 'bottom'
        },
			},
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Chart.js Scatter Chart'
      }
    }
		}
	});
}


// Function to determine the style column
function getStyleColumn (layerId, datasets)
{
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



