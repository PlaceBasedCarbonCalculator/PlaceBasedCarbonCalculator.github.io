// Local Chart Mangement
var emissionsChart;
var gasChart;
var electricityChart;
var metersChart;
var postcodeLocationData = {};

manageCharts =  function (locationId){
  capUi.fetchJSON('https://pbcc.blob.core.windows.net/pbcc-data/Postcode/' + locationId + '.json')
        .then(function (postcodeData) {
            postcodeLocationData = postcodeData;
            makeChartPostcode();
        })
        .catch(function (error) {
            alert('Failed to get access data for this location, or to process it correctly. Please try refreshing the page.');
            console.log(error);
        });
}


makeChartPostcode = function(){
  
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
     data_emissions_gas = postcodeLocationData['Bgt'];
     data_emissions_elec = postcodeLocationData['Beta'];
  } else if (setting_emissions == "mean") {
     data_emissions_gas = postcodeLocationData['Egm'];
     data_emissions_elec = postcodeLocationData['Eema'];
  } else if (setting_emissions == "median") {
     data_emissions_gas = postcodeLocationData['Dgm'];
     data_emissions_elec = postcodeLocationData['Dema'];
  }
  
  if(setting_electricity == "total"){
     data_elec_all = postcodeLocationData['eta'];
     data_elec_std = postcodeLocationData['ets'];
     data_elec_eco7 = postcodeLocationData['ete'];
  } else if (setting_electricity == "mean") {
     data_elec_all = postcodeLocationData['Bema'];
     data_elec_std = postcodeLocationData['Bems'];
     data_elec_eco7 = postcodeLocationData['Beme'];
  } else if (setting_electricity == "median") {
     data_elec_all = postcodeLocationData['Cems'];
     data_elec_std = postcodeLocationData['Cema'];
     data_elec_eco7 = postcodeLocationData['Ceme'];
  }
  
  if(setting_gas == "total"){
     data_gas = postcodeLocationData['gt'];
  } else if (setting_gas == "mean") {
     data_gas = postcodeLocationData['Bgm'];
  } else if (setting_gas == "median") {
     data_gas = postcodeLocationData['Cgm'];
  }
  
  
  
  const labels = [2015,2016,2017,2018,2019,2020,2021,2022]
  const dataMeters = {
    labels: labels,
    datasets: [
      {
        label: 'Gas',
        data: postcodeLocationData['gm'],
        backgroundColor: '#2b8cbe',
        stack: 'Stack 0',
      },
      {
        label: 'Electric (all)',
        data: postcodeLocationData['ema'],
        backgroundColor: '#b30000',
        stack: 'Stack 1',
      },
      {
        label: 'Electric (Standard)',
        data: postcodeLocationData['ems'],
        backgroundColor: '#e34a33',
        stack: 'Stack 2',
      },
      {
        label: 'Electric (Economy 7)',
        data: postcodeLocationData['eme'],
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





