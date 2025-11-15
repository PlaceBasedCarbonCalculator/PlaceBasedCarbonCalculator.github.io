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

var otherHeatingChart;
var otherHousingChart;

var plefIgnoreChart;
var plefSteerChart;
var plefShiftChart;
var plefTransformChart;

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

manageCharts = function (locationId) {
	console.log('Managing Charts');

	// Primary chained requests that feed multiple charts
	const urlsPrimary = [
		'https://pbcc.blob.core.windows.net/pbcc-data/historical_emissions/v2/' + locationId + '.json',
		'https://pbcc.blob.core.windows.net/pbcc-data/population/' + locationId + '.json',
		'https://pbcc.blob.core.windows.net/pbcc-data/lsoa_overview/v1/' + locationId + '.json',
		'https://pbcc.blob.core.windows.net/pbcc-data/la_emissions/v2/GB.json'
	];

	const primary = Promise.all(urlsPrimary.map(capUi.fetchJSON))
		.then(([historicalData, populationData, overviewArr, GBData]) => {
			locationData = historicalData;
			populationLocationData = populationData;
			lsoaOverviewData = overviewArr[0];
			gbHistoricalData = GBData;

			const urlsSecondary = [
				'https://pbcc.blob.core.windows.net/pbcc-data/oac_emissions/v2/' + lsoaOverviewData.lsoa_class_code + '.json',
				'https://pbcc.blob.core.windows.net/pbcc-data/la_emissions/v2/' + lsoaOverviewData.LAD25CD + '.json'
			];

			return Promise.all(urlsSecondary.map(capUi.fetchJSON))
				.then(([laData, oacData]) => {
					laHistoricalData = laData;
					oacHistoricalData = oacData;

					makeChartHistorical();
					makeChartPopulation();
					//console.log(lsoaHeadlineData);
					switchPenPortSub(lsoaHeadlineData[0].lsoa_class_name);
					switchPenPortSup(lsoaHeadlineData[0].lsoa_class_name);
				});
		})
		.catch(error => {
			console.error('Failed to load primary pbcc datasets:', error);
		});

	// Independent fetches
	/* Will be moved to retrofit tool
	const pVOA2010 = capUi.fetchJSON('https://pbcc.blob.core.windows.net/pbcc-data/voa_2010/' + locationId + '.json')
		.then(data => { voa2010LocationData = data; makeChartVOA2010(); })
		.catch(err => { console.error('VOA2010 failed:', err); });

	const pVOA2020 = capUi.fetchJSON('https://pbcc.blob.core.windows.net/pbcc-data/voa_2020/' + locationId + '.json')
		.then(data => { voa2020LocationData = data; makeChartVOA2020(); })
		.catch(err => { console.error('VOA2020 failed:', err); });
	*/
	const pCommunity = capUi.fetchJSON('https://pbcc.blob.core.windows.net/pbcc-data/community_photo/v1/' + locationId + '.json')
		.then(data => { communityPicLocationData = data; makeCommunityPic(); })
		.catch(err => { console.error('Community photo failed:', err); });

    return Promise.all([primary,  pCommunity]); //pVOA2010, pVOA2020,
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
				['Other Heating', 'hokp', 'rgba(202,178,214, 0.8)', 'rgba(202,178,214, 1)'],
				['Other Housing', 'Bhokp', 'rgba(51,160,44, 0.8)', 'rgba(51,160,44, 1)'],
				['Cars', 'cep', 'rgba(251,154,153, 0.8)', 'rgba(251,154,153, 1)'],
				['Vans', 'vep', 'rgba(227,26,28, 0.8)', 'rgba(227,26,28, 1)'],
				['Bikes and Company Cars', 'cbep', 'rgba(227,26,28, 0.8)', 'rgba(227,26,28, 1)'],
				['Flights', 'Cfkp', 'rgba(255,127,0, 0.8)', 'rgba(255,127,0, 1)'],
				['Food & Drink', 'nep', 'rgba(202,178,214, 0.8)', 'rgba(202,178,214, 1)'],
				['Alchohol & Tobacco', 'akp', 'rgba(202,178,214, 0.8)', 'rgba(202,178,214, 1)'],
				['Clothing', 'ckp', 'rgba(106,61,154, 0.8)', 'rgba(106,61,154, 1)'],
				['Communication', 'Bckp', 'rgba(106,61,154, 0.8)', 'rgba(106,61,154, 1)'],
				['Furnishing', 'Bfkp', 'rgba(106,61,154, 0.8)', 'rgba(106,61,154, 1)'],
				['Recreation', 'rkp', 'rgba(255,255,153, 0.8)', 'rgba(255,255,153, 1)'],
				['Health', 'hkp', 'rgba(255,255,153, 0.8)', 'rgba(255,255,153, 1)'],
				['Education', 'ekp', 'rgba(255,255,153, 0.8)', 'rgba(255,255,153, 1)'],
				['Restaurant & Hotels', 'Brkp', 'rgba(177,89,40, 0.8)', 'rgba(177,89,40, 1)'],
				['Miscellaneous', 'Brkp', 'rgba(177,89,40, 0.8)', 'rgba(177,89,40, 1)'],
		  ]
  
  var years =  ['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020']
  // Assemble the datasets to be shown
  
	const data = {datasets: []};

	component.forEach(comp => {
		data.datasets.push({
			label: comp[0],
			data: years.map(year => locationData[comp[1] + year]),
			backgroundColor: comp[2],
			borderColor: comp[3],
			borderWidth: 1
		});
	});

  data.labels = years;
  
  var overviewctx = document.getElementById('overview-chart').getContext('2d');
	consumptionFoodChart = new Chart(overviewctx, {
    type: 'bar',
					data: data,
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
						responsive: true,
						maintainAspectRatio: false
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
  
  
  // Create an object to store data for each category
	var component = [
		    // Label, field (e.g. Gas => dgkp), background colour, border colour, gradelable, tableValue, tableGrade
				['Gas'                  , 'dom_gas_kgco2e_percap', 'rgb(184, 216, 233)', 'rgb(0,0,0)', 'dom_gas_grade' ,'data_gas_emissions_household','data_gas_emissions_grade'],
				['Electricity'          , 'dom_elec_kgco2e_percap', 'rgb(71,142,190)'   , 'rgb(0,0,0)', 'dom_elec_grade' ,'data_elec_emissions_household','data_elec_emissions_grade'],
				['Other Heating'        , 'heating_other_kgco2e_percap', 'rgb(1,108,89)'     , 'rgb(0,0,0)', 'heating_other_grade' ,'data_other_heating_emissions','data_other_heating_emissions_grade'],
				['Other Housing'        , 'housing_other_kgco2e_percap','rgb(37,52,148)'    , 'rgb(0,0,0)', 'housing_other_grade','data_other_housing_emissions','data_other_housing_emissions_grade'],
				['Furnishings'          , 'furnish_kgco2e_percap', 'rgb(141,211,199)'  , 'rgb(0,0,0)', 'furnish_grade' ,'data_furnishings_emissions','data_furnishings_emissions_grade'],
				['Food & Drink'         , 'food_kgco2e_percap' , 'rgb(213, 193, 222)', 'rgb(0,0,0)', 'food_grade' ,'data_food_emissions','data_food_emissions_grade'],
				['Alcohol & Tobacco'    , 'alcohol_kgco2e_percap' , 'rgb(136, 100, 174)', 'rgb(0,0,0)', 'alcohol_grade'  ,'data_alcohol_emissions','data_alcohol_emissions_grade'],
				['Clothing'             , 'clothing_kgco2e_percap' , 'rgb(231,41,138)'   , 'rgb(0,0,0)', 'clothing_grade' ,'data_clothing_emissions','data_clothing_emissions_grade'],
				['Communications'       , 'communication_kgco2e_percap', 'rgb(217,217,217)'  , 'rgb(0,0,0)', 'communication_grade' ,'data_communications_emissions','data_communications_emissions_grade'],
				['Recreation'           , 'recreation_kgco2e_percap' , 'rgb(255, 255, 173)', 'rgb(0,0,0)', 'recreation_grade'  ,'data_recreation_emissions','data_recreation_emissions_grade'],
				['Restaurants & Hotels' , 'restaurant_kgco2e_percap', 'rgb(252, 246, 61)' , 'rgb(0,0,0)', 'restaurant_grade' ,'data_restaurants_emissions','data_restaurants_emissions_grade'],
				['Health'               , 'health_kgco2e_percap' , 'rgb(102,194,164)'  , 'rgb(0,0,0)', 'health_grade'  ,'data_health_emissions','data_health_emissions_grade'],
				['Education'            , 'education_kgco2e_percap' , 'rgb(229,245,249)'  , 'rgb(0,0,0)', 'education_grade'  ,'data_education_emissions','data_education_emissions_grade'],
				['Miscellaneous'        , 'misc_kgco2e_percap', 'rgb(75,75,75)'     , 'rgb(0,0,0)', 'misc_grade'  ,'data_miscellaneous_emissions','data_miscellaneous_emissions_grade'],
				['Vehicle Purchase'     , 'transport_vehiclepurchase_kgco2e_percap', 'rgb(255, 0, 0)'    , 'rgb(0,0,0)', 'transport_vehiclepurchase_grade' ,'data_vehicle_purchase_emissions','data_vehicle_purchase_emissions_grade'],
				['Cars'                 , 'car_kgco2e_percap' , 'rgb(127,0,0)'      , 'rgb(0,0,0)', 'car_grade'  ,'data_car_emissions','data_car_emissions_grade'],
				['Vans'                 , 'van_kgco2e_percap' , 'rgb(179,0,0)'      , 'rgb(0,0,0)', 'van_grade'  ,'data_van_emissions','data_van_emissions_grade'],
				['Bikes & Company Vehicles' , 'company_bike_kgco2e_percap', 'rgb(215,48,31)'    , 'rgb(0,0,0)', 'company_bike_grade' ,'data_bikes_company_emissions','data_bikes_company_emissions_grade'],
				['Vehicle Maintaince'   , 'transport_optranequip_other_kgco2e_percap','rgb(253,187,132)'  , 'rgb(0,0,0)', 'transport_optranequip_other_grade','data_vehicle_maintaince_emissions','data_vehicle_maintaince_emissions_grade'],
				['Public Transport'     , 'transport_pt_kgco2e_percap', 'rgb(254,232,200)'  , 'rgb(0,0,0)', 'transport_pt_grade' ,'data_public_transport_emissions','data_public_transport_emissions_grade'],
				['Flights'              , 'flights_kgco2e_percap', 'rgb(254,178,76)'   , 'rgb(0,0,0)', 'flights_grade'  ,'data_flights_emissions','data_flights_emissions_grade'],
				['Goods & Services'     , 'goods_services_combined_kgco2e_percap', 'rgb(254,178,76)'  , 'rgb(0,0,0)', 'goods_services_combined_grade','data_consumption_emissions','data_consumption_emissions_grade']
		  ]
	
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
		['Vehicle Maintaince LA'   , 'transport_optranequip_other_kgco2e_percap','rgb(157,130,255)', 'rgb(0,0,0)'  ],
		['Public Transport LA'     , 'transport_pt_kgco2e_percap', 'rgb(157,130,255)'  , 'rgb(0,0,0)'],
		['Flights LA'              , 'flights_kgco2e_percap', 'rgb(157,130,255)'   , 'rgb(0,0,0)'],
		['Goods & Services LA'     , 'goods_services_combined_kgco2e_percap', 'rgb(157,130,255)', 'rgb(0,0,0)']
  ]
  
  var component_oac = [
    // Label, field (e.g. Gas => dgkp), background colour, border colour, gradelable, tableValue, tableGrade
		['Gas Similar Areas'                  , 'dom_gas_kgco2e_percap', 'rgb(255, 130, 157)', 'rgb(0,0,0)'],
		['Electricity Similar Areas'          , 'dom_elec_kgco2e_percap', 'rgb(255, 130, 157)'   , 'rgb(0,0,0)'],
		['Other Heating Similar Areas'        , 'heating_other_kgco2e_percap', 'rgb(255, 130, 157)'     , 'rgb(0,0,0)'],
		['Other Housing Similar Areas'        , 'housing_other_kgco2e_percap','rgb(255, 130, 157)'    , 'rgb(0,0,0)'],
		['Furnishings Similar Areas'          , 'furnish_kgco2e_percap', 'rgb(255, 130, 157)'  , 'rgb(0,0,0)'],
		['Food & Drink Similar Areas'         , 'food_kgco2e_percap' , 'rgb(255, 130, 157)', 'rgb(0,0,0)'],
		['Alcohol & Tobacco Similar Areas'    , 'alcohol_kgco2e_percap' , 'rgb(255, 130, 157)', 'rgb(0,0,0)'],
		['Clothing Similar Areas'             , 'clothing_kgco2e_percap' , 'rgb(255, 130, 157)'   , 'rgb(0,0,0)'],
		['Communications Similar Areas'       , 'communication_kgco2e_percap', 'rgb(255, 130, 157)'  , 'rgb(0,0,0)'],
		['Recreation Similar Areas'           , 'recreation_kgco2e_percap' , 'rgb(255, 130, 157)', 'rgb(0,0,0)'],
		['Restaurants & Hotels Similar Areas' , 'restaurant_kgco2e_percap', 'rgb(255, 130, 157)' , 'rgb(0,0,0)'],
		['Health Similar Areas'               , 'health_kgco2e_percap' , 'rgb(255, 130, 157)'  , 'rgb(0,0,0)'],
		['Education Similar Areas'            , 'education_kgco2e_percap' , 'rgb(255, 130, 157)'  , 'rgb(0,0,0)'],
		['Miscellaneous Similar Areas'        , 'misc_kgco2e_percap', 'rgb(255, 130, 157)'     , 'rgb(0,0,0)'],
		['Vehicle Purchase Similar Areas'     , 'transport_vehiclepurchase_kgco2e_percap', 'rgb(255, 130, 157)', 'rgb(0,0,0)'],
		['Cars Similar Areas'                 , 'car_kgco2e_percap' , 'rgb(255, 130, 157)'      , 'rgb(0,0,0)'],
		['Vans Similar Areas'                 , 'van_kgco2e_percap' , 'rgb(255, 130, 157)'      , 'rgb(0,0,0)'],
		['Bikes & Company Vehicles Similar Areas' , 'company_bike_kgco2e_percap', 'rgb(255, 130, 157)'    , 'rgb(0,0,0)'],
		['Vehicle Maintaince Similar Areas'   , 'transport_optranequip_other_kgco2e_percap','rgb(255, 130, 157)', 'rgb(0,0,0)'  ],
		['Public Transport Similar Areas'     , 'transport_pt_kgco2e_percap', 'rgb(255, 130, 157)'  , 'rgb(0,0,0)'],
		['Flights Similar Areas'              , 'flights_kgco2e_percap', 'rgb(255, 130, 157)'   , 'rgb(0,0,0)'],
		['Goods & Services Similar Areas'     , 'goods_services_combined_kgco2e_percap', 'rgb(255, 130, 157)', 'rgb(0,0,0)']
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
		['Vehicle Maintaince GB'   , 'transport_optranequip_other_kgco2e_percap','rgb(130,255,61)', 'rgb(0,0,0)'  ],
		['Public Transport GB'     , 'transport_pt_kgco2e_percap', 'rgb(130,255,61)'  , 'rgb(0,0,0)'],
		['Flights GB'              , 'flights_kgco2e_percap', 'rgb(130,255,61)'   , 'rgb(0,0,0)'],
		['Goods & Services GB'     , 'goods_services_combined_kgco2e_percap', 'rgb(130,255,61)', 'rgb(0,0,0)']
  ]
  
	const data = {datasets: []};
	const data_la = {datasets: []};
	const data_oac = {datasets: []};
	const data_gb = {datasets: []};

	component.forEach(comp => {
		data.datasets.push({
			label: comp[0],
			data: locationData[comp[1]],
			gradelabel: locationData[comp[4]],
			backgroundColor: comp[2],
			borderColor: comp[3],
			borderWidth: 1,
			order: 0,
			stack: 'Stack 0'
		});
	});
	
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
  
  component_oac.forEach(comp => {
    const values = oacHistoricalData[comp[1]] || [];
    
    data_oac.datasets.push({
      label: comp[0],
      data: values,
      gradelabel: Array.isArray(values) ? new Array(values.length).fill('') : [],
      backgroundColor: comp[2],
      borderColor: comp[3],
      borderWidth: 1,
      stack: 'Stack 2'
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

  data.labels = locationData['year'];
  
  
  function getStandardLabel(stack) {
    switch (stack) {
      case 'Stack 0': return 'This area';
      case 'Stack 1': return 'Local Authority';
      case 'Stack 2': return 'Similar Areas';
      case 'Stack 3': return 'Great Britain';
      default: return stack;
    }
  }

  



  const combinedData = {
    labels: locationData['year'],
    datasets: [
      ...data.datasets.map(ds => ({ ...ds, standardLabel: getStandardLabel(ds.stack) })),
      ...data_la.datasets.map(ds => ({ ...ds, standardLabel: getStandardLabel(ds.stack) })),
      ...data_oac.datasets.map(ds => ({ ...ds, standardLabel: getStandardLabel(ds.stack) })),
      ...data_gb.datasets.map(ds => ({ ...ds, standardLabel: getStandardLabel(ds.stack) }))
    ]
  };

  // Make Overview table
  // Find the index of the label '2019' in data.labels
  const yearIndex = data.labels.indexOf(2019);

  // Headline Grade
  // Set grade image and alt text
  const Totalgrade = locationData['total_grade'][yearIndex];
  const TotalgradeImg = document.getElementById('data_total_emissions_grade');
  TotalgradeImg.src = `/images/grades/${Totalgrade}.webp`;
  TotalgradeImg.alt = `Grade ${Totalgrade}`;
  document.getElementById("data_total_emissions_percap").innerHTML = 
    locationData['total_kgco2e_percap'][yearIndex] + 
    ' kgCO<sub>2</sub>e per person per year in ' + 
    data.labels[yearIndex];
  
  //console.log(locationData['total_grade'][yearIndex]);
  //document.getElementById("data_total_emissions_grade").innerHTML = locationData[comp[4]];
  //document.getElementById("data_total_emissions_percap").innerHTML = data.dekp2019;

  // Fill the overview table
  component.forEach(comp => {
    const [label, field, , , gradeField, valueId, gradeId] = comp;
    const dataset = data.datasets.find(ds => ds.label === label);
    if (!dataset) return;
    // Set household emissions value
    document.getElementById(valueId).innerHTML = dataset.data[yearIndex];
  
    // Set grade image and alt text
    const grade = dataset.gradelabel[yearIndex];
    const gradeImg = document.getElementById(gradeId);
    gradeImg.src = `/images/grades/${grade}.webp`;
    gradeImg.alt = `Grade ${grade}`;
  });

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
 		  labels: data.labels.filter(d => d.label != 'Goods & Services'),
 		  datasets: data.datasets.filter(d => d.label != 'Goods & Services')
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

		component.forEach(comp => {
			data_overview.datasets.push({
				label: comp[0],
				data: [locationData[comp[1]][yearIndex], laHistoricalData[comp[1]][yearIndex], oacHistoricalData[comp[1]][yearIndex], gbHistoricalData[comp[1]][yearIndex]],
				backgroundColor: comp[2],
				borderColor: comp[3],
				borderWidth: 1,
				stack: 'Stack 0'
			});
		});

		data_overview.datasets = data_overview.datasets.filter(d => !d.label.includes('Goods & Services'));

        data_overview.labels = ['This Area','Local Authority','Similar Areas','Great Britain'];



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
  
  consumptionTotalChart = makeStandardConsumptionChart('consumptionTotal-chart','Goods & Services')
  consumptionFoodChart = makeStandardConsumptionChart('consumptionFood-chart','Food & Drink')
  consumptionAlcoholChart = makeStandardConsumptionChart('consumptionAlcohol-chart','Alcohol & Tobacco')
  consumptionFurnishingsChart = makeStandardConsumptionChart('consumptionFurnishings-chart','Furnishings')
  consumptionClothingChart = makeStandardConsumptionChart('consumptionClothing-chart','Clothing')
  consumptionCommunicationChart = makeStandardConsumptionChart('consumptionCommunication-chart','Communications')
  consumptionRecreationChart = makeStandardConsumptionChart('consumptionRecreation-chart','Recreation')
  consumptionRestaurantsChart = makeStandardConsumptionChart('consumptionRestaurants-chart','Restaurants & Hotels')
  consumptionHealthChart = makeStandardConsumptionChart('consumptionHealth-chart','Health')
  consumptionEducationChart = makeStandardConsumptionChart('consumptionEducation-chart','Education')
  consumptionMiscellaneousChart = makeStandardConsumptionChart('consumptionMiscellaneous-chart','Miscellaneous')
  consumptionFlightsChart = makeStandardConsumptionChart('consumptionFlights-chart','Flights')
  consumptionVehiclePurchaseChart = makeStandardConsumptionChart('consumptionVehiclePurchase-chart','Vehicle Purchase')
  consumptionVehicleOtherChart = makeStandardConsumptionChart('consumptionVehicleOther-chart','Vehicle Maintaince')
  gasChart = makeStandardConsumptionChart('gasEmissions-chart','Gas')
  electricChart = makeStandardConsumptionChart('electricityEmissions-chart','Electricity')
  otherHeatingChart = makeStandardConsumptionChart('heatingOther-chart','Other Heating')
  otherHousingChart = makeStandardConsumptionChart('housingOther-chart','Other Housing')
  carEmissionsChart = makeStandardConsumptionChart('carEmissions-chart','Cars')
  vanEmissionsChart = makeStandardConsumptionChart('vanEmissions-chart','Vans')
  bikeCompanyChart = makeStandardConsumptionChart('bikeCompany-chart','Bikes & Company Vehicles')

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
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'B',
				data: bB,
				backgroundColor: 'rgba(127,188,65, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'C',
				data: bC,
				backgroundColor: 'rgba(184,225,134, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'D',
				data: bD,
				backgroundColor: 'rgba(230,245,208, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'E',
				data: bE,
				backgroundColor: 'rgba(247,247,247, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'F',
				data: bF,
				backgroundColor: 'rgba(253,224,239, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'G',
				data: bG,
				backgroundColor: 'rgba(241,182,218, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'H',
				data: bH,
				backgroundColor: 'rgba(222,119,174, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'I',
				data: bI,
				backgroundColor: 'rgba(197,27,125, 0.8)',
				borderColor: 'rgb(0,0,0)',
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
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Flat/Maisonette',
				data: voa2020LocationData['flatmais'],
				backgroundColor: 'rgba(227, 26, 28, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Terraced',
				data: voa2020LocationData['terraced'],
				backgroundColor: 'rgba(17, 219, 13, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Semi-Detached',
				data: voa2020LocationData['semi'],
				backgroundColor: 'rgba(14, 156, 11, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: 'Detached',
				data: voa2020LocationData['detached'],
				backgroundColor: 'rgba(8, 82, 7, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'Annexe',
				data: voa2020LocationData['annexe'],
				backgroundColor: 'rgba(31, 120, 180, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'Caravan/Boat/Mobile home',
				data: voa2020LocationData['caravanboatmobilehome'],
				backgroundColor: 'rgba(250, 124, 0, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'Unknown',
				data: voa2020LocationData['unknown'],
				backgroundColor: 'rgba(135, 136, 138, 0.8)',
				borderColor: 'rgb(0,0,0)',
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
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '2',
				data: voa2020LocationData['bed2'],
				backgroundColor: 'rgba(168,221,181, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '3',
				data: voa2020LocationData['bed3'],
				backgroundColor: 'rgba(123,204,196, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '4',
				data: voa2020LocationData['bed4'],
				backgroundColor: 'rgba(78,179,211, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '5',
				data: voa2020LocationData['bed5'],
				backgroundColor: 'rgba(43,140,190, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: '6+',
				data: voa2020LocationData['bed6'],
				backgroundColor: 'rgba(8,88,158, 0.8)',
				borderColor: 'rgb(0,0,0)',
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
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '1900-18',
				data: voa2020LocationData['bp19001918'],
				backgroundColor: 'rgba(213, 62, 79, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
			{
				label: '1919-29',
				data: voa2020LocationData['bp19191929'],
				backgroundColor: 'rgba(244, 109, 67, 0.8)',
				borderColor: 'rgb(0,0,0)',
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
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: '1955-64',
				data: voa2020LocationData['bp19551964'],
				backgroundColor: 'rgba(255,255,191, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: '1965-72',
				data: voa2020LocationData['bp19651972'],
				backgroundColor: 'rgba(230,245,152, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: '1973-82',
				data: voa2020LocationData['bp19731982'],
				backgroundColor: 'rgba(171,221,164, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: '1983-92',
				data: voa2020LocationData['bp19831992'],
				backgroundColor: 'rgba(102,194,165, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},			
      {
				label: '1993-99',
				data: voa2020LocationData['bp19931999'],
				backgroundColor: 'rgba(50,136,189, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},			
      {
				label: '2000-08',
				data: voa2020LocationData['bp20002008'],
				backgroundColor: 'rgba(94,79,162, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},			
      {
				label: '2009-21',
				data: voa2020LocationData['bp20092021'],
				backgroundColor: 'rgba(144, 77, 159, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},			
      {
				label: '2022-24',
				data: voa2020LocationData['bp20222024'],
				backgroundColor: 'rgba(217, 22, 74, 0.8)',
				borderColor: 'rgb(0,0,0)',
				borderWidth: 1,
				order: 1
			},
      {
				label: 'Unknown',
				data: voa2020LocationData['bpunkw'],
				backgroundColor: 'rgba(135, 136, 138, 0.8)',
				borderColor: 'rgb(0,0,0)',
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


makeChartPopulation = function(){
  
  // Destroy old chart
	if(populationChart){
		populationChart.destroy();
	}

  // Create an object to store data for each category
  var component = [
		    // Label, field (e.g. Gas => dgkp2020), background colour, border colour
				['0-4'  , 'a'  , 'rgb(255, 0, 0)', 'rgb(0,0,0)'],
				['5-9'  , 'Ba' , 'rgb(255, 64, 0)'   , 'rgb(0,0,0)'],
				['10-14', 'Ca' , 'rgb(255, 128, 0)'     , 'rgb(0,0,0)'],
				['15-19', 'Da' , 'rgb(255, 192, 0)'    , 'rgb(0,0,0)'],
				['20-24', 'Ea' , 'rgb(255, 255, 0)'  , 'rgb(0,0,0)'],
				['25-29', 'Fa' , 'rgb(192, 255, 0)', 'rgb(0,0,0)'],
				['30-34', 'Ga' , 'rgb(128, 255, 0)', 'rgb(0,0,0)'],
				['35-39', 'Ha' , 'rgb(64, 255, 0)'   , 'rgb(0,0,0)'],
				['40-44', 'Ia' , 'rgb(0, 255, 0)'  , 'rgb(0,0,0)'],
				['45-49', 'Ja' , 'rgb(0, 255, 64)', 'rgb(0,0,0)'],
				['50-54', 'Ka' , 'rgb(0, 255, 128)' , 'rgb(0,0,0)'],
				['55-59', 'La' , 'rgb(0, 255, 192)'  , 'rgb(0,0,0)'],
				['60-64', 'Ma' , 'rgb(0, 255, 255)'  , 'rgb(0,0,0)'],
				['65-69', 'Na' , 'rgb(0, 192, 255)'     , 'rgb(0,0,0)'],
				['70-74', 'Oa' , 'rgb(0, 128, 255)'    , 'rgb(0,0,0)'],
				['75-79', 'Pa' , 'rgb(0, 64, 255)'     , 'rgb(0,0,0)'],
				['80-84', 'Qa' , 'rgb(0, 0, 255)'     , 'rgb(0,0,0)'],
				['85+'  , '8'  , 'rgb(128, 0, 255)'    , 'rgb(0,0,0)'],
				['Households'  , 'he'  , 'rgb(0, 0, 0)'    , 'rgb(0,0,0)'],
				['Dwellings'  , 'ap'  , 'rgb(255, 0, 0)'    , 'rgb(255,0,0)']
		  ]
  
  
  var years =  ['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022']
  // Assemble the datasets to be shown
  
	const data = {datasets: []};
	

	component.forEach(comp => {
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

// Function to switch Pen Portrait description
function switchPenPortSub(SOAC11NM) {
  
  var pp = "No Desc";
  switch(SOAC11NM) {
  case "Achieving neighbourhoods":
    pp = `<p>This group is the least densely populated of the four groups comprising the ethnically-diverse professionals supergroup and with a lower median age (36 years) than for the parent supergroup (38 years).</p>

<p>Residents are slightly more likely to be born in the UK or Ireland and to live in a terraced property than the parent supergroup and households are more likely to own or have shared ownership of their property (74.4% of all households). Workers are more likely than the parent supergroup to use private transport to get to work and to work in the public administration or defence; compulsory social security industries. </p>`;
    break;
  case "Affluent communities":
    pp = `<p>This group has the joint-highest median age (47 years) of all the groups and a higher proportion of persons living in communal establishments than with the parent supergroup, and aged 90 years or over.</p>

<p>There is a higher proportion of all non-White ethnic groups compared with the parent supergroup. Households are more likely to live in a detached property (over half of all households), more likely to live in a flat and marginally more likely to own or have shared ownership of a property. Workers are more likely to use public transport to get to work (though only 9.0% do so) and to work in the information and communication or professional-related industries.</p>`;
    break;
  case "Ageing rural neighbourhoods":
    pp = `<p>Residents within this group cluster have the highest joint-median age (47 years) of all the 24 groups and compared with the parent supergroup, there is a noticeably higher proportion of residents living in a communal establishment and an observably higher proportion aged 90 years and over. A higher proportion of residents have mixed ethnicity or are from multiple ethnic groups.</p>

<p>Households are more likely to live in a terraced property or a flat (though for these two housing types combined, less than one-quarter of all households do so) and to privately rent than for the parent supergroup, though most households live in a detached property (55.2%). Employed residents are also marginally more likely to use public transport, cycle or walk to work and to work in the accommodation or food service activities industries than for the parent supergroup. </p>`;
    break;
  case "Ageing suburbanites":
    pp = `<p>This group has the joint highest median age (47 years) of all the groups.Compared with the parent supergroup, households are more likely to live in a semi-detached property (comprising a half of all households) and marginally more likely to own or have shared ownership of a property – this covers 89.9% of all households, the highest percentage for any of the 24 groups. Workers are marginally more likely to use private transport to get to work (and was the stated main method of transport for over three-quarters of all workers aged 16 to 74 years) and to work in the manufacturing industry.</p>`;
    break;
  case "Ageing urban communities":
    pp = `<p>This group has the highest median age (46) of the five groups comprising the industrious communities supergroup (median age 42 years).</p>

<p>Compared with the supergroup, there is a noticeably higher proportion of residents who live in a communal establishment (nearly 5% of all residents) and a noticeably higher proportion of residents aged 90 years and over. Amongst households there is a higher proportion who live in a detached property and a higher proportion who live in a flat.</p>

<p>Educational qualifications are generally higher than the supergroup and for those in employment a higher proportion walk or cycle to work. There is also a higher prevalence of workers in the information and communication or professional-related activities. </p>`;
    break;
  case "Asian traits":
    pp = `<p>This group has a higher median age (40 years) than for the parent supergroup (38 years). There is also an observably higher proportion of residents from the Indian and Pakistani ethnic groups and a higher proportion of residents whose main language is not English and cannot speak English well or at all. Households are more likely to live in a detached property (25.9% of all households) or a semi-detached property (47.6% of households) and to have two or more cars (40.7% of households).</p>

<p>Workers are more likely to use public transport to travel to work and to work in the education sector than the parent supergroup.</p>`;
    break;
  case "Aspiring urban households":
    pp = `<p>This group has the lowest median age (39 years) of the five groups comprising the industrious communities supergroup (median age 42 years) and the highest population density (17.1 persons per hectare).</p>

<p>The proportion of persons of non-White ethnic group is generally higher than for the supergroup, whilst households are more likely to live in a terraced property (36.7% of all households) and to be privately renting.</p>

<p>Unemployment rates are below that for the supergroup, whilst for those in employment there was a marginally higher proportion of full-time workers and a higher proportion working in financial-related industries.</p>`;
    break;
  case "Challenged white communities":
    pp = `<p>Of the four groups within the supergroup, this group has the lowest population density (26.3 persons per hectare). Residents belonging to this group are more likely to have been born in the UK or Ireland than for the parent supergroup. Households are also more likely to live in a semi-detached property (36.8% of all households) or terraced property (41.5% of all households).</p>

<p>Households are also marginally more likely to own or have shared ownership of a property and to live in socially-rented accommodation (41.4% of households).</p>

<p>For residents in employment, they are marginally more likely than the parent supergroup to use private transport to get to work and more likely to work in the energy, water or air conditioning supply industries than the parent supergroup. </p>`;
    break;
  case "Comfortable neighbourhoods":
    pp = `<p>The characteristics of this group are very similar to the parent supergroup. There is though a higher proportion of households who live in a flat (covering one-fifth of all households) and who live in socially-rented accommodation (covering one-fifth of all households). Educational qualifications are higher than for the supergroup and workers are more likely to use public transport to get to work and to work in financial-related industries. </p>`;
    break;
  case "Comfortable suburbia":
    pp = `<p>This group has the lowest median age (40 years) of the three groups within the supergroup and a slightly higher proportion of persons in all the non-White ethnic groups than for the parent supergroup. Households are more likely to live in a terraced property (though only 16.9% of households do so) and to either privately rent or live in social rented accommodation, though the large majority of households either own outright or have shared ownership of their property. Workers are more likely to work in the transport or storage industries.</p>`;
    break;
  case "Constrained renters":
    pp = `<p>Compared with the parent supergroup, residents are more likely to be living in a communal establishment and more likely to be in privately-rented accommodation (over a quarter of all households) and to be living in a terraced property (47.2% of households, the highest percentage for any of the 24 groups).</p>

<p>Workers are more likely to work full-time and to work in the agriculture, forestry and fishing industries. </p>`;
    break;
  case "Cosmopolitan student neighbourhoods":
    pp = `<p>The group and parent group are the same in terms of SOA representation. The description for the cosmopolitan student neighbourhoods supergroup therefore also applies for this group, which bears the same name as the parent supergroup.</p>`;
    break;
  case "Endeavouring social renters":
    pp = `<p>The characteristics of this group are also very similar to the parent supergroup. There is though a higher proportion of households who live in a semi-detached property (covering nearly a half of all households) and who live in socially-rented accommodation (covering over a fifth of all households).</p>

<p>Unemployment is higher than for the supergroup and compared with the parent supergroup, workers are more likely to use public transport to get to work (though over three-quarters of workers in fact use private transport to get to work) and to work in the energy, water or air conditioning supply industries. </p>`;
    break;
  case "Hampered neighbourhoods":
    pp = `<p>Of the four groups within the parent supergroup, this group has the lowest median age (35 years), with higher proportions of residents in the 0 to 4 years and 5 to 14 years age groups. A noticeably higher proportion of residents have mixed ethnicity or are from multiple ethnic groups. All non-White ethnic groups have a higher representation than for the supergroup.</p>

<p>Compared with the parent supergroup, households are more likely to live in a semi-detached property (over one-third of all households) – though households who live in a terraced property are slightly more prevalent and households are also more likely to be socially renting (42.7% of households). Workers are more likely to use public transport to get to work and to work in the education sector.</p>`;
    break;
  case "Hard-pressed flat dwellers":
    pp = `<p>Of the groups within the parent supergroup, this group has the highest median age (39 years), the same as the UK median age and has the highest population density (36.8 persons per hectare) and lowest proportion of land area. As implied by the name for this group, there is a noticeably higher proportion of households who live in a flat (70.8% of all households) than for the parent supergroup, and social renting is also more prevalent (a half of all households socially-rented – the highest for any of the 24 groups).</p>

<p>Unemployment is also higher than for the parent supergroup (at 8.6% of all residents aged 16 to 74 years, this was the highest level out of all the 24 groups) and workers are more likely to work in financial-related industries.</p>`;
    break;
  case "Highly qualified professionals":
    pp = `<p>Compared with the supergroup, there is an observably higher proportion of persons aged 90 years and over. Residents are marginally more likely to live in a detached property, but also markedly more likely to live in a flat (41.2% of households) than for the supergroup. Households are more likely to privately rent their accommodation than the parent supergroup. Of the four groups within the ethnically diverse professionals supergroup, adults within this group have the highest qualification levels.</p>

<p>Residents in employment are more likely to work within the information-related industries (16.9% of all workers aged 16 to 74 years).</p>`;
    break;
  case "Households in terraces and flats":
    pp = `<p>This group has the highest population density (30.3 persons per hectare) of all the four groups within the parent supergroup.</p>

<p>Compared with the parent supergroup, the groups have a higher proportion of persons whose ethnic group is recorded as Black, African, Caribbean or Black British. Residents are also much more likely to live in a terraced property (over one-third of all households) and marginally more likely to live in a flat (as do a quarter of all households) and to live in socially-rented accommodation.</p>

<p>Unemployment is higher for this group than for the other three groups within the parent supergroup, whilst those in employment are more likely to work in the transport or storage industries.</p>`;
    break;
  case "Inner city cosmopolitan":
    pp = `<p>The group and parent group are the same in terms of SOA representation. The description for the inner city cosmopolitan supergroup therefore also applies for this group, which bears the same name as the parent supergroup.</p>`;
    break;
  case "Primary sector workers":
    pp = `<p>This group has the lowest population density of the five groups within the supergroup. There is a higher prevalence of households living in a detached property (a quarter of all households) and living in a flat than with the parent supergroup. Households are also more likely to live in socially-rented accommodation.</p>

<p>Workers are more likely to walk or cycle to work and to work in the agriculture, forestry and fishing industries, and the accommodation or food service activities industries.</p>`;
    break;
  case "Prospering countryside life":
    pp = `<p>Compared with the parent supergroup, a higher proportion of residents have mixed ethnicity or are from multiple ethnic groups. Residents are also more likely to have a higher level of qualifications. Nearly four-fifths of households own or have shared ownership of their property. Car ownership is also slightly higher than for the parent supergroup – with 57.7% of households having access to two or more cars, which is the highest percentage for any of the 24 groups.</p>

<p>Workers are more likely to use public transport to travel to work than for the parent supergroup and are also more likely to be employed in the information and communication or professional, scientific and technical activities industries and financial-related industries.</p>`;
    break;
  case "Remoter communities":
    pp = `<p>The population of this group live in remoter parts of the UK, though covering half of the total UK land area. This group has the lowest population density of any of the 24 groups (0.2 persons per hectare). Residents are more likely than the parent supergroup to live in a detached property (69.4% of all households do so – the highest percentage for any group). Residents are also marginally more likely to be privately renting, though households owning their own property or have shared ownership is far more prevalent – 77.5% of households.</p>

<p>An observably higher proportion of workers are employed in the agriculture, forestry and fishing industries than with the parent supergroup (the highest for any group at 8.9% of all employed residents aged 16 to 74 years), there is also a higher prevalence of working in the mining, quarrying or construction industries (the highest for any group at 10.2% of all employed residents aged 16 to 74 years). </p>`;
    break;
  case "Rural traits":
    pp = `<p>Of the four groups within the parent supergroup countryside living, the rural traits group has the lowest median age (45 years) though this is above the UK median age (39 years).</p>

<p>Residents are more likely to live in a semi-detached, terraced property, or flat than the parent supergroup and to live in socially-rented accommodation, though owned or shared ownership of a property is also relatively high (74.6% of all households).</p>

<p>Workers are also marginally more likely to walk, cycle or use an alternative method to get to work and to be employed in the energy, water or air conditioning supply industries than for the parent supergroup.</p>`;
    break;
  case "Urban cultural mix":
    pp = `<p>This group has a higher proportion of persons who are White than with the parent group and higher proportion of persons born in the UK or Ireland. Households are more likely to live in a flat (over one-third of all households) and to live in socially-rented accommodation (one-third of all households).</p>

<p>Workers are more likely to work in the energy, water or air conditioning supply industries and human health and social work activities industries.</p>`;
    break;
  case "Young ethnic communities":
    pp = `<p>The population of this group have the second-lowest median age (30 years) of all the 24 groups. There is a higher proportion of persons for most of the non-White ethnic groups than with the parent supergroup. Households are more likely to live in a detached property (though just 8.1% of households do so) and to live in privately-rented accommodation (over a quarter of all households).</p>

<p>Qualifications levels are generally higher than with the parent supergroup, whilst workers are more likely to work part-time (one-third do so) and to work in the accommodation or food service activities industries. </p>`;
    break;
  default:
    pp = `<p>No Description</p>`;
  } 
  
  document.getElementById("penportsub").innerHTML = pp;
}


function switchPenPortSup(SOAC11NM) {
  
  var pp1 = `<p>The population of this supergroup typically live in cities and major towns across the UK containing universities, and because of this, there is a large student population, characterised by a relatively large proportion of households with full-time students (8.5%).</p>

<p>Residents are much more likely to live in communal establishments – such as university halls of residences and flats. Residents are also more likely than nationally to live in private or social rented accommodation (applies to 62.0% of all households). There is a much younger age structure than nationally, with a median age of 26 years – the lowest of any of the eight supergroups. The supergroup has an above average ethnic mix and below average proportion of residents UK and Irish born.</p>

<p>Qualification levels are higher than nationally, and for those in employment, a higher proportion use public transport or walk and cycle to get to work (over half of all employed residents).</p>

<p>Employed residents aged 16 to 74 years are more likely to work in the accommodation or food service activities industries (11.0% of employed residents, the highest percentage for any supergroup) and to work part-time (31.5% of employed residents, the highest percentage for any supergroup). </p>`;
  
  
  var pp2 = `<p>The population of this supergroup live in rural areas across the whole of the UK, the SOAs covered by this supergroup cover 87% of the total UK land area.</p>

<p>Residents are much more likely to live in detached housing (57.1% of households – the highest percentage for any supergroup) and to own their own property. The supergroup has a below average ethnic mix and above average proportion of UK and Irish born residents. Residents are far more likely to be represented in older age groups than nationally. The median age of 46 years is the highest of all the supergroups. Rates of divorce or separation are lower than nationally and the proportion of persons aged 16 years and over with higher qualifications is above the national average.</p>

<p>Unemployment rates are below the national average, whilst employed residents are noticeably more likely to work in the agriculture, forestry and fishing industries. Households are more likely to own two or more cars or vans and to use private transport to get to work. </p>`;

var pp3 = `<p>The population of this supergroup typically live largely within cities, fringes of cities or in other urban areas across the UK.</p>

<p>Residents are more likely to live in a flat (a quarter of all households do so). The supergroup has an above average ethnic mix and slightly below average proportion of UK and Irish born residents. Residents are more likely to be represented in the younger age groups than nationally. Rates of divorce or separation are marginally lower than nationally and the proportion of persons aged 16 years and over with higher qualifications is above the national average.</p>

<p>Unemployment rates are below the national average, and for employed residents, they are more likely to work in the information and communication industries and financial-related industries than nationally, to work full-time, and are more likely to travel to work using public transport, though households owning two or more cars are also more prevalent than nationally.</p>`;

var pp4 = `<p>Of the four groups within the supergroup, this group has the lowest population density (26.3 persons per hectare). Residents belonging to this group are more likely to have been born in the UK or Ireland than for the parent supergroup. Households are also more likely to live in a semi-detached property (36.8% of all households) or terraced property (41.5% of all households).</p>

<p>Households are also marginally more likely to own or have shared ownership of a property and to live in socially-rented accommodation (41.4% of households).</p>

<p>For residents in employment, they are marginally more likely than the parent supergroup to use private transport to get to work and more likely to work in the energy, water or air conditioning supply industries than the parent supergroup. </p>`;

var pp5 = `<p>The population of this supergroup typically live largely in industrial areas across the UK and is the largest supergroup in terms of resident population – comprising one-fifth of the total UK population.</p>

<p>Residents are more likely to live in detached, semi-detached or terraced housing (89.2% of all households), and to live in social rented accommodation. The supergroup has a below-average ethnic mix and above-average number of UK and Irish born. Residents are more likely to be represented in the older age groups and the proportion of residents aged over 16 years with higher qualifications is below the national average.</p>

<p>Employed residents are more likely to work in the manufacturing industry and mining, quarrying or construction industries and are more likely to travel to work using private transport than nationally. </p>`;

var pp6 = `<p>The population of this supergroup is very localised in its distribution, concentrated in Inner London, but also parts of Outer London, Birmingham, Bristol, Edinburgh, Glasgow, Manchester and Reading, plus small numbers of SOAs in other cities and major towns.</p>

<p>Areas covered by this supergroup are characterised as having a very high population density (average 93.9 persons per hectare), but covering just 0.2% of the UK land area. Residents are far more likely to live in a flat than nationally (79.2% of all households) and to live in private or socially-rented accommodation. The supergroup has a noticeably high ethnic mix, and below average number of UK and Irish born residents. Residents are far more likely to be represented in the 25 to 44 years age group than nationally and the proportion of persons aged 16 years and over with higher qualifications is above the national average.</p>

<p>Unemployment rates are higher than the national average and for employed residents, they are more likely to work in the information and communication industries (over one-fifth of all workers) and financial-related industries than nationally. Workers are also far more likely to work full-time and to use public transport to travel to work (57.8% of all workers – by far the highest for any supergroup).  </p>`;

var pp7 = `<p>The population of this supergroup are represented in the larger urban areas in the UK, except for Northern Ireland. The distribution of SOAs for this supergroup is noticeably localised.</p>

<p>Residents are more likely to live in terraced housing or flats (70.7% of all households) and to rent either privately or through social housing (half of all households). The supergroup has a noticeably high ethnic mix and below-average number of UK and Irish born.</p>

<p>Residents are far more likely to be represented in the 0 to 4 years and 5 to 14 years age group than nationally. Qualification levels are similar to national levels.</p>

<p>Unemployment rates are higher than the national average and employed residents are more likely to work in the transport or storage industries, to work part-time and to use public transport to travel to work (just under one-third of all workers).  </p>`;

var pp8 = `<p>The population of this supergroup typically live largely in areas within or close proximity to larger urban areas across the UK.</p>

<p>Residents are much more likely to live in a detached property (46.5% of all households) and to own their own property (88.7% of all households). The supergroup has a below-average ethnic mix and a higher proportion of UK and Irish born residents than nationally. Residents are far more likely to be represented in older age groups than nationally and there is a relatively high median age of 45 years (compared with 39 years nationally). The proportion of persons aged 16 years and over with higher qualifications is above the national average, as is car ownership (nearly half of all households have two or more cars).</p>

<p>Unemployment rates are noticeably below the national average (at 2.5% the lowest for any supergroup) and for employed residents, they are more likely to work in financial-related industries,and to use private transport to travel to work (three-quarters of all workers used private transport – the highest percentage for any supergroup).</p>`;
  
  var pp = "No Desc";
  switch(SOAC11NM) {
  case "Achieving neighbourhoods":
    pp = pp3;
    break;
  case "Affluent communities":
    pp = pp8;
    break;
  case "Ageing rural neighbourhoods":
    pp = pp2;
    break;
  case "Ageing suburbanites":
    pp = pp8;
    break;
  case "Ageing urban communities":
    pp = pp5;
    break;
  case "Asian traits":
    pp = pp3;
    break;
  case "Aspiring urban households":
    pp = pp5;
    break;
  case "Challenged white communities":
    pp = pp4;
    break;
  case "Comfortable neighbourhoods":
    pp = pp5;
    break;
  case "Comfortable suburbia":
    pp = pp8;
    break;
  case "Constrained renters":
    pp = pp4;
    break;
  case "Cosmopolitan student neighbourhoods":
    pp = pp1;
    break;
  case "Endeavouring social renters":
    pp = pp5;
    break;
  case "Hampered neighbourhoods":
    pp = pp4;
    break;
  case "Hard-pressed flat dwellers":
    pp = pp4;
    break;
  case "Highly qualified professionals":
    pp = pp3;
    break;
  case "Households in terraces and flats":
    pp = pp3;
    break;
  case "Inner city cosmopolitan":
    pp = pp6;
    break;
  case "Primary sector workers":
    pp = pp5;
    break;
  case "Prospering countryside life":
    pp = pp2;
    break;
  case "Remoter communities":
    pp = pp2;
    break;
  case "Rural traits":
    pp = pp2;
    break;
  case "Urban cultural mix":
    pp = pp7;
    break;
  case "Young ethnic communities":
    pp = pp7;
    break;
  default:
    pp = `<p>No Description</p>`;
  } 
  
  document.getElementById("penportsup").innerHTML = pp;
}



