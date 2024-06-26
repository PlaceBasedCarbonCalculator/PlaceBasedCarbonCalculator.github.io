// Local Chart Mangement
var accessChart;

manageCharts =  function (chartDefinition, locationData){
  console.log("Managing Charts");
  makeChartAccess(locationData);
  makeTableAccess(locationData);
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


makeTableAccess = function(locationData){
  
  var tab = document.getElementById('access-table')
  
  const labels = locationData["Bc"];
  
  const access_15 = locationData["a15"];
  const access_30 = locationData["a30"];
  const access_45 = locationData["a45"];
  const access_60 = locationData["a60"];
  
  const proximity_15 = locationData["p15"];
  const proximity_30 = locationData["p30"];
  const proximity_45 = locationData["p45"];
  const proximity_60 = locationData["p60"];
  
  
	// Create an object to store data for each category
  const htmltext = {};
  for (let i = 0; i < labels.length; i++) {
    htmltext[i] = '<tr>' +
                  '<td>' + labels[i] + '</td>' +
                  '<td>' + access_15[i] + '</td><td>' + access_30[i] + '</td><td>' + access_45[i] + '</td><td>' + access_60[i] + '</td><td>' +
                           proximity_15[i] + '</td><td>' + proximity_30[i] + '</td><td>' + proximity_45[i] + '</td><td>' + proximity_60[i] + '</td>' +
                  '</tr>';
                  
  }
  
  
  tab.innerHTML = '<table><tr><th>Type</th><th>15 min</th><th>30 min</th><th>45 min</th><th>60 min</th><th>5 mile</th><th>10 mile</th><th>15 mile</th><th>20 mile</th></tr>' +
   Object.values(htmltext).join('') +
  '</table>';
  
  const cells = tab.getElementsByTagName('td');

  for (let cell of cells) {
    const value = parseFloat(cell.textContent);
    if (value < -2) {
      cell.classList.add('very-poor');
    } else if (value > 2) {
      cell.classList.add('very-good');
    } else if (value < -1 & value >= -2 ) {
      cell.classList.add('poor');
    } else if (value < -0.5 & value >= -1 ) {
      cell.classList.add('below-average');
    } else if (value < 0.5 & value >= -0.5 ) {
      cell.classList.add('average');
    } else if (value < 1 & value >= 0.5 ) {
      cell.classList.add('above-average');
    } else if (value < 2 & value >= 1 ) {
      cell.classList.add('good');
    }
  }
  
  
  
}