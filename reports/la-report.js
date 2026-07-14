// Local Chart Mangement
var overviewChart;
var historicalChart;

var consumptionFoodChart;
var consumptionAlcoholChart;
var consumptionFurnishingsChart;
var consumptionOtherHousingChart;
var consumptionClothingChart;
var consumptionCommunicationChart;
var consumptionRecreationChart;
var consumptionRestaurantsChart;
var consumptionHealthChart;
var consumptionEducationChart;
var consumptionMiscellaneousChart;
var consumptionFlightsChart;
var consumptionVehiclePurchaseChart;
var consumptionVehicleOtherChart;
var consumptionTotalChart;

var gasChart;
var electricChart;
var carEmissionsChart;
var vanEmissionsChart;
var bikeCompanyChart;
var publicTransportChart;

var otherHeatingChart;
var otherHousingChart;

var populationChart;

var locationData = {};
var voa2020LocationData = {};
var voa2010LocationData = {};
var communityPicLocationData = {};
var populationLocationData = {};
var lsoaOverviewData = {};
var laHistoricalData = {};
var oacHistoricalData = {};
var gbHistoricalData = {};

var dwellingsctChart;
var dwellingstypeChart;
var dwellingsbedroomsChart;
var dwellingsageChart;

manageChartsLA = function (locationId) {
	console.log('Managing Charts LA');

	// Primary chained requests that feed multiple charts.
	// The area-level data path is configurable per report page via
	// window.REPORT_CONFIG.dataPath (e.g. 'ward_emissions/v1/'); it defaults to
	// the local authority path so the existing LA report keeps working unchanged.
	// The GB comparison row is always taken from la_emissions (national per-capita
	// figures are identical regardless of the area type being reported).
	const reportBase = 'https://pbcc.blob.core.windows.net/pbcc-data/';
	const levelPath = (window.REPORT_CONFIG && window.REPORT_CONFIG.dataPath) || 'la_emissions/v2/';
	const urlsPrimary = [
		reportBase + levelPath + locationId + '.json',
        reportBase + 'la_emissions/v2/GB.json'
	];

	const primary = Promise.all(urlsPrimary.map(capUi.fetchJSON))
		.then(([laData,GBData]) => {
			laHistoricalData = laData;
            gbHistoricalData = GBData;
	
			makeChartHistorical();
			makeChartPopulation();
			lsoaCharacteristicsTable(lsoaOverviewData);
		})
		.catch(error => {
			console.error('Failed to load primary pbcc datasets:', error);
		});

	//const pCommunity = capUi.fetchJSON('https://pbcc.blob.core.windows.net/pbcc-data/community_photo/v1/' + locationId + '.json')
	//	.then(data => { communityPicLocationData = data; makeCommunityPic(); })
	//	.catch(err => { console.error('Community photo failed:', err); });

    return Promise.all([primary ]); //pCommunity
};

makeCommunityPic = function(){
  
  const names = communityPicLocationData["id"];
  const numbers = communityPicLocationData["pic"];
  const repeatedNames = numbers.flatMap((num, index) => Array(num).fill(names[index]));
  
  repeatedNames.forEach((name, index) => {
      const img = document.getElementById(`ff${index}`);
      if (img) {
          img.src = `/images/ui/family_photos/${name}.webp`;
          img.setAttribute('title', `${name}`.replaceAll('_', ' '));
      }
  });
}


makeChartHistorical = function(){
  
  	// Destroy old charts
	if(overviewChart){overviewChart.destroy()}
	if(historicalChart){historicalChart.destroy()}
	if(consumptionFoodChart){consumptionFoodChart.destroy()}
	if(consumptionAlcoholChart){consumptionAlcoholChart.destroy()}
	if(consumptionFurnishingsChart){consumptionFurnishingsChart.destroy()}
	if(consumptionClothingChart){consumptionClothingChart.destroy()}
	if(consumptionCommunicationChart){consumptionCommunicationChart.destroy()}
	if(consumptionRecreationChart){consumptionRecreationChart.destroy()}
	if(consumptionRestaurantsChart){consumptionRestaurantsChart.destroy()}
	if(consumptionHealthChart){consumptionHealthChart.destroy()}
	if(consumptionEducationChart){consumptionEducationChart.destroy()}
	if(consumptionMiscellaneousChart){consumptionMiscellaneousChart.destroy()}
	if(consumptionTotalChart){consumptionTotalChart.destroy()}
	if(consumptionFlightsChart){consumptionFlightsChart.destroy()}
	if(consumptionVehiclePurchaseChart){consumptionVehiclePurchaseChart.destroy()}
	if(consumptionVehicleOtherChart){consumptionVehicleOtherChart.destroy()}
	if(gasChart){gasChart.destroy()}
	if(electricChart){electricChart.destroy()}
	if(otherHeatingChart){otherHeatingChart.destroy()}
	if(otherHousingChart){otherHousingChart.destroy()}
	if(carEmissionsChart){carEmissionsChart.destroy()}
	if(vanEmissionsChart){vanEmissionsChart.destroy()}
	if(bikeCompanyChart){bikeCompanyChart.destroy()}
	if(publicTransportChart){publicTransportChart.destroy()}
  
   		
  var component_la = [
    // Label, field (e.g. Gas => dgkp), background colour, border colour, gradelable, tableValue, tableGrade
		['Gas LA'                  , 'dom_gas_kgco2e_percap', 'rgb(157,130,255)', 'rgb(0,0,0)'],
		['Electricity LA'          , 'dom_elec_kgco2e_percap', 'rgb(157,130,255)'   , 'rgb(0,0,0)'],
		['Other Heating LA'        , 'heating_other_kgco2e_percap', 'rgb(157,130,255)'     , 'rgb(0,0,0)'],
		['Other Housing LA'        , 'housing_other_kgco2e_percap','rgb(157,130,255)'    , 'rgb(0,0,0)'],
		['Furnishings LA'          , 'furnish_kgco2e_percap', 'rgb(157,130,255)'  , 'rgb(0,0,0)'],
		['Food & Drink LA'         , 'food_kgco2e_percap' , 'rgb(157,130,255)', 'rgb(0,0,0)'],
		['Alcohol & Tobacco LA'    , 'alcohol_kgco2e_percap' , 'rgb(157,130,255)', 'rgb(0,0,0)'],
		['Clothing LA'             , 'clothing_kgco2e_percap' , 'rgb(157,130,255)'   , 'rgb(0,0,0)'],
		['Communications LA'       , 'communication_kgco2e_percap', 'rgb(157,130,255)'  , 'rgb(0,0,0)'],
		['Recreation LA'           , 'recreation_kgco2e_percap' , 'rgb(157,130,255)', 'rgb(0,0,0)'],
		['Restaurants & Hotels LA' , 'restaurant_kgco2e_percap', 'rgb(157,130,255)' , 'rgb(0,0,0)'],
		['Health LA'               , 'health_kgco2e_percap' , 'rgb(157,130,255)'  , 'rgb(0,0,0)'],
		['Education LA'            , 'education_kgco2e_percap' , 'rgb(157,130,255)'  , 'rgb(0,0,0)'],
		['Miscellaneous LA'        , 'misc_kgco2e_percap', 'rgb(157,130,255)'     , 'rgb(0,0,0)'],
		['Vehicle Purchase LA'     , 'transport_vehiclepurchase_kgco2e_percap', 'rgb(157,130,255)', 'rgb(0,0,0)'],
		['Cars LA'                 , 'car_kgco2e_percap' , 'rgb(157,130,255)'      , 'rgb(0,0,0)'],
		['Vans LA'                 , 'van_kgco2e_percap' , 'rgb(157,130,255)'      , 'rgb(0,0,0)'],
		['Bikes & Company Vehicles LA' , 'company_bike_kgco2e_percap', 'rgb(157,130,255)'    , 'rgb(0,0,0)'],
		['Vehicle Maintenance LA'   , 'transport_optranequip_other_kgco2e_percap','rgb(157,130,255)', 'rgb(0,0,0)'  ],
		['Public Transport LA'     , 'transport_pt_kgco2e_percap', 'rgb(157,130,255)'  , 'rgb(0,0,0)'],
		['Flights LA'              , 'flights_kgco2e_percap', 'rgb(157,130,255)'   , 'rgb(0,0,0)'],
		['Goods & Services LA'     , 'goods_services_combined_kgco2e_percap', 'rgb(157,130,255)', 'rgb(0,0,0)']
  ]
   
  
  var component_GB = [
    // Label, field (e.g. Gas => dgkp), background colour, border colour, gradelable, tableValue, tableGrade
		['Gas GB'                  , 'dom_gas_kgco2e_percap', 'rgb(130,255,61)', 'rgb(0,0,0)'],
		['Electricity GB'          , 'dom_elec_kgco2e_percap', 'rgb(130,255,61)'   , 'rgb(0,0,0)'],
		['Other Heating GB'        , 'heating_other_kgco2e_percap', 'rgb(130,255,61)'     , 'rgb(0,0,0)'],
		['Other Housing GB'        , 'housing_other_kgco2e_percap','rgb(130,255,61)'    , 'rgb(0,0,0)'],
		['Furnishings GB'          , 'furnish_kgco2e_percap', 'rgb(130,255,61)'  , 'rgb(0,0,0)'],
		['Food & Drink GB'         , 'food_kgco2e_percap' , 'rgb(130,255,61)', 'rgb(0,0,0)'],
		['Alcohol & Tobacco GB'    , 'alcohol_kgco2e_percap' , 'rgb(130,255,61)', 'rgb(0,0,0)'],
		['Clothing GB'             , 'clothing_kgco2e_percap' , 'rgb(130,255,61)'   , 'rgb(0,0,0)'],
		['Communications GB'       , 'communication_kgco2e_percap', 'rgb(130,255,61)'  , 'rgb(0,0,0)'],
		['Recreation GB'           , 'recreation_kgco2e_percap' , 'rgb(130,255,61)', 'rgb(0,0,0)'],
		['Restaurants & Hotels GB' , 'restaurant_kgco2e_percap', 'rgb(130,255,61)' , 'rgb(0,0,0)'],
		['Health GB'               , 'health_kgco2e_percap' , 'rgb(130,255,61)'  , 'rgb(0,0,0)'],
		['Education GB'            , 'education_kgco2e_percap' , 'rgb(130,255,61)'  , 'rgb(0,0,0)'],
		['Miscellaneous GB'        , 'misc_kgco2e_percap', 'rgb(130,255,61)'     , 'rgb(0,0,0)'],
		['Vehicle Purchase GB'     , 'transport_vehiclepurchase_kgco2e_percap', 'rgb(130,255,61)', 'rgb(0,0,0)'],
		['Cars GB'                 , 'car_kgco2e_percap' , 'rgb(130,255,61)'      , 'rgb(0,0,0)'],
		['Vans GB'                 , 'van_kgco2e_percap' , 'rgb(130,255,61)'      , 'rgb(0,0,0)'],
		['Bikes & Company Vehicles GB' , 'company_bike_kgco2e_percap', 'rgb(130,255,61)'    , 'rgb(0,0,0)'],
		['Vehicle Maintenance GB'   , 'transport_optranequip_other_kgco2e_percap','rgb(130,255,61)', 'rgb(0,0,0)'  ],
		['Public Transport GB'     , 'transport_pt_kgco2e_percap', 'rgb(130,255,61)'  , 'rgb(0,0,0)'],
		['Flights GB'              , 'flights_kgco2e_percap', 'rgb(130,255,61)'   , 'rgb(0,0,0)'],
		['Goods & Services GB'     , 'goods_services_combined_kgco2e_percap', 'rgb(130,255,61)', 'rgb(0,0,0)']
  ]
  
	const data_la = {datasets: []};
	const data_gb = {datasets: []};

	
	//console.log(laHistoricalData);
	component_la.forEach(comp => {
		const values = laHistoricalData[comp[1]] || [];
		
		data_la.datasets.push({
		label: comp[0],
		data: values,
		gradelabel: Array.isArray(values) ? new Array(values.length).fill('') : [],
		backgroundColor: comp[2],
		borderColor: comp[3],
		borderWidth: 1,
		stack: 'Stack 1'
		});
	});
  	
	component_GB.forEach(comp => {
		const values = gbHistoricalData[comp[1]] || [];
		
		data_gb.datasets.push({
		label: comp[0],
		data: values,
		gradelabel: Array.isArray(values) ? new Array(values.length).fill('') : [],
		backgroundColor: comp[2],
		borderColor: comp[3],
		borderWidth: 1,
		stack: 'Stack 3'
		});
	});

  data_la.labels = laHistoricalData['year'];
  
  console.log(data_la);
  
  function getStandardLabel(stack) {
    switch (stack) {
      case 'Stack 0': return 'This area';
      case 'Stack 1': return 'Local Authority';
      case 'Stack 2': return 'Similar Areas';
      case 'Stack 3': return 'Great Britain';
      default: return stack;
    }
  }

  

 //console.log(data_la);

  const combinedData = {
    labels: laHistoricalData['year'],
    datasets: [
      ...data_la.datasets.map(ds => ({ ...ds, standardLabel: getStandardLabel(ds.stack) })),
      ...data_gb.datasets.map(ds => ({ ...ds, standardLabel: getStandardLabel(ds.stack) }))
    ]
  };

  //console.log(combinedData);

  // Make Overview table
  // Find the index of the label '2019' in data.labels
  
  const yearIndex = data_la.labels.indexOf(2019);
  

  // Headline Grade
  // Set grade image and alt text - not in the JSON at the moment
  /*
  const Totalgrade = laHistoricalData['total_grade'][yearIndex];
  const TotalgradeImg = document.getElementById('data_total_emissions_grade');
  TotalgradeImg.src = `/images/grades/${Totalgrade}.webp`;
  TotalgradeImg.alt = `Grade ${Totalgrade}`;
  document.getElementById("data_total_emissions_percap").innerHTML = 
    laHistoricalData['total_kgco2e_percap'][yearIndex] + 
    ' kgCO<sub>2</sub>e per person per year in ' + 
    data.labels[yearIndex];
  */
  

  // Fill the overview table - diable for now
  /*
  component_la.forEach(comp => {
    const [label, field, , , gradeField, valueId, gradeId] = comp;
    const dataset = data_la.datasets.find(ds => ds.label === label);
    if (!dataset) return;
    // Set household emissions value
    console.log(valueId);
    document.getElementById(valueId).innerHTML = dataset.data[yearIndex];
  
    // Set grade image and alt text
    const grade = dataset.gradelabel[yearIndex];
    const gradeImg = document.getElementById(gradeId);
    gradeImg.src = `/images/grades/${grade}.webp`;
    gradeImg.alt = `Grade ${grade}`;
  });
    */
		// We draw the horizontal threshold line via a plugin so it always appears on top
		// and does not create a legend entry. (No dataset is pushed here.)
		//console.log(data.datasets);

		// Define the threshold plugin here so we can attach it to the historical chart as well.
		const thresholdLinePlugin = {
			id: 'thresholdLinePlugin',
			afterDatasetsDraw(chart, args, options) {
				const pluginOpts = (chart.options && chart.options.plugins && chart.options.plugins.thresholdLinePlugin) || options || {};
				const value = pluginOpts.value;
				if (typeof value !== 'number') return;
				const ctx = chart.ctx;
				const yScale = chart.scales['y'];
				if (!yScale) return;
				const y = yScale.getPixelForValue(value);
				ctx.save();
				ctx.strokeStyle = pluginOpts.color || 'black';
				ctx.lineWidth = pluginOpts.width || 2;
				if (Array.isArray(pluginOpts.dash) && pluginOpts.dash.length) ctx.setLineDash(pluginOpts.dash);
				ctx.beginPath();
				ctx.moveTo(chart.chartArea.left, y);
				ctx.lineTo(chart.chartArea.right, y);
				ctx.stroke();
				ctx.restore();
			}
		};

	historicalChart = new Chart(document.getElementById('historical-chart').getContext('2d'), {
    type: 'bar',
    data: {
 		  labels: data_la.labels.filter(d => d.label != 'Goods & Services'),
 		  datasets: data_la.datasets.filter(d => d.label != 'Goods & Services')
 		},
 		plugins: [thresholdLinePlugin],
 		options: {
			scales: {
				y: {
					stacked: true,
						title: {
									display: true,
									text: 'kgCO₂e per person'
								},
					ticks: {
						beginAtZero: true,
					}
				},
				x: {
					stacked: true
				},
			},
			plugins: {
				// plugin options for thresholdLinePlugin (draws a single line on top)
				thresholdLinePlugin: {
					value: 2849,
					color: 'black',
					width: 3,
					dash: []
				},
				legend: {
					position: 'right',
					reverse: true,
				labels: {
						font: { size: 11 },
						// Reduce spacing between legend items and tighten rows
						padding: 4,
						boxWidth: 10
					}
				}
	      },
			responsive: true,
			maintainAspectRatio: false
		}
		});
		const data_overview = {datasets: []};

		component_la.forEach(comp => {
			data_overview.datasets.push({
				label: comp[0],
				data: [laHistoricalData[comp[1]][yearIndex], gbHistoricalData[comp[1]][yearIndex]],
				backgroundColor: comp[2],
				borderColor: comp[3],
				borderWidth: 1,
				stack: 'Stack 0'
			});
		});

		data_overview.datasets = data_overview.datasets.filter(d => !d.label.includes('Goods & Services'));

        data_overview.labels = ['Local Authority','Great Britain'];



overviewChart = new Chart(document.getElementById('overview-chart').getContext('2d'), {
    type: 'bar',
		data: data_overview,
		plugins: [thresholdLinePlugin],
		options: {
			scales: {
				y: {
					stacked: true,
						title: {
									display: true,
									text: 'kgCO₂e per person'
								},
					ticks: {
						beginAtZero: true,
					}
				},
				x: {
					stacked: true
				},
			},
			plugins: {
				// plugin options for thresholdLinePlugin
				thresholdLinePlugin: {
					value: 2849,
					color: 'black',
					width: 3,
					dash: []
				},
				legend: {
					position: 'right',
					reverse: true,
					labels: {
						font: { size: 11 },
						// Reduce spacing between legend items and tighten rows
						padding: 4,
						boxWidth: 10
					}
				}
			},
			responsive: true,
			maintainAspectRatio: false
		}
  });
  
 
  var barChartOptions = {
						scales: {
							y: {
								stacked: true,
								title: {
									display: true,
									text: 'kgCO₂e per person'
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
					};
					
	// Lables above bar plugin
	const taxLabelPlugin = {
  id: 'taxLabelPlugin',
  afterDatasetsDraw(chart, args, options) {
			const { ctx } = chart;
			chart.data.datasets.forEach((dataset, datasetIndex) => {
				const meta = chart.getDatasetMeta(datasetIndex);
				if (!meta || !Array.isArray(meta.data)) return;
				meta.data.forEach((bar, index) => {
					// only draw labels if gradelabel exists for this dataset
					const hasGradeArray = dataset && Array.isArray(dataset.gradelabel);
					const value = hasGradeArray ? dataset.gradelabel[index] : undefined;
					if (value === undefined || value === null || value === '') return;
					ctx.save();
					ctx.fillStyle = 'black';
					ctx.font = '12px sans-serif';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'bottom';
					// Coordinates exist for bars and points as x/y; fallback to center if not present
					const x = (bar && typeof bar.x === 'number') ? bar.x : ((bar && bar.left && bar.right) ? (bar.left + bar.right) / 2 : 0);
					const y = (bar && typeof bar.y === 'number') ? bar.y : ((bar && bar.top && bar.bottom) ? (bar.top + bar.bottom) / 2 : 0);
					ctx.fillText(`${value}`, x, y - 5);
					ctx.restore();
				});
			});
    }
  };
  
  function makeStandardConsumptionChart(id,filter){
		// Create options for line charts based on the shared barChartOptions
		const lineOptions = {
			...barChartOptions,
			scales: {
				y: {
					// ensure y-axis always starts at zero
					min: 0,
					ticks: {
						beginAtZero: true
					}
				},
				x: {
					// lines shouldn't be stacked
					stacked: false
				}
			}
		};

		// fixed colour for the "This area" line across all charts
		const THIS_AREA_COLOUR = 'rgb(31,120,180)';

		const datasets = combinedData.datasets
			.filter(d => d.label.includes(filter))
			.map(d => {
				// use a consistent colour for 'This area', otherwise use the dataset's background colour
				const baseColour = (d.standardLabel === 'This area') ? THIS_AREA_COLOUR : (d.backgroundColor || d.borderColor || 'rgb(0,0,0)');

				return {
					label: d.standardLabel,
					data: d.data,
					// preserve gradelabel so the label plugin can draw annotations
					gradelabel: d.gradelabel,
					// colour the line itself
					borderColor: baseColour,
					// use same colour for points
					backgroundColor: baseColour,
					pointBackgroundColor: baseColour,
					pointBorderColor: baseColour,
					fill: false,
					tension: 0.2,
					borderWidth: 2
				};
			});

		// compute max value across all datasets so we can ensure the y-axis max is at least 500
		let dataMax = -Infinity;
		datasets.forEach(ds => {
			if (!Array.isArray(ds.data)) return;
			ds.data.forEach(v => {
				const n = Number(v);
				if (!Number.isNaN(n) && n > dataMax) dataMax = n;
			});
		});
		if (dataMax === -Infinity) dataMax = 0;

		// Choose a "nice" rounded max above the data max so axis ticks land on round numbers.
		// Use approximately 8 intervals (so small charts get steps like 200, larger ones 1000, etc.).
		const desiredIntervals = 8;
		let niceMax = dataMax;

		if (dataMax <= 0) {
			niceMax = 500;
		} else {
			// compute a raw step and round it up to a "nice" step (1, 2, 2.5, 5, 10 * 10^exp)
			const rawStep = dataMax / desiredIntervals;
			const exp = Math.floor(Math.log10(Math.max(rawStep, 1e-12)));
			const pow = Math.pow(10, exp);
			const frac = rawStep / pow;

			let niceFrac;
			if (frac <= 1) niceFrac = 1;
			else if (frac <= 2) niceFrac = 2;
			else if (frac <= 2.5) niceFrac = 2.5;
			else if (frac <= 5) niceFrac = 5;
			else niceFrac = 10;

			const niceStep = niceFrac * pow;
			niceMax = niceStep * Math.ceil(dataMax / niceStep);
			// ensure we never go below 500
			if (niceMax < 500) niceMax = 500;
		}

		// apply the computed nice max to the line chart options
		lineOptions.scales.y.max = niceMax;

		const chart = new Chart(document.getElementById(id).getContext('2d'), {
			type: 'line',
			data: {
				labels: combinedData.labels,
				datasets: datasets
			},
			options: lineOptions,
			plugins: [taxLabelPlugin]
		});

		return chart;
	}
  
  consumptionTotalChart = makeStandardConsumptionChart('consumptionTotal-chart','Goods & Services');
  consumptionFoodChart = makeStandardConsumptionChart('consumptionFood-chart','Food & Drink');
  consumptionAlcoholChart = makeStandardConsumptionChart('consumptionAlcohol-chart','Alcohol & Tobacco');
  consumptionFurnishingsChart = makeStandardConsumptionChart('consumptionFurnishings-chart','Furnishings');
  consumptionClothingChart = makeStandardConsumptionChart('consumptionClothing-chart','Clothing');
  consumptionCommunicationChart = makeStandardConsumptionChart('consumptionCommunication-chart','Communications');
  consumptionRecreationChart = makeStandardConsumptionChart('consumptionRecreation-chart','Recreation');
  consumptionRestaurantsChart = makeStandardConsumptionChart('consumptionRestaurants-chart','Restaurants & Hotels');
  consumptionHealthChart = makeStandardConsumptionChart('consumptionHealth-chart','Health');
  consumptionEducationChart = makeStandardConsumptionChart('consumptionEducation-chart','Education');
  consumptionMiscellaneousChart = makeStandardConsumptionChart('consumptionMiscellaneous-chart','Miscellaneous');
  consumptionFlightsChart = makeStandardConsumptionChart('consumptionFlights-chart','Flights');
  consumptionVehiclePurchaseChart = makeStandardConsumptionChart('consumptionVehiclePurchase-chart','Vehicle Purchase');
  consumptionVehicleOtherChart = makeStandardConsumptionChart('consumptionVehicleOther-chart','Vehicle Maintenance');
  gasChart = makeStandardConsumptionChart('gasEmissions-chart','Gas');
  electricChart = makeStandardConsumptionChart('electricityEmissions-chart','Electricity');
  otherHeatingChart = makeStandardConsumptionChart('heatingOther-chart','Other Heating');
  otherHousingChart = makeStandardConsumptionChart('housingOther-chart','Other Housing');
  carEmissionsChart = makeStandardConsumptionChart('carEmissions-chart','Cars');
  vanEmissionsChart = makeStandardConsumptionChart('vanEmissions-chart','Vans');
  bikeCompanyChart = makeStandardConsumptionChart('bikeCompany-chart','Bikes & Company Vehicles');
  publicTransportChart = makeStandardConsumptionChart('publicTransport-chart','Public Transport');

}


makeChartPopulation = function(){
  
  // Destroy old chart
	if(populationChart){
		populationChart.destroy();
	}

  // Create an object to store data for each category
  var component = [
		    // Label, field (matches columns in the population bin dataset), background colour, border colour
				['0-4'  , 'a04'  , 'rgb(255, 0, 0)', 'rgb(0,0,0)'],
				['5-9'  , 'a59' , 'rgb(255, 64, 0)'   , 'rgb(0,0,0)'],
				['10-14', 'a1014' , 'rgb(255, 128, 0)'     , 'rgb(0,0,0)'],
				['15-19', 'a1519' , 'rgb(255, 192, 0)'    , 'rgb(0,0,0)'],
				['20-24', 'a2024' , 'rgb(255, 255, 0)'  , 'rgb(0,0,0)'],
				['25-29', 'a2529' , 'rgb(192, 255, 0)', 'rgb(0,0,0)'],
				['30-34', 'a3034' , 'rgb(128, 255, 0)', 'rgb(0,0,0)'],
				['35-39', 'a3539' , 'rgb(64, 255, 0)'   , 'rgb(0,0,0)'],
				['40-44', 'a4044' , 'rgb(0, 255, 0)'  , 'rgb(0,0,0)'],
				['45-49', 'a4549' , 'rgb(0, 255, 64)', 'rgb(0,0,0)'],
				['50-54', 'a5054' , 'rgb(0, 255, 128)' , 'rgb(0,0,0)'],
				['55-59', 'a5559' , 'rgb(0, 255, 192)'  , 'rgb(0,0,0)'],
				['60-64', 'a6064' , 'rgb(0, 255, 255)'  , 'rgb(0,0,0)'],
				['65-69', 'a6569' , 'rgb(0, 192, 255)'     , 'rgb(0,0,0)'],
				['70-74', 'a7074' , 'rgb(0, 128, 255)'    , 'rgb(0,0,0)'],
				['75-79', 'a7579' , 'rgb(0, 64, 255)'     , 'rgb(0,0,0)'],
				['80-84', 'a8084' , 'rgb(0, 0, 255)'     , 'rgb(0,0,0)'],
				['85+'  , '85+'  , 'rgb(128, 0, 255)'    , 'rgb(0,0,0)'],
				['Households'  , 'households_est'  , 'rgb(0, 0, 0)'    , 'rgb(0,0,0)'],
				['Dwellings'  , 'all_properties'  , 'rgb(255, 0, 0)'    , 'rgb(255,0,0)']
		  ]
  
  
  var years =  ['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022']
  // Assemble the datasets to be shown
  
	const data = {datasets: []};
	

	component_la.forEach(comp => {
		data.datasets.push({
			label: comp[0],
			data: populationLocationData[comp[1]],
			backgroundColor: comp[2],
			borderColor: comp[3],
			borderWidth: 1,
			order: 3,
			stack: 'barStack'
		});
	});
  
  // Update type property for the last two datasets
  data.datasets[18].type = 'line';
  data.datasets[19].type = 'line';
  data.datasets[18].borderWidth  = 4;
  data.datasets[19].borderWidth  = 4;
  
  data.datasets[18].order  = 1;
  data.datasets[19].order  = 2;
  data.datasets[18].stack  = undefined;
  data.datasets[19].stack  = undefined;

  
  //console.log(data);
  
  data.labels = ['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022'];
  
  var populationctx = document.getElementById('population-chart').getContext('2d');
	populationChart = new Chart(populationctx, {
    type: 'bar',
					data: data,
					options: {
						scales: {
							y: {
								//stacked: true,
								title: {
									display: true,
									text: 'population'
								},
								ticks: {
									beginAtZero: true,
								}
							},
							x: {
								stacked: true
							},
						},
						plugins: {
                legend: {
                    position: 'right',
                    reverse: true,
                    labels: {
                      font: {
                          size: 8 // Adjust this value to make the text smaller
                      }
                    }
                }
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
// Click on modal tab open by default
document.getElementById("defaultOpen").click();

// Function to switch chart description tabs
switchChartTab = function (evt, tabName) {
  // Find the parent chart-description-tabs container
  var tabsContainer = evt.currentTarget.closest('.chart-description-tabs');
  
  // Get all tab content divs within this container and hide them
  var tabContents = tabsContainer.querySelectorAll('.chart-description-tab-content');
  tabContents.forEach(function(content) {
    content.classList.remove('active');
    content.style.display = 'none';
  });
  
  // Get all tab buttons within this container and remove the "active" class
  var tabButtons = tabsContainer.querySelectorAll('.chart-tab-btn');
  tabButtons.forEach(function(button) {
    button.classList.remove('active');
  });
  
  // Show the current tab and add "active" class to button
  var selectedContent = document.getElementById(tabName);
  if (selectedContent) {
    selectedContent.classList.add('active');
    selectedContent.style.display = 'block';
    evt.currentTarget.classList.add('active');
  }
}


// Initialize print button functionality
function initPrintButtons() {
  const printButtons = document.querySelectorAll('.print-button');
  
  printButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Simply trigger the print dialog - CSS handles the rest
      window.print();
    });
  });
}

// Initialize print buttons when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPrintButtons);
} else {
  initPrintButtons();
}

// Set the report heading/title to the named area (looked up from the level's
// name JSON), so the page shows which area is being reported. Configurable via
// window.REPORT_CONFIG.{level, nameJson}; defaults to the local authority set.
function setReportTitle(locationId) {
  const cfg = window.REPORT_CONFIG || {};
  const level = cfg.level || 'Local Authority';
  const nameJson = cfg.nameJson || '/reports/la.json';
  const titleEl = document.getElementById('la-title');
  fetch(nameJson)
    .then(function (r) { return r.json(); })
    .then(function (list) {
      const match = (Array.isArray(list) ? list.find(function (x) { return x.id === locationId; }) : null);
      const heading = (match ? match.name + ' - ' + level + ' Report' : level + ' Report');
      if (titleEl) { titleEl.textContent = heading; }
      document.title = heading;
    })
    .catch(function () {
      if (titleEl) { titleEl.textContent = level + ' Report'; }
    });
}

// Initialize page with location ID from URL parameter
function initPageWithLocation() {
  const urlParams = new URLSearchParams(window.location.search);
  const locationId = urlParams.get('id');

  if (locationId) {
    setReportTitle(locationId);
    manageChartsLA(locationId);
  } else {
    console.warn('No location ID provided in URL parameter (?id=locationId)');
  }
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageWithLocation);
} else {
  initPageWithLocation();
}
