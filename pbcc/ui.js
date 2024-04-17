// Local Chart Mangement
var overviewChart;

manageCharts =  function (chartDefinition, locationData){
  console.log("Managing Charts");
  makeChartOverview(chartDefinition, locationData[0]);
}

makeChartOverview = function(chartDefinition, locationData){
  
  // overview Chart
  // Destroy old chart
	if(overviewChart){
		overviewChart.destroy();
	}
  
  console.log(chartDefinition.component[0]);
  console.log(chartDefinition.years[0]);
  
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
  console.log(data);
              
  
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


