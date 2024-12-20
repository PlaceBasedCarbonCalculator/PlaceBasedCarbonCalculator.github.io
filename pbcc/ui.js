// Local Chart Mangement
var overviewChart;
var historicalChart;
var plefIgnoreChart;
var plefSteerChart;
var plefShiftChart;
var plefTransformChart;
var locationData = {};
var voa2020LocationData = {};
var voa2010LocationData = {};
var communityPicLocationData = {};

var dwellingsctChart;
var dwellingstypeChart;
var dwellingsbedroomsChart;
var dwellingsageChart;

manageCharts =  function (locationId){
  console.log("Managing Charts");
  
  capUi.fetchJSON('https://pbcc.blob.core.windows.net/pbcc-data/LSOA/' + locationId + '.json')
        .then(function (lsoaData) {
            locationData = lsoaData[0];
            makeChartHistorical();
            makeChartPLEF();
            maketableOverview();
        })
        .catch(function (error) {
            alert('Failed to get access data for this location, or to process it correctly. Please try refreshing the page.');
            console.log(error);
        });
        
    capUi.fetchJSON('https://pbcc.blob.core.windows.net/pbcc-data/voa_2010/' + locationId + '.json')
        .then(function (lsoaData) {
            voa2010LocationData = lsoaData;
            makeChartVOA2010();
        })
        .catch(function (error) {
            alert('Failed to get VOA 2010 data for this location, or to process it correctly. Please try refreshing the page.');
            console.log(error);
        });
        
    capUi.fetchJSON('https://pbcc.blob.core.windows.net/pbcc-data/voa_2020/' + locationId + '.json')
        .then(function (lsoaData) {
            voa2020LocationData = lsoaData;
            makeChartVOA2020();
        })
        .catch(function (error) {
            alert('Failed to get VOA 2020 data for this location, or to process it correctly. Please try refreshing the page.');
            console.log(error);
        });
  
  
    capUi.fetchJSON('https://pbcc.blob.core.windows.net/pbcc-data/community_photo/' + locationId + '.json')
        .then(function (lsoaData) {
            communityPicLocationData = lsoaData;
            makeCommunityPic();
        })
        .catch(function (error) {
            alert('Failed to get Community Picture data for this location, or to process it correctly. Please try refreshing the page.');
            console.log(error);
        });
  
  //makeChartOverview(chartDefinition, locationData[0]);
 // makeChartPLEF(chartDefinition, locationData[0])
}



makeCommunityPic = function(){
  
  const names = communityPicLocationData["i"];
  const numbers = communityPicLocationData["p"];
  const repeatedNames = numbers.flatMap((num, index) => Array(num).fill(names[index]));
  
  repeatedNames.forEach((name, index) => {
      const img = document.getElementById(`ff${index}`);
      if (img) {
          img.src = `/images/ui/family_photos/${name}.webp`;
          img.setAttribute('title', `${name}`.replaceAll('_', ' '));
      }
  });
  
  
  console.log(repeatedNames);
}

maketableOverview = function(){
  //TODO: find other heating GRADE in data
  document.getElementById("data_total_emissions_percap").innerHTML = locationData.tkp2019;
  document.getElementById("data_elec_emissions_household").innerHTML = locationData.dekp2019;
  document.getElementById("data_gas_emissions_household").innerHTML = locationData.geep2019;
  document.getElementById("data_other_heating_emissions").innerHTML = locationData.hokp2019;
  document.getElementById("data_car_emissions").innerHTML = locationData.cep2019;
  document.getElementById("data_van_emissions").innerHTML = locationData.vep2019;
  document.getElementById("data_flights_emissions").innerHTML = locationData.efp2019;
  document.getElementById("data_consumption_emissions").innerHTML = locationData.gsckp2019;
  
	document.getElementById("data_total_emissions_grade").src = "/images/grades/" + locationData.tg2019 + ".webp";
	document.getElementById("data_total_emissions_grade").alt = "Grade " + locationData.tg2019;
	document.getElementById("data_elec_emissions_grade").src  = "/images/grades/" + locationData.deg2019 + ".webp";
	document.getElementById("data_elec_emissions_grade").alt = "Grade " + locationData.deg2019;
	document.getElementById("data_gas_emissions_grade").src   = "/images/grades/" + locationData.dgg2019 + ".webp";
	document.getElementById("data_gas_emissions_grade").alt = "Grade " + locationData.dgg2019;
	document.getElementById("data_other_heating_emissions_grade").src   = "/images/grades/" + locationData.other_heating_grade + ".webp";
	document.getElementById("data_other_heating_emissions_grade").alt = "Grade " + locationData.data_other_heating_emissions_grade;
	document.getElementById("data_car_emissions_grade").src   = "/images/grades/" + locationData.cg2019 + ".webp";
	document.getElementById("data_car_emissions_grade").alt = "Grade " + locationData.cg2019;
	document.getElementById("data_van_emissions_grade").src   = "/images/grades/" + locationData.vg2019 + ".webp";
	document.getElementById("data_van_emissions_grade").alt = "Grade " + locationData.vg2019;
	document.getElementById("data_flights_emissions_grade").src   = "/images/grades/" + locationData.fg2019 + ".webp";
	document.getElementById("data_flights_emissions_grade").alt = "Grade " + locationData.fg2019;
	document.getElementById("data_consumption_emissions_grade").src   = "/images/grades/" + locationData.gscg2019 + ".webp";
	document.getElementById("data_consumption_emissions_grade").alt = "Grade " + locationData.gscg2019;
}

makeChartOverview = function(){
  
  // overview Chart
  // Destroy old chart
	if(overviewChart){
		overviewChart.destroy();
	}
  
  // Create an object to store data for each category
  
  var component = [
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
		  ]
  
  
  var years =  ['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020']
  // Assemble the datasets to be shown
  
	const data = {datasets: []};
	/*
	  component.forEach(comp => {
		  console.log(years.map(year => locationData[comp[1] + year]))
	  });
  */
	component.forEach(comp => {
		data.datasets.push({
			label: comp[0],
			data: years.map(year => locationData[comp[1] + year]),
			backgroundColor: comp[2],
			borderColor: comp[3],
			borderWidth: 1
		});
	});

  //console.log(data);
  
  data.labels = ['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020'];
  
  var overviewctx = document.getElementById('overview-chart').getContext('2d');
	overviewChart = new Chart(overviewctx, {
    type: 'bar',
					data: data,
					options: {
						scales: {
							y: {
								stacked: true,
								title: {
									display: true,
									text: 'kgCO2e per person'
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


makeChartHistorical = function(){
  
  // overview Chart
  // Destroy old chart
	if(overviewChart){
		overviewChart.destroy();
	}
  
  //console.log(chartDefinition.component[0]);
  //console.log(chartDefinition.years[0]);
  
  //console.log(locationData);
  
  
  // Create an object to store data for each category
  
  var component = [
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
		  ]
  
  
  var years =  ['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020']
  // Assemble the datasets to be shown
  
	const data = {datasets: []};
	/*
	  component.forEach(comp => {
		  console.log(years.map(year => locationData[comp[1] + year]))
	  });
  */
	component.forEach(comp => {
		data.datasets.push({
			label: comp[0],
			data: years.map(year => locationData[comp[1] + year]),
			backgroundColor: comp[2],
			borderColor: comp[3],
			borderWidth: 1
		});
	});

  //console.log(data);
  
  data.labels = ['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020'];
  
  var overviewctx = document.getElementById('historical-chart').getContext('2d');
	overviewChart = new Chart(overviewctx, {
    type: 'bar',
					data: data,
					options: {
						scales: {
							y: {
								stacked: true,
								title: {
									display: true,
									text: 'kgCO2e per person'
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


makeChartVOA2010 = function(){
  
  // overview Chart
  // Destroy old chart
	if(dwellingsctChart){
		dwellingsctChart.destroy();
	}
  
  //console.log(voa2010LocationData);
 
	const years = voa2010LocationData['year'];	  
	const bA = voa2010LocationData['banda'];
  const bB = voa2010LocationData['bandb'];
  const bC = voa2010LocationData['bandc'];
  const bD = voa2010LocationData['bandd'];
  const bE = voa2010LocationData['bande'];
  const bF = voa2010LocationData['bandf'];
  const bG = voa2010LocationData['bandg'];
  const bH = voa2010LocationData['bandh'];
  const bI = voa2010LocationData['bandi'];
  
  
  var dwellingsctctx = document.getElementById('dwellingsct-chart').getContext('2d');
	dwellingsctChart = new Chart(dwellingsctctx, {
		type: 'bar',
		data: {
			labels: years,
			datasets: [{
				label: 'A',
				data: bA,
				backgroundColor: 'rgba(77,146,33, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'B',
				data: bB,
				backgroundColor: 'rgba(127,188,65, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'C',
				data: bC,
				backgroundColor: 'rgba(184,225,134, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'D',
				data: bD,
				backgroundColor: 'rgba(230,245,208, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'E',
				data: bE,
				backgroundColor: 'rgba(247,247,247, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'F',
				data: bF,
				backgroundColor: 'rgba(253,224,239, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'G',
				data: bG,
				backgroundColor: 'rgba(241,182,218, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'H',
				data: bH,
				backgroundColor: 'rgba(222,119,174, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'I',
				data: bI,
				backgroundColor: 'rgba(197,27,125, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
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


makeChartVOA2020 = function(){
  
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
  
	const years = voa2020LocationData['year'];	  

  var dwellingstypectx = document.getElementById('dwellingstype-chart').getContext('2d');
	dwellingstypeChart = new Chart(dwellingstypectx, {
		type: 'bar',
		data: {
			labels: years,
			datasets: [{
				label: 'Bungalow',
				data: voa2020LocationData['bungalow'],
				backgroundColor: 'rgba(105, 60, 153, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Flat/Maisonette',
				data: voa2020LocationData['flatmais'],
				backgroundColor: 'rgba(227, 26, 28, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Terraced',
				data: voa2020LocationData['terraced'],
				backgroundColor: 'rgba(17, 219, 13, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Semi-Detached',
				data: voa2020LocationData['semi'],
				backgroundColor: 'rgba(14, 156, 11, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Detached',
				data: voa2020LocationData['detached'],
				backgroundColor: 'rgba(8, 82, 7, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'Annexe',
				data: voa2020LocationData['annexe'],
				backgroundColor: 'rgba(31, 120, 180, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'Caravan/Boat/Mobile home',
				data: voa2020LocationData['caravanboatmobilehome'],
				backgroundColor: 'rgba(250, 124, 0, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'Unknown',
				data: voa2020LocationData['unknown'],
				backgroundColor: 'rgba(135, 136, 138, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
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
				data: voa2020LocationData['bed1'],
				backgroundColor: 'rgba(204,235,197, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '2',
				data: voa2020LocationData['bed2'],
				backgroundColor: 'rgba(168,221,181, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '3',
				data: voa2020LocationData['bed3'],
				backgroundColor: 'rgba(123,204,196, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '4',
				data: voa2020LocationData['bed4'],
				backgroundColor: 'rgba(78,179,211, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '5',
				data: voa2020LocationData['bed5'],
				backgroundColor: 'rgba(43,140,190, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
      {
				label: '6+',
				data: voa2020LocationData['bed6'],
				backgroundColor: 'rgba(8,88,158, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
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
				data: voa2020LocationData['bppre1900'],
				backgroundColor: 'rgba(158, 1, 66, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '1900-18',
				data: voa2020LocationData['bp19001918'],
				backgroundColor: 'rgba(213, 62, 79, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '1919-29',
				data: voa2020LocationData['bp19191929'],
				backgroundColor: 'rgba(244, 109, 67, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '1930-39',
				data: voa2020LocationData['bp19301939'],
				backgroundColor: 'rgba(244, 109, 67, 0.8)',
				borderColor: 'rgba(253, 174, 97)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '1945-54',
				data: voa2020LocationData['bp19451954'],
				backgroundColor: 'rgba(254,224,139, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
      {
				label: '1955-64',
				data: voa2020LocationData['bp19551964'],
				backgroundColor: 'rgba(255,255,191, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
      {
				label: '1965-72',
				data: voa2020LocationData['bp19651972'],
				backgroundColor: 'rgba(230,245,152, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
      {
				label: '1973-82',
				data: voa2020LocationData['bp19731982'],
				backgroundColor: 'rgba(171,221,164, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
      {
				label: '1983-92',
				data: voa2020LocationData['bp19831992'],
				backgroundColor: 'rgba(102,194,165, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},			
      {
				label: '1993-99',
				data: voa2020LocationData['bp19931999'],
				backgroundColor: 'rgba(50,136,189, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},			
      {
				label: '2000-08',
				data: voa2020LocationData['bp20002008'],
				backgroundColor: 'rgba(94,79,162, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},			
      {
				label: '2009-21',
				data: voa2020LocationData['bp20092021'],
				backgroundColor: 'rgba(144, 77, 159, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},			
      {
				label: '2022-24',
				data: voa2020LocationData['bp20222024'],
				backgroundColor: 'rgba(217, 22, 74, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'Unknown',
				data: voa2020LocationData['bpunkw'],
				backgroundColor: 'rgba(135, 136, 138, 0.8)',
				borderColor: 'rgba(0,0,0,1)',
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


makeChartPLEF = function(){
  
  // overview Chart
  // Destroy old chart
	if(plefIgnoreChart){
		plefIgnoreChart.destroy();
	}
	
	if(plefShiftChart){
		plefShiftChart.destroy();
	}
	
	if(plefSteerChart){
		plefSteerChart.destroy();
	}
	
	if(plefTransformChart){
		plefTransformChart.destroy();
	}
  
  //console.log(chartDefinition.component[0]);
  //console.log(chartDefinition.years[0]);
  
  //const plefdata = Object.keys(locationData).find(function(q){return /P/gi.test(q)});
  
  
  const dataIgnore = {
  labels: ["2020","2030","2040","2050"],
  datasets: [
    // Ignore - Grandfather
    {
      label: 'Residential',
      data: [locationData.Pr2020, locationData.Prgi2030, locationData.Prgi2040, locationData.Prgi2050],
      backgroundColor: '#6b4c89',
      stack: 'Stack 0',
    },
    {
      label: 'Transport',
      data: [locationData.Pt2020, locationData.Ptgi2030, locationData.Ptgi2040, locationData.Ptgi2050],
      backgroundColor: '#497bbe',
      stack: 'Stack 0',
    },
    {
      label: 'Agriculture',
      data: [locationData.Pa2020, locationData.Pagi2030, locationData.Pagi2040, locationData.Pagi2050],
      backgroundColor: '#39b6ad',
      stack: 'Stack 0',
    },
    {
      label: 'Industry',
      data: [locationData.Pi2020, locationData.Pigi2030, locationData.Pigi2040, locationData.Pigi2050],
      backgroundColor: '#4fbfd8',
      stack: 'Stack 0',
    },
    {
      label: 'Non-domestic',
      data: [locationData.Pn2020, locationData.Pngi2030, locationData.Pngi2040, locationData.Pngi2050],
      backgroundColor: '#aa3871',
      stack: 'Stack 0',
    },
    // Ignore - Equity
    {
      //label: 'Residential',
      data: [locationData.Pr2020, locationData.Prei2030, locationData.Prei2040, locationData.Prei2050],
      backgroundColor: '#6b4c89',
      stack: 'Stack 1',
    },
    {
      //label: 'Transport',
      data: [locationData.Pt2020, locationData.Ptei2030, locationData.Ptei2040, locationData.Ptei2050],
      backgroundColor: '#497bbe',
      stack: 'Stack 1',
    },
    {
      //label: 'Agriculture',
      data: [locationData.Pa2020, locationData.Paei2030, locationData.Paei2040, locationData.Paei2050],
      backgroundColor: '#39b6ad',
      stack: 'Stack 1',
    },
    {
      //label: 'Industry',
      data: [locationData.Pi2020, locationData.Piei2030, locationData.Piei2040, locationData.Piei2050],
      backgroundColor: '#4fbfd8',
      stack: 'Stack 1',
    },
    {
      //label: 'Non-domestic',
      data: [locationData.Pn2020, locationData.Pnei2030, locationData.Pnei2040, locationData.Pnei2050],
      backgroundColor: '#aa3871',
      stack: 'Stack 1',
    },
    
  ]
};
  
  
  const dataSteer = {
  labels: ["2020","2030","2040","2050"],
  datasets: [
    // Steer - Grandfather
    {
      label: 'Residential',
      data: [locationData.Pr2020, locationData.Prgs2030, locationData.Prgs2040, locationData.Prgs2050],
      backgroundColor: '#6b4c89',
      stack: 'Stack 0',
    },
    {
      label: 'Transport',
      data: [locationData.Pt2020, locationData.Ptgs2030, locationData.Ptgs2040, locationData.Ptgs2050],
      backgroundColor: '#497bbe',
      stack: 'Stack 0',
    },
    {
      label: 'Agriculture',
      data: [locationData.Pa2020, locationData.Pags2030, locationData.Pags2040, locationData.Pags2050],
      backgroundColor: '#39b6ad',
      stack: 'Stack 0',
    },
    {
      label: 'Industry',
      data: [locationData.Pi2020, locationData.Pigs2030, locationData.Pigs2040, locationData.Pigs2050],
      backgroundColor: '#4fbfd8',
      stack: 'Stack 0',
    },
    {
      label: 'Non-domestic',
      data: [locationData.Pn2020, locationData.Pngi2030, locationData.Pngs2040, locationData.Pngs2050],
      backgroundColor: '#aa3871',
      stack: 'Stack 0',
    },
    // Steer - Equity
    {
      //label: 'Residential',
      data: [locationData.Pr2020, locationData.Pres2030, locationData.Pres2040, locationData.Pres2050],
      backgroundColor: '#6b4c89',
      stack: 'Stack 1',
    },
    {
      //label: 'Transport',
      data: [locationData.Pt2020, locationData.Ptes2030, locationData.Ptes2040, locationData.Ptes2050],
      backgroundColor: '#497bbe',
      stack: 'Stack 1',
    },
    {
      //label: 'Agriculture',
      data: [locationData.Pa2020, locationData.Paes2030, locationData.Paes2040, locationData.Paes2050],
      backgroundColor: '#39b6ad',
      stack: 'Stack 1',
    },
    {
      //label: 'Industry',
      data: [locationData.Pi2020, locationData.Pies2030, locationData.Pies2040, locationData.Pies2050],
      backgroundColor: '#4fbfd8',
      stack: 'Stack 1',
    },
    {
      //label: 'Non-domestic',
      data: [locationData.Pn2020, locationData.Pnes2030, locationData.Pnes2040, locationData.Pnes2050],
      backgroundColor: '#aa3871',
      stack: 'Stack 1',
    },
    
  ]
};

  const dataShift = {
  labels: ["2020","2030","2040","2050"],
  datasets: [
    // Shift - Grandfather
    {
      label: 'Residential',
      data: [locationData.Pr2020, locationData.BPrgs2030, locationData.BPrgs2040, locationData.BPrgs2050],
      backgroundColor: '#6b4c89',
      stack: 'Stack 0',
    },
    {
      label: 'Transport',
      data: [locationData.Pt2020, locationData.BPtgs2030, locationData.BPtgs2040, locationData.BPtgs2050],
      backgroundColor: '#497bbe',
      stack: 'Stack 0',
    },
    {
      label: 'Agriculture',
      data: [locationData.Pa2020, locationData.BPags2030, locationData.BPags2040, locationData.BPags2050],
      backgroundColor: '#39b6ad',
      stack: 'Stack 0',
    },
    {
      label: 'Industry',
      data: [locationData.Ps2020, locationData.BPigs2030, locationData.BPigs2040, locationData.BPigs2050],
      backgroundColor: '#4fbfd8',
      stack: 'Stack 0',
    },
    {
      label: 'Non-domestic',
      data: [locationData.Pn2020, locationData.BPngs2030, locationData.BPngs2040, locationData.BPngs2050],
      backgroundColor: '#aa3871',
      stack: 'Stack 0',
    },
    // Shift - Equity
    {
      //label: 'Residential',
      data: [locationData.Pr2020, locationData.BPres2030, locationData.BPres2040, locationData.BPres2050],
      backgroundColor: '#6b4c89',
      stack: 'Stack 1',
    },
    {
      //label: 'Transport',
      data: [locationData.Pt2020, locationData.BPtes2030, locationData.BPtes2040, locationData.BPtes2050],
      backgroundColor: '#497bbe',
      stack: 'Stack 1',
    },
    {
      //label: 'Agriculture',
      data: [locationData.Pa2020, locationData.BPaes2030, locationData.BPaes2040, locationData.BPaes2050],
      backgroundColor: '#39b6ad',
      stack: 'Stack 1',
    },
    {
      //label: 'Industry',
      data: [locationData.Ps2020, locationData.BPies2030, locationData.BPies2040, locationData.BPies2050],
      backgroundColor: '#4fbfd8',
      stack: 'Stack 1',
    },
    {
      //label: 'Non-domestic',
      data: [locationData.Pn2020, locationData.Pnes2030, locationData.Pnes2040, locationData.Pnes2050],
      backgroundColor: '#aa3871',
      stack: 'Stack 1',
    },
    
  ]
};

  const dataTransform = {
  labels: ["2020","2030","2040","2050"],
  datasets: [
    // Transform - Grandfather
    {
      label: 'Residential',
      data: [locationData.Pr2020, locationData.Prgt2030, locationData.Prgt2040, locationData.Prgt2050],
      backgroundColor: '#6b4c89',
      stack: 'Stack 0',
    },
    {
      label: 'Transport',
      data: [locationData.Pt2020, locationData.Ptgt2030, locationData.Ptgt2040, locationData.Ptgt2050],
      backgroundColor: '#497bbe',
      stack: 'Stack 0',
    },
    {
      label: 'Agriculture',
      data: [locationData.Pa2020, locationData.Pagt2030, locationData.Pagt2040, locationData.Pagt2050],
      backgroundColor: '#39b6ad',
      stack: 'Stack 0',
    },
    {
      label: 'Industry',
      data: [locationData.Pt2020, locationData.Pigt2030, locationData.Pigt2040, locationData.Pigt2050],
      backgroundColor: '#4fbfd8',
      stack: 'Stack 0',
    },
    {
      label: 'Non-domestic',
      data: [locationData.Pn2020, locationData.Pngt2030, locationData.Pngt2040, locationData.Pngt2050],
      backgroundColor: '#aa3871',
      stack: 'Stack 0',
    },
    // Transform - Equity
    {
      //label: 'Residential',
      data: [locationData.Pr2020, locationData.Pret2030, locationData.Pret2040, locationData.Pret2050],
      backgroundColor: '#6b4c89',
      stack: 'Stack 1',
    },
    {
      //label: 'Transport',
      data: [locationData.Pt2020, locationData.Ptet2030, locationData.Ptet2040, locationData.Ptet2050],
      backgroundColor: '#497bbe',
      stack: 'Stack 1',
    },
    {
      //label: 'Agriculture',
      data: [locationData.Pa2020, locationData.Paet2030, locationData.Paet2040, locationData.Paet2050],
      backgroundColor: '#39b6ad',
      stack: 'Stack 1',
    },
    {
      //label: 'Industry',
      data: [locationData.Pt2020, locationData.Piet2030, locationData.Piet2040, locationData.Piet2050],
      backgroundColor: '#4fbfd8',
      stack: 'Stack 1',
    },
    {
     //label: 'Non-domestic',
      data: [locationData.Pn2020, locationData.Pnet2030, locationData.Pnet2040, locationData.Pnet2050],
      backgroundColor: '#aa3871',
      stack: 'Stack 1',
    },
    
  ]
};
  
  
  var ctxIgnore = document.getElementById('plefIgnore-chart').getContext('2d');
	plefIgnoreChart = new Chart(ctxIgnore, {
    type: 'bar',
					data: dataIgnore,
					
					options: {
					  plugins : {
					    legend: {
                display: true,
                labels: {
                    filter: function (legendItem, chartData) {
                        return (chartData.datasets[legendItem.datasetIndex].label)
                    },
                }
              }
					  },
						scales: {
							y: {
								stacked: true,
								title: {
									display: true,
									text: 'kgCO2e per person'
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
	
	var ctxShift = document.getElementById('plefShift-chart').getContext('2d');
	plefShiftChart = new Chart(ctxShift, {
    type: 'bar',
					data: dataShift,
					options: {
					  plugins : {
					    legend: {
                display: true,
                labels: {
                    filter: function (legendItem, chartData) {
                        return (chartData.datasets[legendItem.datasetIndex].label)
                    },
                }
              }
					  },
						scales: {
							y: {
								stacked: true,
								title: {
									display: true,
									text: 'kgCO2e per person'
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
  
  var ctxSteer = document.getElementById('plefSteer-chart').getContext('2d');
	plefSteerChart = new Chart(ctxSteer, {
    type: 'bar',
					data: dataSteer,
					options: {
					  plugins : {
					    legend: {
                display: true,
                labels: {
                    filter: function (legendItem, chartData) {
                        return (chartData.datasets[legendItem.datasetIndex].label)
                    },
                }
              }
					  },
						scales: {
							y: {
								stacked: true,
								title: {
									display: true,
									text: 'kgCO2e per person'
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
  
  var ctxTransform = document.getElementById('plefTransform-chart').getContext('2d');
	plefTransformChart = new Chart(ctxTransform, {
    type: 'bar',
					data: dataTransform,
					options: {
					  plugins : {
					    legend: {
                display: true,
                labels: {
                    filter: function (legendItem, chartData) {
                        return (chartData.datasets[legendItem.datasetIndex].label)
                    },
                }
              }
					  },
						scales: {
							y: {
								stacked: true,
								title: {
									display: true,
									text: 'kgCO2e per person'
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

