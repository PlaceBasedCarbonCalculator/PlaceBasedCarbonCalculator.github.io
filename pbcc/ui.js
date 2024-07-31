// Local Chart Mangement
var overviewChart;
var plefIgnoreChart;
var plefSteerChart;
var plefShiftChart;
var plefTransformChart;

manageCharts =  function (chartDefinition, locationData){
  console.log("Managing Charts");
  makeChartOverview(chartDefinition, locationData[0]);
  makeChartPLEF(chartDefinition, locationData[0])
}

makeChartOverview = function(chartDefinition, locationData){
  
  // overview Chart
  // Destroy old chart
	if(overviewChart){
		overviewChart.destroy();
	}
  
  //console.log(chartDefinition.component[0]);
  //console.log(chartDefinition.years[0]);
  
  // Assemble the datasets to be shown
	const data = {datasets: []};
	
	chartDefinition.component.forEach(component => {
		data.datasets.push({
			label: component[0],
			data: chartDefinition.years.map(years => locationData[component[1] + years[0]]),
			backgroundColor: component[2],
			borderColor: component[3],
			borderWidth: 1
		});
	});
  
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

makeChartPLEF = function(chartDefinition, locationData){
  
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

