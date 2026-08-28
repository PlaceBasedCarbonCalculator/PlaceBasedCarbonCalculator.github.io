// Local Chart Management
var emissionsChart;
var gasChart;
var electricityChart;
var metersChart;

var emissionsLSOAChart;
var gasLSOAChart;
var electricityLSOAChart;
var metersLSOAChart;
var energybillsLSOAChart;

var epcratingChart;
var buildingtypeChart;
var tenureChart;
var ageChart;
var floorChart;
var floordChart;
var windowChart;
var waterChart;
var waterdChart;
var glazingChart;
var wallChart;
var walldChart;
var roofChart;
var roofdChart;
var mainheatChart;
var mainheatdescChart;
var mainfuelChart;
var mainheatcontrolChart;
var controldChart;
var lightChart;
var solarpvChart;
var solarthermalChart;

var pricesChart;
var transactionsChart;

var postcodeLocationData = {};
var lsoaLocationData = {};
var pricesLocationData = {};
var lsoaEnergyData = {};

manageCharts =  function (locationId, mapLayerId){
  if(mapLayerId == 'zones'){

    // EPC domestic summary now comes from the epc_dom bin (single binary +
    // range request) instead of one JSON file per zone.
    const pEPC = capBin.fetchRecord('epc_dom', locationId)
      .then(data => { lsoaLocationData = data[0]; makeChartLSOA(); })
      .catch(err => { console.error('EPC failed:', err); });
    
    // Gas/electricity history now comes from the historical_domestic_gas_elec
    // bin (single binary + range request) instead of one JSON file per zone.
    const pEnergy = capBin.fetchRecord('historical_domestic_gas_elec', locationId)
      .then(data => { lsoaEnergyData = data; makeChartLSOAEnergy(); })
      .catch(err => { console.error('Energy failed:', err); });

    // Prices now come from the prices bin instead of one JSON file per zone.
    const pPrices = capBin.fetchRecord('prices', locationId)
      .then(data => { pricesLocationData = data; makeChartPrices(); })
      .catch(err => { 
        console.error('Prices failed:', err);
        if(pricesChart){
          pricesChart.destroy();
        }
        if(transactionsChart){
          transactionsChart.destroy();
        }
      });

    // Council tax bands, GB-wide (see the dwelling stock section below).
    const pVOABands = capBin.fetchRecord('voa_2010', locationId)
      .then(data => {
        voaBandsLocationData = data;
        voaSetAvailable(['dwellingsct'], 'dwellingsct-nodata', true);
        makeChartVOABands();
      })
      .catch(err => {
        console.error('VOA council tax bands failed:', err);
        if(dwellingsctChart){ dwellingsctChart.destroy(); }
        voaSetAvailable(['dwellingsct'], 'dwellingsct-nodata', false);
      });

    // Dwelling type/bedrooms/build period, England and Wales only. A Scottish
    // zone has no record here at all, so this rejects; that is the expected
    // outcome rather than a failure, and the charts are replaced by a note.
    const pVOAStock = capBin.fetchRecord('voa_2020', locationId)
      .then(data => {
        voaStockLocationData = data;
        voaSetAvailable(['dwellingstype','dwellingsbedrooms','dwellingsage'], 'dwellingsstock-nodata', true);
        makeChartVOAStock();
      })
      .catch(err => {
        if(dwellingstypeChart){ dwellingstypeChart.destroy(); }
        if(dwellingsbedroomsChart){ dwellingsbedroomsChart.destroy(); }
        if(dwellingsageChart){ dwellingsageChart.destroy(); }
        voaSetAvailable(['dwellingstype','dwellingsbedrooms','dwellingsage'], 'dwellingsstock-nodata', false);
      });

    return Promise.all([pEPC, pPrices, pEnergy, pVOABands, pVOAStock]);
    //return p;
  } else if (mapLayerId == 'postcodes'){
    // Postcode gas/electricity data now comes from the postcode bin (single
    // binary + range request) instead of one JSON file per postcode. Note the
    // postcode index is large (~1.5M records); it downloads once per session.
    const p = capBin.fetchRecord('postcode', locationId)
        .then(function (postcodeData) {
            postcodeLocationData = postcodeData;
            makeChartPostcode(locationId);
        })
        .catch(function (error) {
            alert('Failed to get access data for this location, or to process it correctly. Please try refreshing the page.');
            console.log(error);
        });

    return p;
  } else {
    console.log('Unknown layer for chart management: ' + mapLayerId);
    return Promise.resolve();
  }
}

makeChartPostcode = function(locationId){
  
  console.log("Make postcode charts");
  // Access Chart
  // Destroy old chart
	if(emissionsChart){
		emissionsChart.destroy();
	}
	if(gasChart){
		gasChart.destroy();
	}
	if(electricityChart){
		electricityChart.destroy();
	}
  if(metersChart){
		metersChart.destroy();
	}

  // Set modal title
  const title = locationId + ' postcode summary';
	document.querySelector('#postcodes-chartsmodal .modal-title').innerHTML = title;
  
  // Get Control Settings
  const setting_emissions = document.getElementById("select_emissions").value;
	const setting_gas = document.getElementById("select_gas").value;
  const setting_electricity = document.getElementById("select_electricity").value;
  
  let data_emissions_gas;
  let data_emissions_elec;
  let data_elec_all;
  let data_elec_std;
  let data_elec_eco7;
  let data_gas;
  

  // Get data
  // Not doing emissions for standard and eco7 meters
  if(setting_emissions == "total"){
     data_emissions_gas = postcodeLocationData['gas_totalkgco2e'];
     data_emissions_elec = postcodeLocationData['elec_totalkgco2e_all'];
  } else if (setting_emissions == "mean") {
     data_emissions_gas = postcodeLocationData['gas_meankgco2e'];
     data_emissions_elec = postcodeLocationData['elec_meankgco2e_all'];
  } else if (setting_emissions == "median") {
     data_emissions_gas = postcodeLocationData['gas_mediankgco2e'];
     data_emissions_elec = postcodeLocationData['elec_mediankgco2e_all'];
  }
  
  if(setting_electricity == "total"){
     data_elec_all = postcodeLocationData['elec_totalkwh_all'];
     data_elec_std = postcodeLocationData['elec_totalkwh_std'];
     data_elec_eco7 = postcodeLocationData['elec_totalkwh_eco7'];
  } else if (setting_electricity == "mean") {
     data_elec_all = postcodeLocationData['elec_meankwh_all'];
     data_elec_std = postcodeLocationData['elec_meankwh_std'];
     data_elec_eco7 = postcodeLocationData['elec_meankwh_eco7'];
  } else if (setting_electricity == "median") {
     data_elec_all = postcodeLocationData['elec_mediankwh_all'];
     data_elec_std = postcodeLocationData['elec_mediankwh_std'];
     data_elec_eco7 = postcodeLocationData['elec_mediankwh_eco7'];
  }
  
  if(setting_gas == "total"){
     data_gas = postcodeLocationData['gas_totalkwh'];
  } else if (setting_gas == "mean") {
     data_gas = postcodeLocationData['gas_meankwh'];
  } else if (setting_gas == "median") {
     data_gas = postcodeLocationData['gas_mediankwh'];
  }
  
  
  
  const labels = postcodeLocationData['year'];
  const dataMeters = {
    labels: labels,
    datasets: [
      {
        label: 'Gas',
        data: postcodeLocationData['gas_meters'],
        backgroundColor: '#2b8cbe',
        stack: 'Stack 0',
      },
      {
        label: 'Electric (all)',
        data: postcodeLocationData['elec_meters_all'],
        backgroundColor: '#b30000',
        stack: 'Stack 1',
      },
      {
        label: 'Electric (Standard)',
        data: postcodeLocationData['elec_meters_std'],
        backgroundColor: '#e34a33',
        stack: 'Stack 2',
      },
      {
        label: 'Electric (Economy 7)',
        data: postcodeLocationData['elec_meters_eco7'],
        backgroundColor: '#fdcc8a',
        stack: 'Stack 2',
      }
    ]
  };
  
  
  const dataEmissions = {
    labels: labels,
      datasets: [
        {
          label: 'Gas',
          data: data_emissions_gas,
          borderColor: '#2b8cbe',
          backgroundColor: '#2b8cbe',
        },
        {
          label: 'Electricity',
          data: data_emissions_elec,
          borderColor: '#b30000',
          backgroundColor: '#b30000',
        }
      ]
    };
	
	const dataElectricity = {
    labels: labels,
      datasets: [
        {
          label: 'All meters',
          data: data_elec_all,
          borderColor: '#b30000',
          backgroundColor: '#b30000',
        },
        {
          label: 'Standard Meters',
          data: data_elec_std,
          borderColor: '#e34a33',
          backgroundColor: '#e34a33',
        },
        {
          label: 'Economy 7 Meters',
          data: data_elec_eco7,
          borderColor: '#fdcc8a',
          backgroundColor: '#fdcc8a',
        }
      ]
    };
	
	
	const dataGas = {
    labels: labels,
      datasets: [
        {
          label: 'All meters',
          data: data_gas,
          borderColor: '#2b8cbe',
          backgroundColor: '#2b8cbe',
        }
      ]
    };
	
	var metersctx = document.getElementById('meters-chart').getContext('2d');
	metersChart = new Chart(metersctx, {
    type: 'bar',
      data: dataMeters,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Year'
            }
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: 'Meters'
            }
          }
        }
      }
  });
	
	var emissionsctx = document.getElementById('emissions-chart').getContext('2d');
	emissionsChart = new Chart(emissionsctx, {
    type: 'line',
    data: dataEmissions,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Emissions kgCO2e'
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
  
  var gasctx = document.getElementById('gas-chart').getContext('2d');
	gasChart = new Chart(gasctx, {
    type: 'line',
    data: dataGas,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Gas Consumption kWh'
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
	
	var electricityctx = document.getElementById('electricity-chart').getContext('2d');
	electricityChart = new Chart(electricityctx, {
    type: 'line',
    data: dataElectricity,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Consumption kWh'
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
  
}

makeChartLSOAEnergy = function(locationId){
  
  console.log("Make LSOA Energy Charts charts");
  // Access Chart
  // Destroy old chart
	if(emissionsLSOAChart){
		emissionsLSOAChart.destroy();
	}
	if(gasLSOAChart){
		gasLSOAChart.destroy();
	}
	if(electricityLSOAChart){
		electricityLSOAChart.destroy();
	}
  if(metersLSOAChart){
		metersLSOAChart.destroy();
	}
  if(energybillsLSOAChart){
		energybillsLSOAChart.destroy();
	}

  // Get Control Settings
  const setting_emissions = document.getElementById("select_emissionsLSOA").value;
	const setting_gas = document.getElementById("select_gasLSOA").value;
  const setting_electricity = document.getElementById("select_electricityLSOA").value;
  
  let data_emissions_gas;
  let data_emissions_elec;
  let data_elec_all;

  // Get data
  
  if(setting_emissions == "total"){
     data_emissions_gas = lsoaEnergyData['total_gas_kgco2e'];
     data_emissions_elec = lsoaEnergyData['total_elec_kgco2e'];
     data_emissions_other = lsoaEnergyData['total_other_kgco2e'];
  } else if (setting_emissions == "mean") {
     data_emissions_gas = lsoaEnergyData['mean_gas_kgco2e'];
     data_emissions_elec = lsoaEnergyData['mean_elec_kgco2e'];
     data_emissions_other = lsoaEnergyData['mean_other_kgco2e'];
  } else if (setting_emissions == "median") {
     data_emissions_gas = lsoaEnergyData['median_gas_kgco2e'];
     data_emissions_elec = lsoaEnergyData['median_elec_kgco2e'];
     data_emissions_other = lsoaEnergyData['mean_other_kgco2e']; // Using mean for other as median not available
  }
  
  if(setting_electricity == "total"){
     data_elec_all = lsoaEnergyData['total_elec_kwh'];
  } else if (setting_electricity == "mean") {
     data_elec_all = lsoaEnergyData['mean_elec_kwh'];
  } else if (setting_electricity == "median") {
     data_elec_all = lsoaEnergyData['median_elec_kwh'];
  }
  
  if(setting_gas == "total"){
     data_gas = lsoaEnergyData['total_gas_kwh'];
  } else if (setting_gas == "mean") {
     data_gas = lsoaEnergyData['mean_gas_kwh'];
  } else if (setting_gas == "median") {
     data_gas = lsoaEnergyData['median_gas_kwh'];
  }
  
  
  
  const labels = lsoaEnergyData.year;
  const dataMeters = {
    labels: labels,
    datasets: [
      {
        label: 'Gas',
        data: lsoaEnergyData['meters_gas'],
        backgroundColor: '#2b8cbe',
        stack: 'Stack 0',
      },
      {
        label: 'Electric',
        data: lsoaEnergyData['meters_elec'],
        backgroundColor: '#b30000',
        stack: 'Stack 1',
      }
    ]
  };
  
  
  const dataEmissions = {
    labels: labels,
      datasets: [
        {
          label: 'Gas',
          data: data_emissions_gas,
          borderColor: '#2b8cbe',
          backgroundColor: '#2b8cbe',
        },
        {
          label: 'Electricity',
          data: data_emissions_elec,
          borderColor: '#b30000',
          backgroundColor: '#b30000',
        },
        {
          label: 'Other',
          data: data_emissions_other,
          borderColor: '#008000',
          backgroundColor: '#008000',
        }
      ]
    };
	
	const dataElectricity = {
    labels: labels,
      datasets: [
        {
          label: 'Domestic Electricity',
          data: data_elec_all,
          borderColor: '#b30000',
          backgroundColor: '#b30000',
        }
      ]
    };
	
	
	const dataGas = {
    labels: labels,
      datasets: [
        {
          label: 'Domestic Gas',
          data: data_gas,
          borderColor: '#2b8cbe',
          backgroundColor: '#2b8cbe',
        }
      ]
    };
	
    const dataEnergyBills = {
    labels: labels,
      datasets: [
        {
          label: 'Gas',
          data: lsoaEnergyData['gas_average_bill'],
          borderColor: '#2b8cbe',
          backgroundColor: '#2b8cbe',
        },
        {
          label: 'Electricity',
          data: lsoaEnergyData['elec_average_bill'],
          borderColor: '#b30000',
          backgroundColor: '#b30000',
        },
        {
          label: 'Other',
          data: lsoaEnergyData['otherheating_average_bill'],
          borderColor: '#008000',
          backgroundColor: '#008000',
        },
        {
          label: 'Total',
          data: lsoaEnergyData['energy_average_bill'],
          borderColor: '#420144',
          backgroundColor: '#420144',
        }
      ]
    };

	var metersctx = document.getElementById('metersLSOA-chart').getContext('2d');
	metersLSOAChart = new Chart(metersctx, {
    type: 'bar',
      data: dataMeters,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Year'
            }
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: 'Meters'
            }
          }
        }
      }
  });
	
	var emissionsctx = document.getElementById('emissionsLSOA-chart').getContext('2d');
	emissionsLSOAChart = new Chart(emissionsctx, {
    type: 'line',
    data: dataEmissions,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Emissions kgCO2e'
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

  var energybillsctx = document.getElementById('energybillsLSOA-chart').getContext('2d');
	energybillsLSOAChart = new Chart(energybillsctx, {
    type: 'line',
    data: dataEnergyBills,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Average Bill (£)'
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
  
  var gasctx = document.getElementById('gasLSOA-chart').getContext('2d');
	gasLSOAChart = new Chart(gasctx, {
    type: 'line',
    data: dataGas,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Gas Consumption kWh'
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
	
	var electricityctx = document.getElementById('electricityLSOA-chart').getContext('2d');
	electricityLSOAChart = new Chart(electricityctx, {
    type: 'line',
    data: dataElectricity,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Consumption kWh'
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
  
}


makeChartPrices = function(){
  
  console.log("Make prices charts");
  
  // Destroy old charts
  if(pricesChart){
    pricesChart.destroy();
  }
  if(transactionsChart){
    transactionsChart.destroy();
  }
  
  // Prepare data for box and whisker chart (prices)
  // Using line chart to show median with range indicators
  const pricesData = {
    labels: pricesLocationData.year,
    datasets: [
      {
        label: 'Maximum Price',
        data: pricesLocationData.price_max,
        borderColor: '#c0c0c0',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
        tension: 0.1,
        hidden: true
      },
      {
        label: 'Upper Quartile (Q3)',
        data: pricesLocationData.price_75,
        borderColor: '#a8d5e8',
        backgroundColor: 'transparent',
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
        tension: 0.1
      },
      {
        label: 'Median Price',
        data: pricesLocationData.price_median,
        borderColor: '#2b8cbe',
        backgroundColor: '#2b8cbe',
        borderWidth: 2,
        fill: false,
        pointRadius: 4,
        pointBackgroundColor: '#2b8cbe',
        tension: 0.1
      },
      {
        label: 'Lower Quartile (Q1)',
        data: pricesLocationData.price_25,
        borderColor: '#a8d5e8',
        backgroundColor: 'transparent',
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
        tension: 0.1
      },
      {
        label: 'Minimum Price',
        data: pricesLocationData.price_min,
        borderColor: '#c0c0c0',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
        tension: 0.1
      }
    ]
  };
  
  // Create price chart
  var pricesctx = document.getElementById('prices-chart').getContext('2d');
  pricesChart = new Chart(pricesctx, {
    type: 'line',
    data: pricesData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Price (£)'
          },
          beginAtZero: false
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
    }
  });
  
  // Prepare data for transactions bar chart
  const transactionsData = {
    labels: pricesLocationData.year,
    datasets: [{
      label: 'Number of Transactions',
      data: pricesLocationData.transactions,
      backgroundColor: '#d7191c',
      borderColor: '#d7191c',
      borderWidth: 1
    }]
  };
  
  // Create transactions chart
  var transactionsctx = document.getElementById('transactions-chart').getContext('2d');
  transactionsChart = new Chart(transactionsctx, {
    type: 'bar',
    data: transactionsData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Number of Transactions'
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
    }
  });
  
}

makeChartLSOA = function(){
  
  console.log("Make LSOA charts");
  
  // EPC chart
  
  epcratingData = [
  lsoaLocationData.epc_A,
  lsoaLocationData.epc_B,
  lsoaLocationData.epc_C,
  lsoaLocationData.epc_D,
  lsoaLocationData.epc_E,
  lsoaLocationData.epc_F,
  lsoaLocationData.epc_G,
  lsoaLocationData.epc_other,
  ];
 
	epcratingChart = makePieChart(epcratingChart,'epcrating-chart','EPC rating',
  epcratingData,
  ['#0e7e58','#2aa45b','#8cbc42','#f6cc15','#f2a867','#f17e23','#e31d3e','#c0c0c0'],
  ['A','B','C','D','E','F','G','Other']);
  
  // Building type
  
  buildingtypeData = [
  lsoaLocationData.type_house_detached,
  lsoaLocationData.type_house_semi,
  lsoaLocationData.type_house_midterrace,
  lsoaLocationData.type_house_endterrace,
  lsoaLocationData.type_flat,
  lsoaLocationData.type_bungalow_detached,
  lsoaLocationData.type_bungalow_semi,
  lsoaLocationData.type_bungalow_midterrace,
  lsoaLocationData.type_bungalow_endterrace,
  lsoaLocationData.type_maisonette,
  lsoaLocationData.type_parkhome,
  lsoaLocationData.type_other,
  ];
 
	buildingtypeChart = makePieChart(buildingtypeChart,'buildingtype-chart','Building type',
  buildingtypeData,
  ['#c2e699','#78c679','#006837','#31a354','#e31a1c','#fbb4b9','#f768a1','#7a0177','#c51b8a','#1f78b4','#fa7c00','#c0c0c0'],
  ['Detached house','Semi-detached house','Mid-terrace house','End-terrace house',
			'Flat','Detached bungalow','Semi-detached bungalow','Mid-terrace bungalow',
			'End-terrace bungalow','Maisonette','Park home','Other']);
	
  // Tenure type
  
  tenureData = [
  lsoaLocationData.tenure_owner,
  lsoaLocationData.tenure_privaterent,
  lsoaLocationData.tenure_socialrent,
  lsoaLocationData.tenure_unknown
  ];
 
  tenureChart = makePieChart(tenureChart,'tenure-chart','Tenure',
  tenureData,
  ['#33a02c','#e31a1c','#1f78b4','#c0c0c0'],
  ['Owner','Private rent','Social rent','Unknown']);
  
  // Age

  ageData = [
  lsoaLocationData.age_pre1900,
  lsoaLocationData.age_19001929,
  lsoaLocationData.age_19301949,
  lsoaLocationData.age_19501966,
  lsoaLocationData.age_19671975,
  lsoaLocationData.age_19761982,
  lsoaLocationData.age_19831990,
  lsoaLocationData.age_19911995,
  lsoaLocationData.age_19962002,
  lsoaLocationData.age_20032006,
  lsoaLocationData.age_20072011,
  lsoaLocationData.age_20122021,
  lsoaLocationData.age_post2022,
  lsoaLocationData.age_unknown,
  ];
 
  ageChart = makePieChart(ageChart,'age-chart','Building Age',
  ageData,
  ['#9e0142','#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2','#934fa2','#c259a7','#c0c0c0'],
  ['pre-1900','1900-1929','1930-1949','1950-1966','1967-1975','1976-1982',
  '1983-1990','1991-1995','1996-2002','2003-2006','2007-2011','2012-2021','post-2022','Unknown']);
  
  
  // floor
  // TODO: Data looks wrong
  
  floorData = [
    lsoaLocationData.floor_verygood,
    lsoaLocationData.floor_good,
    lsoaLocationData.floor_average,
    lsoaLocationData.floor_poor,
    lsoaLocationData.floor_verypoor,
    lsoaLocationData.floor_below,
    lsoaLocationData.floor_other,
  ];
 
  floorChart = makePieChart(floorChart,'floor-chart','',
  floorData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#225ea8','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Dwelling Below','Other']);
  
  // floord
  
  floordData = [
    lsoaLocationData.floord_soliduninsulated,
    lsoaLocationData.floord_solidinsulated,
    lsoaLocationData.floord_solidlimitedinsulated,
    lsoaLocationData.floord_suspendeduninsulated,
    lsoaLocationData.floord_suspendedinsualted,
    lsoaLocationData.floord_suspendedlimitedinsulated,
    lsoaLocationData.floord_external,
    lsoaLocationData.floord_below,
    lsoaLocationData.floord_other
  ];
 
  floordChart = makePieChart(floordChart,'floord-chart','',
  floordData,
  ['#238b45','#b2e2e2','#66c2a4','#ce1256','#f1b6da','#df65b0','#fdae61','#225ea8','#c0c0c0'],
  ['Solid uninsulated','Solid insulated','Solid limited insulation','Suspended uninsulated','Suspended insulated','Suspended limited insulation','Exposed to outside air','Dwelling Below','Other']);
  
  // window
  
  windowData = [
    lsoaLocationData.window_verygood,
    lsoaLocationData.window_good,
    lsoaLocationData.window_average,
    lsoaLocationData.window_poor,
    lsoaLocationData.window_verypoor,
    lsoaLocationData.window_other
  ];
 
  windowChart = makePieChart(windowChart,'window-chart','',
  windowData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Other']);
  
  // water
  
  waterData = [
    lsoaLocationData.water_verygood,
    lsoaLocationData.water_good,
    lsoaLocationData.water_average,
    lsoaLocationData.water_poor,
    lsoaLocationData.water_verypoor,
    lsoaLocationData.water_other,

  ];
 
  waterChart = makePieChart(waterChart,'water-chart','',
  waterData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Other']);
  
  // waterd
  
  waterdData = [
    lsoaLocationData.waterd_mainsystem,
    lsoaLocationData.waterd_immersion,
    lsoaLocationData.waterd_community,
    lsoaLocationData.waterd_instantaneous,
    lsoaLocationData.waterd_gasmultipoint,
    lsoaLocationData.waterd_other
  ];
 
  waterdChart = makePieChart(waterdChart,'waterd-chart','',
  waterdData,
  ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ffff33','#c0c0c0'],
  ['Main system','Immersion heater','Community system','Instantaneous water heater','Gas multipoint','Other']);
  
  // glazing
  
  glazingData = [
    lsoaLocationData.glazing_single,
    lsoaLocationData.glazing_double,
    lsoaLocationData.glazing_triple,
    lsoaLocationData.glazing_secondary,
    lsoaLocationData.glazing_unknown
  ];
 
  glazingChart = makePieChart(glazingChart,'glazing-chart','',
  glazingData,
  ['#e41a1c','#377eb8','#4daf4a','#984ea3','#c0c0c0'],
  ['single','double','triple','secondary','unknown']);
  
  // wall
  
  wallData = [
    lsoaLocationData.wall_verygood,
    lsoaLocationData.wall_good,
    lsoaLocationData.wall_average,
    lsoaLocationData.wall_poor,
    lsoaLocationData.wall_verypoor,
    lsoaLocationData.wall_other

  ];
 
  wallChart = makePieChart(wallChart,'wall-chart','',
  wallData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Other']);
  
  // walld
  
  walldData = [
    lsoaLocationData.walld_cavity,
    lsoaLocationData.walld_solid,
    lsoaLocationData.walld_timber,
    lsoaLocationData.walld_sandlimestone,
    lsoaLocationData.walld_granitewhinstine,
    lsoaLocationData.walld_system,
    lsoaLocationData.walld_other
  ];
 
  walldChart = makePieChart(walldChart,'walld-chart','',
  walldData,
  ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#c0c0c0'],
  ['Cavity','Solid','Timber','Sand/limestone','Granite/whinstine','System built','Other']);
  
  // roof
  
  roofData = [
    lsoaLocationData.roof_verygood,
    lsoaLocationData.roof_good,
    lsoaLocationData.roof_average,
    lsoaLocationData.roof_poor,
    lsoaLocationData.roof_verypoor,
    lsoaLocationData.roof_above,
    lsoaLocationData.roof_other

  ];
 
  roofChart = makePieChart(roofChart,'roof-chart','',
  roofData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#4d9221','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Dwelling Above','Other']);
  
  // roofd
  
  roofdData = [
    lsoaLocationData.roofd_pitched,
    lsoaLocationData.roofd_flat,
    lsoaLocationData.roofd_room,
    lsoaLocationData.roofd_thatched,
    lsoaLocationData.roofd_above,
    lsoaLocationData.roofd_other
  ];
 
  roofdChart = makePieChart(roofdChart,'roofd-chart','',
  roofdData,
  ['#e41a1c','#377eb8','#4daf4a','#ffff33','#4d9221','#c0c0c0'],
  ['Pitched','Flat roof','Room in roof','Thatched','Dwelling Above','Other']);
  
  // mainheatdesc
  
  mainheatdescData = [
    lsoaLocationData.mainheatdesc_gasboiler,
    lsoaLocationData.mainheatdesc_oilboiler,
    lsoaLocationData.mainheatdesc_storageheater,
    lsoaLocationData.mainheatdesc_portableheater,
    lsoaLocationData.mainheatdesc_roomheater,
    lsoaLocationData.mainheatdesc_heatpump,
    lsoaLocationData.mainheatdesc_community,
    lsoaLocationData.mainheatdesc_other
  ];
 
  mainheatdescChart = makePieChart(mainheatdescChart,'mainheatdesc-chart','',
  mainheatdescData,
  ['#e41a1c','#984ea3','#ff7f00','#a65628','#ffff33','#4daf4a','#377eb8','#c0c0c0'],
  ['Gas boiler','Oil boiler','Storage heater','Portable heater','Room heaters','Heat pump','Community','Other']);
  
  // mainheat
  
  mainheatData = [
    lsoaLocationData.mainheat_verygood,
    lsoaLocationData.mainheat_good,
    lsoaLocationData.mainheat_average,
    lsoaLocationData.mainheat_poor,
    lsoaLocationData.mainheat_verypoor,
    lsoaLocationData.mainheat_other

  ];
 
  mainheatChart = makePieChart(mainheatChart,'mainheat-chart','',
  mainheatData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Other']);
  
  
  // mainfuel
  
  mainfuelData = [
    lsoaLocationData.mainfuel_mainsgas,
    lsoaLocationData.mainfuel_electric,
    lsoaLocationData.mainfuel_oil,
    lsoaLocationData.mainfuel_coal,
    lsoaLocationData.mainfuel_lpg,
    lsoaLocationData.mainfuel_biomass,
    lsoaLocationData.mainfuel_dualfuel,
    lsoaLocationData.mainfuel_other
  ];
 
  mainfuelChart = makePieChart(mainfuelChart,'mainfuel-chart','',
  mainfuelData,
  ['#e41a1c','#377eb8','#984ea3','#666666','#ff7f00','#4daf4a','#a65628','#c0c0c0'],
  ['Mains gas','Electric','Oil','Coal','LPG','Biomass','Dual fuel','Other']);
  
  // mainheatcontrol
  
  mainheatcontrolData = [
    lsoaLocationData.mainheatcontrol_verygood,
    lsoaLocationData.mainheatcontrol_good,
    lsoaLocationData.mainheatcontrol_average,
    lsoaLocationData.mainheatcontrol_poor,
    lsoaLocationData.mainheatcontrol_verypoor,
    lsoaLocationData.mainheatcontrol_other

  ];
 
  mainheatcontrolChart = makePieChart(mainheatcontrolChart,'mainheatcontrol-chart','',
  mainheatcontrolData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Other']);
  
  // controld
  
  controldData = [
    lsoaLocationData.controld_progthermtrvs,
    lsoaLocationData.controld_progtherm,
    lsoaLocationData.controld_progtrvsbypass,
    lsoaLocationData.controld_pzones,
    lsoaLocationData.controld_other
  ];
 
  controldChart = makePieChart(controldChart,'controld-chart','',
  controldData,
  ['#e41a1c','#377eb8','#4daf4a','#984ea3','#c0c0c0'],
  ['progammer, thermostats & trvs','progammer, thermostats','progammer,trvs & bypass','zones','Other']);
  
  // light
  
  lightData = [
    lsoaLocationData.light_verygood,
    lsoaLocationData.light_good,
    lsoaLocationData.light_average,
    lsoaLocationData.light_poor,
    lsoaLocationData.light_verypoor,
    lsoaLocationData.light_other
  ];
 
  lightChart = makePieChart(lightChart,'light-chart','',
  lightData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Other']);
  
  // solarpv
  
  solarpvData = [
    lsoaLocationData.solarpv_yes,
    lsoaLocationData.solarpv_no
  ];
 
  solarpvChart = makePieChart(solarpvChart,'solarpv-chart','',
  solarpvData,
  ['#2c7bb6','#d7191c'],
  ['Yes','No']);
  
  // solarthermal
  
  solarthermalData = [
    lsoaLocationData.solarthermal_yes,
    lsoaLocationData.solarthermal_no
  ];
 
  solarthermalChart = makePieChart(solarthermalChart,'solarthermal-chart','',
  solarthermalData,
  ['#2c7bb6','#d7191c'],
  ['Yes','No']);
  
  
  
}

makePieChart = function(chartVar, name, label, data, colours, labels){
  if (chartVar) {
    chartVar.destroy();
  }
  
  // Drop any slice whose value is missing from the data, together with its
  // colour and label. Without this a renamed or not-yet-published field shows
  // as a legend entry with no wedge, which reads as a real zero.
  var keep = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i] !== undefined && data[i] !== null) { keep.push(i); }
  }
  if (keep.length !== data.length) {
    data    = keep.map(function (i) { return data[i]; });
    colours = keep.map(function (i) { return colours[i]; });
    labels  = keep.map(function (i) { return labels[i]; });
  }
  
  chartVar = new Chart(document.getElementById(name).getContext('2d'), {
		type: 'pie',
		data: {
			datasets: [{
				label: label,
				data: data,
				backgroundColor: colours
				
			}],
			
			labels: labels
		},
		options: {
			responsive: true,
			maintainAspectRatio: false
		}
	});
	
	return chartVar;
}

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
// Click on modal tab open by default
document.addEventListener('DOMContentLoaded', function() {
  var defaultOpenBtn = document.getElementById("defaultOpen");
  if (defaultOpenBtn) {
    defaultOpenBtn.click();
  }
});



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


// ---------------------------------------------------------------------------
// Dwelling stock charts (VOA council tax registers)
//
// Moved here from the PBCC tool, where they were written against the old
// one-JSON-file-per-zone endpoints and had been commented out; they read from
// the voa_2010 / voa_2020 bins now (js/databin.js) like everything else in
// this tool. They belong in the retrofit tool because they describe the
// building stock - what is there, how big, how old - which is the question
// this tool exists to answer.
//
// Two datasets, two different geographies:
//
//   voa_2010  council tax bands, 2010 onwards. GB-wide: the VOA covers
//             England and Wales, and the build repo folds the equivalent
//             Scottish council tax register in on 2022 Data Zones
//             (summarise_voa_post2010()). Band I is Wales-only and stays
//             empty everywhere else.
//   voa_2020  dwelling type, bedrooms and build period, 2020 onwards.
//             England and Wales ONLY - Scotland publishes no equivalent
//             breakdown, so for a Scottish zone the bin has no record and
//             fetchRecord() rejects. That is expected, not an error, so the
//             three charts are hidden and a short explanation shown in their
//             place rather than leaving three empty axes on screen.
// ---------------------------------------------------------------------------

var voaBandsLocationData = {};
var voaStockLocationData = {};

var dwellingsctChart;
var dwellingstypeChart;
var dwellingsbedroomsChart;
var dwellingsageChart;

// Show/hide a group of chart blocks and its "no data here" note together.
// Chart rows in this tool are wrapped in a div whose id is the chart name with
// '-chartrow' appended, so a whole group can be swapped for one explanation
// without disturbing the rest of the report card.
function voaSetAvailable (chartNames, noteId, available)
{
	chartNames.forEach (function (name) {
		const row = document.getElementById (name + '-chartrow');
		if (row) { row.style.display = (available ? 'block' : 'none'); }
	});
	const note = document.getElementById (noteId);
	if (note) { note.style.display = (available ? 'none' : 'block'); }
}

makeChartVOABands = function(){
  
  	// overview Chart
  	// Destroy old chart
	if(dwellingsctChart){
		dwellingsctChart.destroy();
	}
  
  	//console.log(voaBandsLocationData);
 
	const years = voaBandsLocationData['year'];	  
	const bA = voaBandsLocationData['banda'];
  	const bB = voaBandsLocationData['bandb'];
  	const bC = voaBandsLocationData['bandc'];
  	const bD = voaBandsLocationData['bandd'];
  	const bE = voaBandsLocationData['bande'];
  	const bF = voaBandsLocationData['bandf'];
  	const bG = voaBandsLocationData['bandg'];
  	const bH = voaBandsLocationData['bandh'];
  	const bI = voaBandsLocationData['bandi'];
  
  
  var dwellingsctctx = document.getElementById('dwellingsct-chart').getContext('2d');
	dwellingsctChart = new Chart(dwellingsctctx, {
		type: 'bar',
		data: {
			labels: years,
			datasets: [{
				label: 'A',
				data: bA,
				backgroundColor: 'rgba(77,146,33, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'B',
				data: bB,
				backgroundColor: 'rgba(127,188,65, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'C',
				data: bC,
				backgroundColor: 'rgba(184,225,134, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'D',
				data: bD,
				backgroundColor: 'rgba(230,245,208, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'E',
				data: bE,
				backgroundColor: 'rgba(247,247,247, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'F',
				data: bF,
				backgroundColor: 'rgba(253,224,239, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'G',
				data: bG,
				backgroundColor: 'rgba(241,182,218, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'H',
				data: bH,
				backgroundColor: 'rgba(222,119,174, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'I',
				data: bI,
				backgroundColor: 'rgba(197,27,125, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			]
		},
		options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
							y: {
								stacked: true,
								ticks: {
									beginAtZero: true
								}
							},
							x: {
								stacked: true
							}
      },
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
	});
  
  
}


makeChartVOAStock = function(){
  
  // Destroy old chart
	if(dwellingstypeChart){
		dwellingstypeChart.destroy();
	}
	
	if(dwellingsbedroomsChart){
		dwellingsbedroomsChart.destroy();
	}
	
	if(dwellingsageChart){
		dwellingsageChart.destroy();
	}
  
	const years = voaStockLocationData['year'];	  

  var dwellingstypectx = document.getElementById('dwellingstype-chart').getContext('2d');
	dwellingstypeChart = new Chart(dwellingstypectx, {
		type: 'bar',
		data: {
			labels: years,
			datasets: [{
				label: 'Bungalow',
				data: voaStockLocationData['bungalow'],
				backgroundColor: 'rgba(105, 60, 153, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Flat/Maisonette',
				data: voaStockLocationData['flatmais'],
				backgroundColor: 'rgba(227, 26, 28, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Terraced',
				data: voaStockLocationData['terraced'],
				backgroundColor: 'rgba(17, 219, 13, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Semi-Detached',
				data: voaStockLocationData['semi'],
				backgroundColor: 'rgba(14, 156, 11, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Detached',
				data: voaStockLocationData['detached'],
				backgroundColor: 'rgba(8, 82, 7, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'Annexe',
				data: voaStockLocationData['annexe'],
				backgroundColor: 'rgba(31, 120, 180, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'Caravan/Boat/Mobile home',
				data: voaStockLocationData['caravanboatmobilehome'],
				backgroundColor: 'rgba(250, 124, 0, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'Unknown',
				data: voaStockLocationData['unknown'],
				backgroundColor: 'rgba(135, 136, 138, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			}
			]
		},
		options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
							y: {
								stacked: true,
								ticks: {
									beginAtZero: true
								}
							},
							x: {
								stacked: true
							}
      },
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
	});
	
	
	var dwellingsbedroomsctx = document.getElementById('dwellingsbedrooms-chart').getContext('2d');
	dwellingsbedroomsChart = new Chart(dwellingsbedroomsctx, {
		type: 'bar',
		data: {
			labels: years,
			datasets: [{
				label: '1',
				data: voaStockLocationData['bed1'],
				backgroundColor: 'rgba(204,235,197, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '2',
				data: voaStockLocationData['bed2'],
				backgroundColor: 'rgba(168,221,181, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '3',
				data: voaStockLocationData['bed3'],
				backgroundColor: 'rgba(123,204,196, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '4',
				data: voaStockLocationData['bed4'],
				backgroundColor: 'rgba(78,179,211, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '5',
				data: voaStockLocationData['bed5'],
				backgroundColor: 'rgba(43,140,190, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: '6+',
				data: voaStockLocationData['bed6'],
				backgroundColor: 'rgba(8,88,158, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			}
			]
		},
		options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
							y: {
								stacked: true,
								ticks: {
									beginAtZero: true
								}
							},
							x: {
								stacked: true
							}
      },
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
	});
	
	
	var dwellingsagectx = document.getElementById('dwellingsage-chart').getContext('2d');
	dwellingsageChart = new Chart(dwellingsagectx, {
		type: 'bar',
		data: {
			labels: years,
			datasets: [{
				label: 'pre 1900',
				data: voaStockLocationData['bppre1900'],
				backgroundColor: 'rgba(158, 1, 66, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '1900-18',
				data: voaStockLocationData['bp19001918'],
				backgroundColor: 'rgba(213, 62, 79, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '1919-29',
				data: voaStockLocationData['bp19191929'],
				backgroundColor: 'rgba(244, 109, 67, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '1930-39',
				data: voaStockLocationData['bp19301939'],
				backgroundColor: 'rgba(244, 109, 67, 0.8)',
				borderColor: 'rgba(253, 174, 97)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '1945-54',
				data: voaStockLocationData['bp19451954'],
				backgroundColor: 'rgba(254,224,139, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: '1955-64',
				data: voaStockLocationData['bp19551964'],
				backgroundColor: 'rgba(255,255,191, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: '1965-72',
				data: voaStockLocationData['bp19651972'],
				backgroundColor: 'rgba(230,245,152, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: '1973-82',
				data: voaStockLocationData['bp19731982'],
				backgroundColor: 'rgba(171,221,164, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: '1983-92',
				data: voaStockLocationData['bp19831992'],
				backgroundColor: 'rgba(102,194,165, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},			
      {
				label: '1993-99',
				data: voaStockLocationData['bp19931999'],
				backgroundColor: 'rgba(50,136,189, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},			
      {
				label: '2000-08',
				data: voaStockLocationData['bp20002008'],
				backgroundColor: 'rgba(94,79,162, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},			
      {
				label: '2009-21',
				data: voaStockLocationData['bp20092021'],
				backgroundColor: 'rgba(144, 77, 159, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},			
      {
				label: '2022-24',
				data: voaStockLocationData['bp20222024'],
				backgroundColor: 'rgba(217, 22, 74, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'Unknown',
				data: voaStockLocationData['bpunkw'],
				backgroundColor: 'rgba(135, 136, 138, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			}	
			]
		},
		options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
							y: {
								stacked: true,
								ticks: {
									beginAtZero: true
								}
							},
							x: {
								stacked: true
							}
      },
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
	});
  
  
}


