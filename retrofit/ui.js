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
    const p = capUi.fetchJSON('https://pbcc.blob.core.windows.net/pbcc-data/epc_dom/' + locationId + '.json')
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
  lsoaLocationData.eA,
  lsoaLocationData.eB,
  lsoaLocationData.eC,
  lsoaLocationData.eD,
  lsoaLocationData.eE,
  lsoaLocationData.eF,
  lsoaLocationData.eG,
  lsoaLocationData.eo,
  ];
 
	epcratingChart = makePieChart(epcratingChart,'epcrating-chart','EPC rating',
  epcratingData,
  ['#0e7e58','#2aa45b','#8cbc42','#f6cc15','#f2a867','#f17e23','#e31d3e','#333333'],
  ['A','B','C','D','E','F','G','Other']);
  
  // Building type
  
  buildingtypeData = [
  lsoaLocationData.thd,
  lsoaLocationData.ths,
  lsoaLocationData.thm,
  lsoaLocationData.the,
  lsoaLocationData.tf,
  lsoaLocationData.tbd,
  lsoaLocationData.tbs,
  lsoaLocationData.tbm,
  lsoaLocationData.tbe,
  lsoaLocationData.tm,
  lsoaLocationData.tp,
  lsoaLocationData.Bto,
  ];
 
	buildingtypeChart = makePieChart(buildingtypeChart,'buildingtype-chart','Building type',
  buildingtypeData,
  ['#c2e699','#78c679','#31a354','#006837','#e31a1c','#fbb4b9','#7a0177','#f768a1','#c51b8a','#1f78b4','#fa7c00','#c0c0c0'],
  ['Detached house','Semi-detached house','Mid-terrace house','End-terrace house',
			'Flat','Detached bungalow','Semi-detached bungalow','Mid-terrace bungalow',
			'End-terrace bungalow','Maisonette','Park home','Other']);
	
  // Tenure type
  
  tenureData = [
  lsoaLocationData.to,
  lsoaLocationData.Btp,
  lsoaLocationData.ts,
  lsoaLocationData.tu
  ];
 
  tenureChart = makePieChart(tenureChart,'tenure-chart','Tenure',
  tenureData,
  ['#c2e699','#78c679','#31a354','#c0c0c0'],
  ['Owner','Private rent','Social rent','Unknown']);
  
  // Age

  ageData = [
  lsoaLocationData.ap,
  lsoaLocationData.a19001929,
  lsoaLocationData.a19301949,
  lsoaLocationData.a19501966,
  lsoaLocationData.a19671975,
  lsoaLocationData.a19761982,
  lsoaLocationData.a19831990,
  lsoaLocationData.a19911995,
  lsoaLocationData.a19962002,
  lsoaLocationData.a20032006,
  lsoaLocationData.Bap,
  lsoaLocationData.au,
  ];
 
  ageChart = makePieChart(ageChart,'age-chart','Building Age',
  ageData,
  ['#9e0142','#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2','#934fa2','#c0c0c0'],
  ['pre-1900','1900-1929','1930-1949','1950-1966','1967-1975','1976-1982',
  '1983-1990','1991-1995','1996-2002','2003-2006','post-2012','Unknown']);
  
  
  // floor
  // TODO: Data looks wrong
  
  floorData = [
    lsoaLocationData.fv,
    lsoaLocationData.fg,
    lsoaLocationData.fa,
    lsoaLocationData.fp,
    lsoaLocationData.Bfv,
    lsoaLocationData.fb,
    lsoaLocationData.fo,
  ];
 
  floorChart = makePieChart(floorChart,'floor-chart','',
  floorData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#8b21b5','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Dwelling Below','Other']);
  
  // floord
  
  floordData = [
    lsoaLocationData.fs,
    lsoaLocationData.Bfs,
    lsoaLocationData.Cfs,
    lsoaLocationData.Dfs,
    lsoaLocationData.Efs,
    lsoaLocationData.Ffs,
    lsoaLocationData.Bfb,
    lsoaLocationData.Bfo
  ];
 
  floordChart = makePieChart(floordChart,'floord-chart','',
  floordData,
  ['#b2e2e2','#66c2a4','#238b45','#fde0ef', '#e9a3c9', '#c51b7d','#225ea8','#c0c0c0'],
  ['Solid uninsulated','Solid insulated','Solid limited insulation','Suspended uninsulated','Suspended insualted','Suspended limited insulation','Dwelling Below','Other']);
  
  // window
  
  windowData = [
    lsoaLocationData.wv,
    lsoaLocationData.wg,
    lsoaLocationData.wa,
    lsoaLocationData.wp,
    lsoaLocationData.Bwv,
    lsoaLocationData.wo
  ];
 
  windowChart = makePieChart(windowChart,'window-chart','',
  windowData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Other']);
  
  // water
  
  waterData = [
    lsoaLocationData.Cwv,
    lsoaLocationData.Bwg,
    lsoaLocationData.Bwa,
    lsoaLocationData.Bwp,
    lsoaLocationData.Dwv,
    lsoaLocationData.Bwo,

  ];
 
  waterChart = makePieChart(waterChart,'water-chart','',
  waterData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Other']);
  
  // waterd
  
  waterdData = [
    lsoaLocationData.wm,
    lsoaLocationData.wi,
    lsoaLocationData.wc,
    lsoaLocationData.Bwi,
    lsoaLocationData.Cwg,
    lsoaLocationData.Dwo
  ];
 
  waterdChart = makePieChart(waterdChart,'waterd-chart','',
  waterdData,
  ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ffff33','#c0c0c0'],
  ['Main system','Immersion heater','Community system','Instantaneous water heater','Gas multipoint','Other']);
  
  // glazing
  
  glazingData = [
    lsoaLocationData.gs,
    lsoaLocationData.gd,
    lsoaLocationData.gt,
    lsoaLocationData.Bgs,
    lsoaLocationData.gu
  ];
 
  glazingChart = makePieChart(glazingChart,'glazing-chart','',
  glazingData,
  ['#e41a1c','#377eb8','#4daf4a','#984ea3','#c0c0c0'],
  ['single','double','triple','secondary','unknown']);
  
  // wall
  
  wallData = [
    lsoaLocationData.Ewv,
    lsoaLocationData.Dwg,
    lsoaLocationData.Cwa,
    lsoaLocationData.Cwp,
    lsoaLocationData.Fwv,
    lsoaLocationData.Cwo

  ];
 
  wallChart = makePieChart(wallChart,'wall-chart','',
  wallData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Other']);
  
  // walld
  
  walldData = [
    lsoaLocationData.Bwc,
    lsoaLocationData.ws,
    lsoaLocationData.wt,
    lsoaLocationData.Bws,
    lsoaLocationData.Ewg,
    lsoaLocationData.Cws,
    lsoaLocationData.Ewo
  ];
 
  walldChart = makePieChart(walldChart,'walld-chart','',
  walldData,
  ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#c0c0c0'],
  ['Cavity','Solid','Timber','Sand/limestone','Granite/whinstine','System built','Other']);
  
  // roof
  
  roofData = [
    lsoaLocationData.rv,
    lsoaLocationData.rg,
    lsoaLocationData.ra,
    lsoaLocationData.rp,
    lsoaLocationData.Brv,
    lsoaLocationData.Bra,
    lsoaLocationData.ro

  ];
 
  roofChart = makePieChart(roofChart,'roof-chart','',
  roofData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#8b21b5','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Dwelling Above','Other']);
  
  // roofd
  
  roofdData = [
    lsoaLocationData.Brp,
    lsoaLocationData.rf,
    lsoaLocationData.rr,
    lsoaLocationData.rt,
    lsoaLocationData.Cra,
    lsoaLocationData.Bro
  ];
 
  roofdChart = makePieChart(roofdChart,'roofd-chart','',
  roofdData,
  ['#e41a1c','#377eb8','#4daf4a','#ffff33','#8b21b5','#c0c0c0'],
  ['Pitched','Flat roof','Room in roof','Thatched','Dwelling Above','Other']);
  
  // mainheatdesc
  
  mainheatdescData = [
    lsoaLocationData.Bmg,
    lsoaLocationData.Bmo,
    lsoaLocationData.ms,
    lsoaLocationData.Bmp,
    lsoaLocationData.mr,
    lsoaLocationData.mh,
    lsoaLocationData.mc,
    lsoaLocationData.Emo
  ];
 
  mainheatdescChart = makePieChart(mainheatdescChart,'mainheatdesc-chart','',
  mainheatdescData,
  ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#c0c0c0'],
  ['Gas boiler','Oil boiler','Storage heater','Portable heater','Room heaters','Heat pump','Community','Other']);
  
  // mainheat
  
  mainheatData = [
    lsoaLocationData.mv,
    lsoaLocationData.mg,
    lsoaLocationData.ma,
    lsoaLocationData.mp,
    lsoaLocationData.Bmv,
    lsoaLocationData.mo

  ];
 
  mainheatChart = makePieChart(mainheatChart,'mainheat-chart','',
  roofdData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Other']);
  
  
  // mainfuel
  
  mainfuelData = [
    lsoaLocationData.mm,
    lsoaLocationData.me,
    lsoaLocationData.Cmo,
    lsoaLocationData.Bmc,
    lsoaLocationData.ml,
    lsoaLocationData.mb,
    lsoaLocationData.md
  ];
 
  mainfuelChart = makePieChart(mainfuelChart,'mainfuel-chart','',
  mainfuelData,
  ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628'],
  ['Mains gas','Electric','Oil','Coal','LPG','Biomass','Dual fuel']);
  
  // mainheatcontrol
  
  mainheatcontrolData = [
    lsoaLocationData.Cmv,
    lsoaLocationData.Cmg,
    lsoaLocationData.Bma,
    lsoaLocationData.Cmp,
    lsoaLocationData.Dmv,
    lsoaLocationData.Dmo

  ];
 
  mainheatcontrolChart = makePieChart(mainheatcontrolChart,'mainheatcontrol-chart','',
  mainheatcontrolData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Other']);
  
  // controld
  
  controldData = [
    lsoaLocationData.cp,
    lsoaLocationData.Bcp,
    lsoaLocationData.Ccp,
    lsoaLocationData.Dcp,
    lsoaLocationData.co
  ];
 
  controldChart = makePieChart(controldChart,'controld-chart','',
  controldData,
  ['#e41a1c','#377eb8','#4daf4a','#984ea3','#c0c0c0'],
  ['progammer, thermostats & trvs','progammer, thermostats','progammer,trvs & bypass','zones','Other']);
  
  // light
  
  lightData = [
    lsoaLocationData.lv,
    lsoaLocationData.lg,
    lsoaLocationData.la,
    lsoaLocationData.lp,
    lsoaLocationData.Blv,
    lsoaLocationData.lo
  ];
 
  lightChart = makePieChart(lightChart,'light-chart','',
  lightData,
  ['#2c7bb6','#abd9e9','#ffffbf','#fdae61','#d7191c','#c0c0c0'],
  ['Very Good','Good','Average','Poor','Very Poor','Other']);
  
  // solarpv
  
  solarpvData = [
    lsoaLocationData.sy,
    lsoaLocationData.sn
  ];
 
  solarpvChart = makePieChart(solarpvChart,'solarpv-chart','',
  solarpvData,
  ['#2c7bb6','#d7191c'],
  ['Yes','No']);
  
  // solarthermal
  
  solarthermalData = [
    lsoaLocationData.Bsy,
    lsoaLocationData.Bsn
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
