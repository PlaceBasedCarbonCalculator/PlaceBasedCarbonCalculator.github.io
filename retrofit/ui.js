// Local Chart Mangement
var emissionsChart;
var gasChart;
var electricChart;
var metersChart;
var postcodeLocationData = {};

manageCharts =  function (chartDefinition, locationData){
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
  
  // Access Chart
  // Destroy old chart
	if(emissionsChart){
		emissionsChart.destroy();
	}
	if(gasChart){
		gasChart.destroy();
	}
	if(electricChart){
		electricChart.destroy();
	}
  if(metersChart){
		metersChart.destroy();
	}
  
  // Get Control Settings
  const setting_emissions = document.getElementById("select_emissions").value;
	const setting_gas = document.getElementById("select_gas").value;
  const setting_electricity = document.getElementById("select_electricity").value;
  
  // Get data
  // Not doing emissions for standard and eco7 meters
  if(setting_emissions == "total"){
     const data_emissions_gas = postcodeLocationData[''];
     const data_emissions_elec = postcodeLocationData[''];
  } else if (setting_emissions == "mean") {
     const data_emissions_gas = postcodeLocationData[''];
     const data_emissions_elec = postcodeLocationData[''];
  } else if (setting_emissions == "median") {
     const data_emissions_gas = postcodeLocationData[''];
     const data_emissions_elec = postcodeLocationData[''];
  }
  
  if(setting_emissions == "total"){
     const data_elec_all = postcodeLocationData[''];
     const data_elec_std = postcodeLocationData[''];
     const data_elec_eco7 = postcodeLocationData[''];
  } else if (setting_emissions == "mean") {
     const data_elec_all = postcodeLocationData[''];
     const data_elec_std = postcodeLocationData[''];
     const data_elec_eco7 = postcodeLocationData[''];
  } else if (setting_emissions == "median") {
     const data_elec_all = postcodeLocationData[''];
     const data_elec_std = postcodeLocationData[''];
     const data_elec_eco7 = postcodeLocationData[''];
  }
  
  if(setting_emissions == "total"){
     const data_gas = postcodeLocationData[''];
  } else if (setting_emissions == "mean") {
     const data_gas = postcodeLocationData[''];
  } else if (setting_emissions == "median") {
     const data_gas = postcodeLocationData[''];
  }
  
  const labels = [2015,2016,2017,2018,2019,2020,2021,2022]
  const dataMeters = {
    labels: labels,
    datasets: [
      {
        label: 'Gas',
        data: postcodeLocationData['gm'],
        backgroundColor: '#00000',
        stack: 'Stack 0',
      },
      {
        label: 'Electric (all)',
        data: postcodeLocationData['ema'],
        backgroundColor: '#00000',
        stack: 'Stack 1',
      },
      {
        label: 'Electric (Standard)',
        data: postcodeLocationData['ems'],
        backgroundColor: '#00000',
        stack: 'Stack 2',
      },
      {
        label: 'Electric (Economy 7)',
        data: postcodeLocationData['eme'],
        backgroundColor: '#00000',
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
          borderColor: '#00000',
          backgroundColor: '#00000',
        },
        {
          label: 'Electricity',
          data: data_emissions_elec,
          borderColor: '#00000',
          backgroundColor: '#00000',
        }
      ]
    };
	
	const dataElectricity = {
    labels: labels,
      datasets: [
        {
          label: 'All meters',
          data: data_elec_all,
          borderColor: '#00000',
          backgroundColor: '#00000',
        },
        {
          label: 'Standard Meters',
          data: data_elec_std,
          borderColor: '#00000',
          backgroundColor: '#00000',
        },
        {
          label: 'Economy 7 Meters',
          data: data_elec_eco7,
          borderColor: '#00000',
          backgroundColor: '#00000',
        }
      ]
    };
	
	
	var metersctx = document.getElementById('meters-chart').getContext('2d');
	metersChart = new Chart(metersctx, {
    type: 'bar',
      data: dataMeters,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Gas and Electricity Meters'
          },
        },
        responsive: true,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
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
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Emissions'
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
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Emissions'
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
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Emissions'
        }
      }
    },
  });
  
}





