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

manageCharts =  function (locationId){
  console.log("Managing Charts");
  
  const jsonurls = [
    'https://pbcc.blob.core.windows.net/pbcc-data/historical_emissions/v1/' + locationId + '.json',
    'https://pbcc.blob.core.windows.net/pbcc-data/population/' + locationId + '.json',
    'https://pbcc.blob.core.windows.net/pbcc-data/lsoa_overview/v1/' + locationId + '.json',
    'https://pbcc.blob.core.windows.net/pbcc-data/la_emissions/v1/' + 'GB' + '.json'
  ];
  
  
  
  Promise.all(jsonurls.map(capUi.fetchJSON))
    .then(([historicalData, populationData,OverviewData,GBData]) => {
        locationData = historicalData;
        populationLocationData = populationData;
        lsoaOverviewData = OverviewData[0];
        gbHistoricalData = GBData;
        
        const jsonurls2 = [
          'https://pbcc.blob.core.windows.net/pbcc-data/oac_emissions/v1/' + lsoaOverviewData.lsoa_class_code + '.json',
          'https://pbcc.blob.core.windows.net/pbcc-data/la_emissions/v1/' + lsoaOverviewData.LAD25CD + '.json'
        ];
        
        Promise.all(jsonurls2.map(capUi.fetchJSON))
        .then(([laData, oacData]) => {
            laHistoricalData = laData;
            oacHistoricalData = oacData;
    
            makeChartHistorical();
            makeChartPopulation();
        })

    })
    .catch(error => {
        alert('Failed to load one or more datasets. Please try refreshing the page.');
        console.error(error);
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
}

/*
maketableOverview = function(){
  //TODO: find other heating GRADE in data
  console.log("Hi");
  
  document.getElementById("data_total_emissions_percap").innerHTML = locationData.tkp2019;
  document.getElementById("data_elec_emissions_household").innerHTML = locationData.dekp2019;
  document.getElementById("data_gas_emissions_household").innerHTML = locationData.dgkp2019;
  document.getElementById("data_other_heating_emissions").innerHTML = locationData.hokp2019;
  document.getElementById("data_car_emissions").innerHTML = locationData.cep2019;
  document.getElementById("data_van_emissions").innerHTML = locationData.vep2019;
  document.getElementById("data_flights_emissions").innerHTML = locationData.Cfkp2019;
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
*/

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

  
	historicalChart = new Chart(document.getElementById('historical-chart').getContext('2d'), {
    type: 'bar',
		data: {
		  labels: data.labels.filter(d => d.label != 'Goods & Services'),
		  datasets: data.datasets.filter(d => d.label != 'Goods & Services')
		},
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
			plugins: {
          legend: {
              position: 'right',
              reverse: true,
              labels: {
                font: {
                    size: 8
                }
              }
          }
      },
			responsive: true,
			maintainAspectRatio: false
		}
  });
  
  /*
  const overviewData1 = {
    labels: locationData['year'],
    datasets: [
      ...data.datasets,
      ...data_la.datasets,
      ...data_oac.datasets,
      ...data_gb.datasets
    ]
  };
  
  const overviewData = {
  labels: ['This Area'],
  datasets: overviewData1.datasets
    .filter(ds => !ds.label.includes('Goods & Services'))
    .map(ds => ({
      ...ds,
      data: [ds.data[yearIndex]],
      gradelabel: Array.isArray(ds.gradelabel) ? ds.gradelabel[yearIndex] : ds.gradelabel
    }))
  };
  */
  
  const data_overview = {datasets: []};

  component.forEach(comp => {
		data_overview.datasets.push({
			label: comp[0],
			data: [locationData[comp[1]][yearIndex], laHistoricalData[comp[1]][yearIndex],  oacHistoricalData[comp[1]][yearIndex], gbHistoricalData[comp[1]][yearIndex]],
			//data:locationData[comp[1]],
			backgroundColor: comp[2],
			borderColor: comp[3],
			borderWidth: 1,
			stack: 'Stack 0'
		});
	});
	
	data_overview.datasets = data_overview.datasets.filter(d => !d.label.includes('Goods & Services'));
	
	data_overview.labels = ['This Area','Local Authority','Similar Areas','Great Britain'];
  
  console.log(data_overview);
  
  overviewChart = new Chart(document.getElementById('overview-chart').getContext('2d'), {
    type: 'bar',
		data: data_overview,
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
			plugins: {
          legend: {
              position: 'right',
              reverse: true,
              labels: {
                font: {
                    size: 8
                }
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
					};
					
	// Lables above bar plugin
	const taxLabelPlugin = {
  id: 'taxLabelPlugin',
  afterDatasetsDraw(chart, args, options) {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((bar, index) => {
          const value = dataset.gradelabel[index];
          ctx.save();
          ctx.fillStyle = 'black';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(`${value}`, bar.x, bar.y - 5);
          ctx.restore();
        });
      });
    }
  };
  
  function makeStandardConsumptionChart(id,filter){
    const chart = new Chart(document.getElementById(id).getContext('2d'), {
      type: 'bar',
  		data: {
        labels: combinedData.labels,
        datasets: combinedData.datasets
        .filter(d => d.label.includes(filter))
        .map(d => ({ ...d, label: d.standardLabel }))
      },
  		options: barChartOptions,
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

  
  console.log(data);
  
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

document.getElementById("defaultOpen").click();

