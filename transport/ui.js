// Local Chart Mangement
var accessChart;
var frequencyChart;
var accessLocationData = {};
var frequencyLocationData = {};


manageCharts = function (locationId) {
    capUi.fetchJSON('https://pbcc.blob.core.windows.net/pbcc-data/Access/' + locationId + '.json')
        .then(function (accessData) {
            accessLocationData = accessData;
            makeChartAccess();
            makeTableAccess();
        })
        .catch(function (error) {
            alert('Failed to get access data for this location, or to process it correctly. Please try refreshing the page.');
            console.log(error);
        });
        
    capUi.fetchJSON('https://pbcc.blob.core.windows.net/pbcc-data/PTfrequency/' + locationId + '.json')
        .then(function (frequencyData) {
            frequencyLocationData = frequencyData;
            //console.log(frequencyLocationData);
            makeChartFrequency();
        })
        .catch(function (error) {
            alert('Failed to get frequnecy data for this location, or to process it correctly. Please try refreshing the page.');
            console.log(error);
        });
};






makeChartAccess = function(){
  
  // Access Chart
  // Destroy old chart
	if(accessChart){
		accessChart.destroy();
	}
  
  // Get data muliple datasets for each category
  
  
  const category = accessLocationData["c"];
  const datax = accessLocationData["p60"];
	const datay = accessLocationData["a60"];
	const labels = accessLocationData["Bc"];
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
            text: 'Accessibility by public transport'
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


makeTableAccess = function(){
  
    const tab = document.getElementById('access-table');
    tab.innerHTML = ''
    
    const labels = accessLocationData["Bc"];
    const category = accessLocationData["c"];
    const access_15 = accessLocationData["a15"];
    const access_30 = accessLocationData["a30"];
    const access_45 = accessLocationData["a45"];
    const access_60 = accessLocationData["a60"];
    const proximity_15 = accessLocationData["p15"];
    const proximity_30 = accessLocationData["p30"];
    const proximity_45 = accessLocationData["p45"];
    const proximity_60 = accessLocationData["p60"];
  

// Group data by category
const groupedData = {};
for (let i = 0; i < labels.length; i++) {
    const group = category[i];
    if (!groupedData[group]) {
        groupedData[group] = [];
    }
    groupedData[group].push(i);
}

// Create tables for each group
for (const group in groupedData) {
    const groupIndices = groupedData[group];
    const groupTable = document.createElement('table');
    groupTable.innerHTML = `
        <tr>
            <th colspan="9">${group}</th>
        </tr>
        <tr>
            <th>Type</th>
            <th style="width:42px;">15<br>min</th>
            <th style="width:42px;">30<br>min</th>
            <th style="width:42px;">45<br>min</th>
            <th style="width:42px;">60<br>min</th>
            <th style="width:42px;">0.75<br>mile</th>
            <th style="width:42px;">1.5<br>mile</th>
            <th style="width:42px;">2.25<br>mile</th>
            <th style="width:42px;">3<br>mile</th>
        </tr>
        ${groupIndices.map(i => `
            <tr>
                <td>${labels[i]}</td>
                <td>${access_15[i]}</td>
                <td>${access_30[i]}</td>
                <td>${access_45[i]}</td>
                <td>${access_60[i]}</td>
                <td>${proximity_15[i]}</td>
                <td>${proximity_30[i]}</td>
                <td>${proximity_45[i]}</td>
                <td>${proximity_60[i]}</td>
            </tr>
        `).join('')}
    `;
    tab.appendChild(groupTable);
}

const cells = tab.getElementsByTagName('td');

  for (let cell of cells) {
    const value = parseFloat(cell.textContent);
    if (value == -3) {
      cell.classList.add('insufficient');
      cell.textContent = 'Insf'
    } else if (value < -1.5) {
      cell.classList.add('very-poor');
    } else if (value < -1 & value >= -1.5 ) {
      cell.classList.add('poor');
    } else if (value < -0.3 & value >= -1 ) {
      cell.classList.add('below-average');
    } else if (value < 0.3 & value >= -0.3 ) {
      cell.classList.add('average');
    } else if (value < 1 & value >= 0.3 ) {
      cell.classList.add('above-average');
    } else if (value < 1.5 & value >= 1 ) {
      cell.classList.add('good');
    } else if (value > 1.5) {
      cell.classList.add('very-good');
    }
  }
  
  
  
}

makeChartFrequency = function(){
  
  // Access Chart
  // Destroy old chart
	if(frequencyChart){
		frequencyChart.destroy();
	}
	
	md = document.getElementById("select_mode").value;
	day = document.getElementById("select_day").value;
  
  // Get data muliple datasets for each category
  
  
  const MorningPeak = frequencyLocationData[day + '_MorningPeak_' + md];
  const Midday = frequencyLocationData[day + '_Midday_' + md];
	const AfternoonPeak = frequencyLocationData[day + '_AfternoonPeak_' + md];
	const Evening = frequencyLocationData[day + '_Evening_' + md];
	const Night = frequencyLocationData[day + '_Night_' + md];
	const years = frequencyLocationData['year']
	
	//console.log(MorningPeak);
	
	var freqencyctx = document.getElementById('frequency-chart').getContext('2d');
	frequencyChart = new Chart(freqencyctx, {
		type: 'line',
		data: {
			labels: years,
			datasets: [{
				label: 'Morning Peak',
				data: MorningPeak,
				backgroundColor: 'rgba(232,243,83, 0.8)',
				borderColor: 'rgba(232,243,83, 1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Midday',
				data: Midday,
				backgroundColor: 'rgba(228,125,27, 0.8)',
				borderColor: 'rgba(228,125,27, 1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Afternoon Peak',
				data: AfternoonPeak,
				backgroundColor: 'rgba(230,25,124, 0.8)',
				borderColor: 'rgba(230,25,124, 1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Evening',
				data: Evening,
				backgroundColor: 'rgba(174,44,211, 0.8)',
				borderColor: 'rgba(174,44,211, 1)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Night',
				data: Night,
				backgroundColor: 'rgba(0,0,0, 0.8)',
				borderColor: 'rgba(0,0,0, 1)',
				borderWidth: 1,
				order: 1
			}

			]
		},
		options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
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