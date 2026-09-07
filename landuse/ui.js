// Local Chart Mangement
var accessChart;

manageCharts =  function (chartDefinition, locationData){
  console.log("Managing Charts");
  makeChartAccess(locationData);
  return Promise.resolve();
}

makeChartAccess = function(locationData){
  
  // Access Chart
  // Destroy old chart
	if(accessChart){
		accessChart.destroy();
	}
  
  // Get data muliple datasets for each category
  
  
  const category = locationData["c"];
  const datax = locationData["p60"];
	const datay = locationData["a60"];
	const labels = locationData["Bc"];
	//const data  = datax.map((xVal, index) => ({ x: xVal, y: datay[index] }));
	
	
	// Create an object to store data for each category
  const categoryData = {};
  for (let i = 0; i < category.length; i++) {
    const cat = category[i];
    if (!categoryData[cat]) {
      categoryData[cat] = [];
    }
    categoryData[cat].push({ x: datax[i], y: datay[i] });
  }
  
  const lableData = {};
  for (let i = 0; i < category.length; i++) {
    const cat = category[i];
    if (!lableData[cat]) {
      lableData[cat] = [];
    }
    //lableData[cat].push({ label: labels[i] });
    lableData[cat].push([labels[i]]);
  }
  
  // Create the datasets object
  const data = {
    datasets: Object.keys(categoryData).map((cat) => ({
      backgroundColor: '#00000',
      borderColor: '#00000',
      label: cat,
      labels: lableData[cat],
      data: categoryData[cat],
    })),
  };
  
  // Add colours
  const colours = ['#FF5733','#4CAF50','#2196F3','#FFC107','#E91E63','#9C27B0',
                  '#FF9800','#00BCD4','#8BC34A','#673AB7','#F44336','#3F51B5',
                  '#FFEB3B','#009688','#FF5722','#607D8B','#CDDC39','#795548',
                  '#FFCDD2','#9E9E9E','#FF9800','#FFC107','#FFEB3B','#4CAF50',
                  '#03A9F4','#FF4081','#8BC34A','#9C27B0','#FF5252','#00BCD4',
                  '#FF5722','#607D8B','#CDDC39','#795548','#FFCDD2','#9E9E9E',
                  '#FF9800','#FFC107','#FFEB3B','#4CAF50','#03A9F4','#FF4081'];

  for (let i = 0; i < data.datasets.length; i++) {
    data.datasets[i].borderColor = colours[i]
    data.datasets[i].backgroundColor = colours[i]
  }                
  
  var accessctx = document.getElementById('access-chart').getContext('2d');
	accessChart = new Chart(accessctx, {
    type: 'scatter',
    data: {
      datasets: data.datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: -3,
          max: 3,
          title: {
            display: true,
            text: 'Proximity'
          }
        },
        y: {
          min: -3,
          max: 3,
          title: {
            display: true,
            text: 'Accessibility by public transport'
          }
        },
      },
      plugins: {
        tooltip: {
            callbacks: {
                label: function(ctx) {
                    let label = ctx.dataset.labels[ctx.dataIndex];
                    label += " (" + ctx.parsed.x + ", " + ctx.parsed.y + ")";
                    return label;
                }
            }
        },
        legend: {
          position: 'top',
          display: true,
          labels: {
                  font: {
                      size: 10
                  }
          }
        }
      }
    }
  });
	
  
}

// Function to handle bi-directional railnoise checkbox proxying - the combination of the enabled and simplified checkboxes set the 'real' layer checkboxes
railCheckboxProxying = function ()
{
	// Create handles to the real checkbox values and the enabled/simplified boxes
	const railCheckboxProxy = document.getElementById ('railnoiseProxy');
	const railSelector = document.getElementById ('railnoise_type_input');
	const railallCheckbox = document.querySelector ('input.showlayer[data-layer="rail_all"]');
	const rail16Checkbox = document.querySelector ('input.showlayer[data-layer="rail_16"]');
	const railnightCheckbox = document.querySelector ('input.showlayer[data-layer="rail_night"]');
	
	// Define a function to calculate the real checkbox values based on the enabled/simplified boxes
	function setRailCheckboxes ()
	{
		// Calculate the real checkbox values based on the enabled/simplified boxes
		const layerEnabled = railCheckboxProxy.checked;
		railallCheckbox.checked = (layerEnabled && railSelector.value == 'rail_all');
		rail16Checkbox.checked = (layerEnabled && railSelector.value == 'rail_16');
		railnightCheckbox.checked = (layerEnabled && railSelector.value == 'rail_night');
		railallCheckbox.dispatchEvent (new CustomEvent ('change'));
		rail16Checkbox.dispatchEvent (new CustomEvent ('change'));
		railnightCheckbox.dispatchEvent (new CustomEvent ('change'));
	}
	
	// Set initial state
	setRailCheckboxes ();
	
	// Change state when the visible UI checkboxes change
	document.querySelectorAll ('.railnoiseProxy').forEach ((input) => {
		input.addEventListener ('change', function (e) {
			setRailCheckboxes ();
		});
	});

	// The reverse direction, setting these visible controls from the layers the
	// URL turned on, is handled by syncNoiseProxy() at the end of this file.
}


// Function to handle bi-directional railnoise checkbox proxying - the combination of the enabled and simplified checkboxes set the 'real' layer checkboxes
roadCheckboxProxying = function ()
{
	// Create handles to the real checkbox values and the enabled/simplified boxes
	const roadCheckboxProxy = document.getElementById ('roadnoiseProxy');
	const roadSelector = document.getElementById ('roadnoise_type_input');
	const roadallCheckbox = document.querySelector ('input.showlayer[data-layer="road_all"]');
	const road16Checkbox = document.querySelector ('input.showlayer[data-layer="road_16"]');
	const roadnightCheckbox = document.querySelector ('input.showlayer[data-layer="road_night"]');
	
	// Define a function to calculate the real checkbox values based on the enabled/simplified boxes
	function setroadCheckboxes ()
	{
		// Calculate the real checkbox values based on the enabled/simplified boxes
		const layerEnabled = roadCheckboxProxy.checked;
		roadallCheckbox.checked = (layerEnabled && roadSelector.value == 'road_all');
		road16Checkbox.checked = (layerEnabled && roadSelector.value == 'road_16');
		roadnightCheckbox.checked = (layerEnabled && roadSelector.value == 'road_night');
		roadallCheckbox.dispatchEvent (new CustomEvent ('change'));
		road16Checkbox.dispatchEvent (new CustomEvent ('change'));
		roadnightCheckbox.dispatchEvent (new CustomEvent ('change'));
	}
	
	// Set initial state
	setroadCheckboxes ();
	
	// Change state when the visible UI checkboxes change
	document.querySelectorAll ('.roadnoiseProxy').forEach ((input) => {
		input.addEventListener ('change', function (e) {
			setroadCheckboxes ();
		});
	});

	// The reverse direction, setting these visible controls from the layers the
	// URL turned on, is handled by syncNoiseProxy() at the end of this file.
}


// Set the visible noise controls from the layers the URL actually switched on.
//
// The two proxying functions above are wired only to onchange in landuse/index.html,
// so neither of them runs at page load and nothing sets the visible checkbox and
// dropdown from the real layer checkboxes. A shared link such as
// #/road_16/#12/53.80/-1.55 therefore drew the right layer while the panel showed
// road noise switched off and the dropdown reading "24h average". Worse, the first
// click on that panel ran setroadCheckboxes() against the stale visible state and
// silently switched the map from road_16 to road_all, rewriting the URL with it,
// so the link no longer showed what it was shared to show.
//
// ui-common.js dispatches '@map/initiallayersset' immediately after applying the
// URL's layer list, which is exactly the moment when the real checkboxes are right
// and the visible ones are not. This file is deferred, so the listener below is
// registered long before that fires.
function syncNoiseProxy (kind)
{
	const proxy = document.getElementById (kind + 'noiseProxy');
	const selector = document.getElementById (kind + 'noise_type_input');
	if (!proxy || !selector) {return;}

	// The three variants are mutually exclusive, so at most one is ever checked.
	// Their data-layer values ('road_all', 'road_16', 'road_night') are also the
	// dropdown's option values, so the selector needs no lookup table.
	const active = [kind + '_all', kind + '_16', kind + '_night']
		.map ((layerId) => document.querySelector ('input.showlayer[data-layer="' + layerId + '"]'))
		.find ((checkbox) => checkbox && checkbox.checked);

	proxy.checked = !!active;
	if (active) {selector.value = active.dataset.layer;}

	// No change events are dispatched: the real checkboxes already agree with the
	// URL, and dispatching would re-enter setroadCheckboxes/setRailCheckboxes and
	// overwrite the very state being synced from.
}

document.addEventListener ('@map/initiallayersset', function () {
	syncNoiseProxy ('road');
	syncNoiseProxy ('rail');
});
