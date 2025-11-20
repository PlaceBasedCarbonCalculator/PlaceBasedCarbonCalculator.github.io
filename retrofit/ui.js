// Local Chart Mangement
var emissionsChart;
var gasChart;
var electricityChart;
var metersChart;

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

var postcodeLocationData = {};
var lsoaLocationData = {};

manageCharts =  function (locationId, mapLayerId){
  if(mapLayerId == 'zones'){
    const p = capUi.fetchJSON('https://pbcc.blob.core.windows.net/pbcc-data/epc_dom/v2/' + locationId + '.json')
        .then(function (lsoaData) {
            lsoaLocationData = lsoaData[0];
            makeChartLSOA();
        })
        .catch(function (error) {
            alert('Failed to get access data for this location, or to process it correctly. Please try refreshing the page.');
            console.log(error);
        });

    return p;
  } else if (mapLayerId == 'postcodes'){
    const p = capUi.fetchJSON('https://pbcc.blob.core.windows.net/pbcc-data/Postcode/' + locationId + '.json')
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
  lsoaLocationData.epc_o,
  ];
 
	epcratingChart = makePieChart(epcratingChart,'epcrating-chart','EPC rating',
  epcratingData,
  ['#0e7e58','#2aa45b','#8cbc42','#f6cc15','#f2a867','#f17e23','#e31d3e','#333333'],
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
  ['#c2e699','#78c679','#31a354','#006837','#e31a1c','#fbb4b9','#7a0177','#f768a1','#c51b8a','#1f78b4','#fa7c00','#c0c0c0'],
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
  ['#c2e699','#78c679','#31a354','#c0c0c0'],
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
  lsoaLocationData.age_post2012,
  lsoaLocationData.age_unknown,
  ];
 
  ageChart = makePieChart(ageChart,'age-chart','Building Age',
  ageData,
  ['#9e0142','#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2','#934fa2','#c0c0c0'],
  ['pre-1900','1900-1929','1930-1949','1950-1966','1967-1975','1976-1982',
  '1983-1990','1991-1995','1996-2002','2003-2006','post-2012','Unknown']);
  
  
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
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#8b21b5','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Dwelling Below','Other']);
  
  // floord
  
  floordData = [
    lsoaLocationData.floord_soliduninsulated,
    lsoaLocationData.floord_solidinsulated,
    lsoaLocationData.floord_solidlimitedinsulated,
    lsoaLocationData.floord_suspendeduninsulated,
    lsoaLocationData.floord_suspendedinsualted,
    lsoaLocationData.floord_suspendedlimitedinsulated,
    lsoaLocationData.floord_below,
    lsoaLocationData.floor_other
  ];
 
  floordChart = makePieChart(floordChart,'floord-chart','',
  floordData,
  ['#b2e2e2','#66c2a4','#238b45','#fde0ef', '#e9a3c9', '#c51b7d','#225ea8','#c0c0c0'],
  ['Solid uninsulated','Solid insulated','Solid limited insulation','Suspended uninsulated','Suspended insualted','Suspended limited insulation','Dwelling Below','Other']);
  
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
    lsoaLocationData.walld_other
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
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#8b21b5','#c0c0c0'],
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
  ['#e41a1c','#377eb8','#4daf4a','#ffff33','#8b21b5','#c0c0c0'],
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
  ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#c0c0c0'],
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
  roofdData,
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
    lsoaLocationData.mainfuel_dualfuel
  ];
 
  mainfuelChart = makePieChart(mainfuelChart,'mainfuel-chart','',
  mainfuelData,
  ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628'],
  ['Mains gas','Electric','Oil','Coal','LPG','Biomass','Dual fuel']);
  
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
