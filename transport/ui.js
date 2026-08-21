// Local Chart Mangement
var accessChart;
var frequencyChart;
var privateVehicleBodyChart;
var privateVehicleFuelChart;
var companyVehicleBodyChart;
var companyVehicleFuelChart;
var vehiclePPChart;
var accessLocationData = {};
var frequencyLocationData = {};
var vehicleLocationData = {};


manageCharts = function (locationId) {
  // Access now comes from the access bin (single binary + range request)
  // instead of one JSON file per zone.
  const p1 = capBin.fetchRecord('access', locationId)
    .then(function (accessData) {
      accessLocationData = accessData;
      makeChartAccess();
      makeTableAccess();
    })
    .catch(function (error) {
      // Keep user-visible alert for backwards compatibility, but don't reject the overall promise
      //alert('Failed to get access data for this location, or to process it correctly. Please try refreshing the page.');
      console.log(error);
    });

  // Public transport frequency now comes from the pt_frequency bin (single
  // binary + range request) instead of one JSON file per zone.
  const p2 = capBin.fetchRecord('pt_frequency', locationId)
    .then(function (frequencyData) {
      frequencyLocationData = frequencyData;
      makeChartFrequency();
    })
    .catch(function (error) {
      alert('Failed to get frequnecy data for this location, or to process it correctly. Please try refreshing the page.');
      console.log(error);
    });

  // Vehicle summary now comes from the vehicle_summary bin instead of one
  // JSON file per zone.
  const p3 = capBin.fetchRecord('vehicle_summary', locationId)
    .then(function (vehicleData) {
      vehicleLocationData = vehicleData;
      makeChartVehicles();
    })
    .catch(function (error) {
      alert('Failed to get vehicle data for this location, or to process it correctly. Please try refreshing the page.');
      console.log(error);
    });

  // Return a promise that resolves once both fetches have settled
  return Promise.all([p1, p2, p3]);
};


makeChartAccess = function(){

  // Guard: do nothing until access data has loaded
  if (!accessLocationData || !accessLocationData['categoryname']) { return; }

  // Access Chart
  // Destroy old chart
	if(accessChart){
		accessChart.destroy();
	}
  
  // Get data muliple datasets for each category
  
  
  const category = accessLocationData["categoryname"];
  const datax = accessLocationData["proximity_60"];
	const datay = accessLocationData["access_60"];
	const labels = accessLocationData["classname"];
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


makeTableAccess = function(){

    // Guard: do nothing until access data has loaded
    if (!accessLocationData || !accessLocationData['categoryname']) { return; }

    const tab = document.getElementById('access-table');
    tab.innerHTML = ''

    const labels = accessLocationData["classname"];
    const category = accessLocationData["categoryname"];
    const access_15 = accessLocationData["access_15"];
    const access_30 = accessLocationData["access_30"];
    const access_45 = accessLocationData["access_45"];
    const access_60 = accessLocationData["access_60"];
    const proximity_15 = accessLocationData["proximity_15"];
    const proximity_30 = accessLocationData["proximity_30"];
    const proximity_45 = accessLocationData["proximity_45"];
    const proximity_60 = accessLocationData["proximity_60"];
  

// Group data by category
const groupedData = {};
for (let i = 0; i < labels.length; i++) {
    const group = category[i];
    if (!groupedData[group]) {
        groupedData[group] = [];
    }
    groupedData[group].push(i);
}

// Create tables for each group
for (const group in groupedData) {
    const groupIndices = groupedData[group];
    const groupTable = document.createElement('table');
    groupTable.innerHTML = `
        <tr>
            <th colspan="9">${group}</th>
        </tr>
        <tr>
            <th>Type</th>
            <th style="width:42px;">15<br>min</th>
            <th style="width:42px;">30<br>min</th>
            <th style="width:42px;">45<br>min</th>
            <th style="width:42px;">60<br>min</th>
            <th style="width:42px;">0.75<br>mile</th>
            <th style="width:42px;">1.5<br>mile</th>
            <th style="width:42px;">2.25<br>mile</th>
            <th style="width:42px;">3<br>mile</th>
        </tr>
        ${groupIndices.map(i => `
            <tr>
                <td>${labels[i]}</td>
                <td>${access_15[i]}</td>
                <td>${access_30[i]}</td>
                <td>${access_45[i]}</td>
                <td>${access_60[i]}</td>
                <td>${proximity_15[i]}</td>
                <td>${proximity_30[i]}</td>
                <td>${proximity_45[i]}</td>
                <td>${proximity_60[i]}</td>
            </tr>
        `).join('')}
    `;
    tab.appendChild(groupTable);
}

const cells = tab.getElementsByTagName('td');

  for (let cell of cells) {
    const value = parseFloat(cell.textContent);
    if (value == -3) {
      cell.classList.add('insufficient');
      cell.textContent = 'Insf'
    } else if (value < -1.5) {
      cell.classList.add('very-poor');
    } else if (value < -1 & value >= -1.5 ) {
      cell.classList.add('poor');
    } else if (value < -0.3 & value >= -1 ) {
      cell.classList.add('below-average');
    } else if (value < 0.3 & value >= -0.3 ) {
      cell.classList.add('average');
    } else if (value < 1 & value >= 0.3 ) {
      cell.classList.add('above-average');
    } else if (value < 1.5 & value >= 1 ) {
      cell.classList.add('good');
    } else if (value > 1.5) {
      cell.classList.add('very-good');
    }
  }
  
  
  
}

makeChartFrequency = function(){

  // Guard: do nothing until frequency data has loaded
  if (!frequencyLocationData || !frequencyLocationData['year']) { return; }

  // Access Chart
  // Destroy old chart
	if(frequencyChart){
		frequencyChart.destroy();
	}
	
	md = document.getElementById("select_mode").value;
	day = document.getElementById("select_day").value;
  
  // Get data muliple datasets for each category
  
  
  const MorningPeak = frequencyLocationData[day + '_MorningPeak_' + md];
  const Midday = frequencyLocationData[day + '_Midday_' + md];
	const AfternoonPeak = frequencyLocationData[day + '_AfternoonPeak_' + md];
	const Evening = frequencyLocationData[day + '_Evening_' + md];
	const Night = frequencyLocationData[day + '_Night_' + md];
	const years = frequencyLocationData['year']
	
	//console.log(MorningPeak);
	
	var freqencyctx = document.getElementById('frequency-chart').getContext('2d');
	frequencyChart = new Chart(freqencyctx, {
		type: 'line',
		data: {
			labels: years,
			datasets: [{
				label: 'Morning Peak',
				data: MorningPeak,
				backgroundColor: 'rgba(232,243,83, 0.8)',
				borderColor: 'rgba(232,243,83, 1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Midday',
				data: Midday,
				backgroundColor: 'rgba(228,125,27, 0.8)',
				borderColor: 'rgba(228,125,27, 1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Afternoon Peak',
				data: AfternoonPeak,
				backgroundColor: 'rgba(230,25,124, 0.8)',
				borderColor: 'rgba(230,25,124, 1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Evening',
				data: Evening,
				backgroundColor: 'rgba(174,44,211, 0.8)',
				borderColor: 'rgba(174,44,211, 1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Night',
				data: Night,
				backgroundColor: 'rgba(0,0,0, 0.8)',
				borderColor: 'rgba(0,0,0, 1)',
				borderWidth: 1,
				order: 1
			}

			]
		},
		options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
	});

}

makeChartVehicles = function(){

  // Guard: do nothing until vehicle data has actually loaded (avoids a crash if
  // called with the empty default object, e.g. before a location is selected)
  if (!vehicleLocationData || !vehicleLocationData['year']) { return; }

  // Access Chart
  // Destroy old chart
	if(privateVehicleBodyChart){
    privateVehicleBodyChart.destroy();
  }
  if(privateVehicleFuelChart){
    privateVehicleFuelChart.destroy();
  }
  if(companyVehicleBodyChart){
    companyVehicleBodyChart.destroy();
  }
  if(companyVehicleFuelChart){
    companyVehicleFuelChart.destroy();
  }
  if(vehiclePPChart){
    vehiclePPChart.destroy();
  }
  
  const labels = vehicleLocationData['year'];
  const dataprivateVehicleBody = {
    labels: labels,
    datasets: [
      {
        label: 'Cars (Licensed)',
        data: vehicleLocationData['Cars_Licensed_PRIVATE'],
        backgroundColor: '#2b8cbe',
        stack: 'Stack 0',
      },
      {
        label: 'Cars (SORN)',
        data: vehicleLocationData['Cars_SORN_PRIVATE'],
        backgroundColor: '#9ed4f0',
        stack: 'Stack 1',
      },
      {
        label: 'Motorcycles (Licensed)',
        data: vehicleLocationData['Motorcycles_Licensed_PRIVATE'],
        backgroundColor: '#b30000',
        stack: 'Stack 0',
      },
      {
        label: 'Motorcycles (SORN)',
        data: vehicleLocationData['Motorcycles_SORN_PRIVATE'],
        backgroundColor: '#ee8f8f',
        stack: 'Stack 1',
      },
      {
        label: 'Other (Licensed)',
        data: vehicleLocationData['Other_Licensed_PRIVATE'],
        backgroundColor: '#1c8607',
        stack: 'Stack 0',
      },     
      {
        label: 'Other (SORN)',
        data: vehicleLocationData['Other_SORN_PRIVATE'],
        backgroundColor: '#89f18e',
        stack: 'Stack 1',
      },
    ]
  };

  const datacompanyVehicleBody = {
    labels: labels,
    datasets: [
      {
        label: 'Cars (Licensed)',
        data: vehicleLocationData['Cars_Licensed_COMPANY'],
        backgroundColor: '#2b8cbe',
        stack: 'Stack 0',
      },
      {
        label: 'Cars (SORN)',
        data: vehicleLocationData['Cars_SORN_COMPANY'],
        backgroundColor: '#9ed4f0',
        stack: 'Stack 1',
      },
      {
        label: 'Motorcycles (Licensed)',
        data: vehicleLocationData['Motorcycles_Licensed_COMPANY'],
        backgroundColor: '#b30000',
        stack: 'Stack 0',
      },
      {
        label: 'Motorcycles (SORN)',
        data: vehicleLocationData['Motorcycles_SORN_COMPANY'],
        backgroundColor: '#ee8f8f',
        stack: 'Stack 1',
      },
      {
        label: 'Other (Licensed)',
        data: vehicleLocationData['Other_Licensed_COMPANY'],
        backgroundColor: '#1c8607',
        stack: 'Stack 0',
      },     
      {
        label: 'Other (SORN)',
        data: vehicleLocationData['Other_SORN_COMPANY'],
        backgroundColor: '#89f18e',
        stack: 'Stack 1',
      },
    ]
  };
  
  const dataprivateVehicleFuel = {
      labels: labels,
      datasets: [
        {
          label: 'Battery Electric',
          data: vehicleLocationData['BEV_PRIVATE'],
          backgroundColor: '#07c220',
          stack: 'Stack 0',
        },
        {
          label: 'Hybrid',
          data: vehicleLocationData['HEV_PRIVATE'],
          backgroundColor: '#0042f7',
          stack: 'Stack 0',
        },
        {
          label: 'Plug-in Hybrid',
          data: vehicleLocationData['PHEV_PRIVATE'],
          backgroundColor: '#17d9f3',
          stack: 'Stack 0',
        },
        {
          label: 'Range Extended Electric',
          data: vehicleLocationData['REEV_PRIVATE'],
          backgroundColor: '#e7e40e',
          stack: 'Stack 0',
        },
        {
          label: 'Fuel Cell',
          data: vehicleLocationData['fuelcell_PRIVATE'],
          backgroundColor: '#9b0386',
          stack: 'Stack 0',
        },
        {
          label: 'Petrol/Diesel (ULEV)',
          data: vehicleLocationData['iceULEV_PRIVATE'],
          backgroundColor: '#da7a0c',
          stack: 'Stack 0',
        },
        {
          label: 'Petrol/Diesel',
          data: vehicleLocationData['ice_PRIVATE'],
          backgroundColor: '#ee2405',
          stack: 'Stack 0',
        },
      ]
    };

    const datacompanyVehicleFuel = {
      labels: labels,
      datasets: [
        {
          label: 'Battery Electric',
          data: vehicleLocationData['BEV_COMPANY'],

          backgroundColor: '#07c220',
          stack: 'Stack 0',
        },
        {
          label: 'Hybrid',
          data: vehicleLocationData['HEV_COMPANY'],
          backgroundColor: '#0042f7',
          stack: 'Stack 0',
        },
        {
          label: 'Plug-in Hybrid',
          data: vehicleLocationData['PHEV_COMPANY'],
          backgroundColor: '#17d9f3',
          stack: 'Stack 0',
        },
        {
          label: 'Range Extended Electric',
          data: vehicleLocationData['REEV_COMPANY'],
          backgroundColor: '#e7e40e',
          stack: 'Stack 0',
        },
        {
          label: 'Fuel Cell',
          data: vehicleLocationData['fuelcell_COMPANY'],
          backgroundColor: '#9b0386',
          stack: 'Stack 0',
        },
        {
          label: 'Petrol/Diesel (ULEV)',
          data: vehicleLocationData['iceULEV_COMPANY'],
          backgroundColor: '#da7a0c',
          stack: 'Stack 0',
        },
        {
          label: 'Petrol/Diesel',
          data: vehicleLocationData['ice_COMPANY'],
          backgroundColor: '#ee2405',
          stack: 'Stack 0',
        },
      ]
    };
  
    const dataVehiclePP = {
      labels: labels.slice(0, 15), // Miss last year as no data
      datasets: [
        {
          label: 'Per Person',
          data: vehicleLocationData['vehiclesPPers'].slice(0, 15),
          backgroundColor: '#07c220',
        },
        {
          label: 'Per Adult',
          data: vehicleLocationData['vehiclesPAdult'].slice(0, 15),
          backgroundColor: '#0042f7',
        },
        {
          label: 'Per Household',
          data: vehicleLocationData['vehiclesPHousehold'].slice(0, 15),
          backgroundColor: '#f50c0c',
        }
      ]
    };

  var vehiclePPctx = document.getElementById('vehiclePP-chart').getContext('2d');
	vehiclePPChart = new Chart(vehiclePPctx, {
    type: 'line',
    data: dataVehiclePP,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Number of Vehicles'
          },
          beginAtZero: true
        },
        x: {
          title: {
            display: true,
            text: 'Year'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        }
      }
    },
  });

  var privateVehicleBodyctx = document.getElementById('privateVehicleBody-chart').getContext('2d');
	privateVehicleBodyChart = new Chart(privateVehicleBodyctx, {
    type: 'bar',
    data: dataprivateVehicleBody,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Number of Vehicles'
          },
          beginAtZero: true
        },
        x: {
          title: {
            display: true,
            text: 'Year'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        }
      }
    },
  });
	
  var privateVehicleFuelctx = document.getElementById('privateVehicleFuel-chart').getContext('2d');
  privateVehicleFuelChart = new Chart(privateVehicleFuelctx, {
    type: 'bar',
    data: dataprivateVehicleFuel,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Number of Vehicles'
          },
          beginAtZero: true
        },
        x: {
          title: {
            display: true,
            text: 'Year'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        }
      }
    },
  });

  var companyVehicleBodyctx = document.getElementById('companyVehicleBody-chart').getContext('2d');
  companyVehicleBodyChart = new Chart(companyVehicleBodyctx, {
    type: 'bar',
    data: datacompanyVehicleBody,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Number of Vehicles'
          },
          beginAtZero: true
        },
        x: {
          title: {
            display: true,
            text: 'Year'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        }
      }
    },
  });

  var companyVehicleFuelctx = document.getElementById('companyVehicleFuel-chart').getContext('2d');
  companyVehicleFuelChart = new Chart(companyVehicleFuelctx, {
    type: 'bar',
    data: datacompanyVehicleFuel,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Number of Vehicles'
          },
          beginAtZero: true
        },
        x: {
          title: {
            display: true,
            text: 'Year'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        }
      }
    },
  });



};

// --- 15-minute neighbourhoods (travel-time isochrones) -----------------------
// Recreates the legacy PBCC "15-minute neighbourhoods" feature. A "Show
// centroids" checkbox displays the population-weighted centroid of each LSOA
// (from the legacy centroids tiles, whose codes match the isochrone data).
// Clicking a centroid fetches and displays that LSOA's 15-minute isochrones for
// walking, cycling, walk+transit and bike+transit. Layers/sources are always
// removed before (re)adding so no stale duplicates remain, and everything is
// re-added after a basemap change (which resets the map style).
// NOTE: the leading semicolon guards against ASI joining this IIFE onto the
// preceding function expression.
;(function setupTransportIsochrones() {
  var handlersBound = false;
  var ISO = 'isochrones';
  var CENTROIDS = 'centroids';
  var lastIsoCode = null; // Re-show the current isochrone after a basemap change

  function getMapHandle() {
    return (typeof capUi !== 'undefined' && typeof capUi.getMap === 'function') ? capUi.getMap() : null;
  }

  function centroidsEnabled() {
    var cb = document.getElementById('centroidscheckbox');
    return !!(cb && cb.checked);
  }

  function removeIsochrones(map) {
    if (map.getLayer(ISO)) { map.removeLayer(ISO); }
    if (map.getSource(ISO)) { map.removeSource(ISO); }
  }

  function showIsochrones(map, lsoacode) {
    // Always clear any existing isochrone first to avoid duplicate layers/sources
    removeIsochrones(map);
    lastIsoCode = lsoacode;
    map.addSource(ISO, {
      type: 'geojson',
      data: 'https://pbcc.blob.core.windows.net/pbcc-data/isochrones_legacy/' + lsoacode + '.geojson'
    });
    // Insert below the roads (as in the legacy tool) where that anchor exists
    var beforeId = (map.getLayer('roads 0 Restricted Road') ? 'roads 0 Restricted Road' :
                    (map.getLayer('placeholder_name') ? 'placeholder_name' : undefined));
    map.addLayer({
      id: ISO,
      type: 'fill',
      source: ISO,
      paint: {
        'fill-color': ['match', ['get', 'mode'],
          'WALK', '#4daf4a',
          'BIKE', '#377eb8',
          'TRANSIT', '#984ea3',
          'BIKETRANSIT', '#e41a1c',
          /* other */ '#e0e0e0'],
        'fill-opacity': 0.6,
        'fill-outline-color': 'rgba(0, 0, 0, 0.6)'
      }
    }, beforeId);
    if (typeof capUi !== 'undefined' && typeof capUi.trackEvent === 'function') {
      capUi.trackEvent('isochrones_show', { 'lsoa': lsoacode });
    }
  }

  // (Re)create the centroids source and circle layer; safe to call repeatedly
  function ensureCentroids(map) {
    if (!map.getSource(CENTROIDS)) {
      map.addSource(CENTROIDS, {
        type: 'vector',
        url: 'pmtiles://https://pbcc.blob.core.windows.net/pbcc-pmtiles/centroids_legacy.pmtiles',
        minzoom: 6,
        maxzoom: 13
      });
    }
    if (!map.getLayer(CENTROIDS)) {
      map.addLayer({
        id: CENTROIDS,
        type: 'circle',
        source: CENTROIDS,
        'source-layer': 'centroids',
        layout: {
          visibility: (centroidsEnabled() ? 'visible' : 'none')
        },
        paint: {
          // Make circles larger as the user zooms in (as in the legacy tool)
          'circle-radius': {
            'base': 5,
            'stops': [[10, 7], [22, 180]]
          },
          'circle-color': '#000000'
        }
      });
    }
  }

  function initIsochrones() {
    var map = getMapHandle();
    if (!map) { return; }

    // Re-add sources/layers every time the map style is (re)built
    ensureCentroids(map);
    if (lastIsoCode && centroidsEnabled() && !map.getLayer(ISO)) {
      showIsochrones(map, lastIsoCode);
    }

    // Bind interaction handlers once only (map.on handlers survive style changes)
    if (handlersBound) { return; }
    handlersBound = true;

    // Click a centroid to show that LSOA's isochrones
    map.on('click', CENTROIDS, function (e) {
      if (!e.features || !e.features.length) { return; }
      var code = e.features[0].properties.code;
      if (code) { showIsochrones(map, code); }
    });

    // Pointer cursor over centroids
    map.on('mouseenter', CENTROIDS, function () { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', CENTROIDS, function () { map.getCanvas().style.cursor = ''; });

    // "Show centroids" checkbox toggles the centroid layer
    var cb = document.getElementById('centroidscheckbox');
    if (cb) {
      cb.addEventListener('change', function () {
        var m = getMapHandle();
        if (!m) { return; }
        ensureCentroids(m);
        m.setLayoutProperty(CENTROIDS, 'visibility', (cb.checked ? 'visible' : 'none'));
        if (!cb.checked) {
          removeIsochrones(m);
          lastIsoCode = null;
        }
        if (typeof capUi !== 'undefined' && typeof capUi.trackEvent === 'function') {
          capUi.trackEvent('isochrones_toggle', { 'enabled': cb.checked });
        }
      });
    }

    // "Clear isochrones" button
    var clearBtn = document.getElementById('clearisochrones');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        var m = getMapHandle();
        if (m) { removeIsochrones(m); }
        lastIsoCode = null;
      });
    }
  }

  // '@map/ready' fires on initial load and after every basemap change
  document.addEventListener('@map/ready', initIsochrones);
})();

// Function for modal tabs
modalTab = function (evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();

// Print buttons are wired up by capUi.initPrintButtons (js/ui-common.js), which
// also lays out the charts in unopened tabs so they appear in the printout. This
// file used to bind its own duplicate handler, which bound a second click
// listener to the same buttons and so opened the print dialog twice.

// Function to switch chart description tabs (Overview / Policy / Methods)
// Scoped to the chart's own .chart-description-tabs container, so multiple
// chart tab groups operate independently.
switchChartTab = function (evt, tabName) {
  var tabsContainer = evt.currentTarget.closest('.chart-description-tabs');
  tabsContainer.querySelectorAll('.chart-description-tab-content').forEach(function (content) {
    content.classList.remove('active');
    content.style.display = 'none';
  });
  tabsContainer.querySelectorAll('.chart-tab-btn').forEach(function (button) {
    button.classList.remove('active');
  });
  var selectedContent = document.getElementById(tabName);
  if (selectedContent) {
    selectedContent.classList.add('active');
    selectedContent.style.display = 'block';
    evt.currentTarget.classList.add('active');
  }
};
