// Local Chart Mangement
var accessChart;

manageCharts =  function (chartDefinition, locationData){
  console.log("Managing Charts");
  makeChartAccess(locationData);
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
            text: 'Accessability by public transport'
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


