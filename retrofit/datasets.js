// Data definitions, i.e. layers, charts, etc.
// For Retrofit Tool
const datasets_extra = {
	
	// Data layers
	layers: {
	  
	  zones: {
			'id': 'zones',
			'type': 'fill',
			'source': {
				'type': 'vector',
				//'url': 'pmtiles://%tileserverUrl/zones_retrofit_20251124.pmtiles',
				'url': 'pmtiles://zones_retrofit.pmtiles',
				},
			'source-layer': 'zones',
			'paint': {
				'fill-color': '#9c9898',
				'fill-opacity': 0.8,
				'fill-outline-color': '#000000'
			}
		},
		
	  postcodes: {
			'id': 'postcodes',
			'type': 'fill',
			'source': {
			'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/postcodes.pmtiles',
				},
			'source-layer': 'postcodes',
			'paint': {
				'fill-color': '#9c9898',
				'fill-opacity': 0.8,
				'fill-outline-color': '#000000'
			}
		},
		
		epc_dom: {
			'id': 'epc_dom',
			'type': 'circle',
			'source': {
				'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/epc_dom_20260113.pmtiles',
				},
			'source-layer': 'epc_dom',
			'paint': {
			  // make circles larger as the user zooms from z12 to z22
        'circle-radius': {
          'base': 2.5,
          'stops': [
            [8, 3],
            [22, 180]
          ]
        }
			}
		},
		
		
		epc_nondom: {
			'id': 'epc_nondom',
			'type': 'circle',
			'source': {
			'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/epc_nondom_20260113.pmtiles',
				},
			'source-layer': 'epc_nondom',
			'paint': {
			  // make circles larger as the user zooms from z12 to z22
        'circle-radius': {
          'base': 2.5,
          'stops': [
            [8, 3],
            [22, 180]
          ]
        }
			}
		},

		uprn_unknown: {
			'id': 'uprn_unknown',
			'type': 'circle',
			'source': {
			'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/uprn_unknown_20260113.pmtiles',
				},
			'source-layer': 'uprn_unknown',
			'paint': {
				'circle-color': '#ff0000ff',
			  	// make circles larger as the user zooms from z12 to z22
				'circle-radius': {
				'base': 2.5,
				'stops': [
					[8, 3],
					[22, 180]
				]
				}
			}
		}
	},
	
	// Layer styling callbacks functions, each defined below
	layerStyling: {
	  zones: zonesStyling,
	  postcodes:	postcodesStyling,
	  epc_dom:    EPCDomStyling,
	  epc_nondom: EPCNonDomStyling
	  
	},
	
	
	// #!# These need to be merged with lineColours
	legends: {
		postcodes: {
				'Grade': [
					['A+','#313695'],
				['A' ,'#4575b4'],
				['A-','#4575b4'],
				['B+','#74add1'],
				['B' ,'#abd9e9'],
				['B-','#abd9e9'],
				['C+','#e0f3f8'],
				['C' ,'#e0f3f8'],
				['C-','#ffffbf'],
				['D+','#ffffbf'],
				['D' ,'#fee090'],
				['D-','#fee090'],
				['E+','#fdae61'],
				['E' ,'#fdae61'],
				['E-','#f46d43'],
				['F+','#d73027'],
				['F' ,'#d73027'],
				['F-','#a50026']
			]
		},
		epc_dom: {
			'cur_rate': [
				['A','#0e7e58'],
  			['B' ,'#2aa45b'],
  			['C','#8cbc42'],
  			['D','#f6cc15'],
  			['E' ,'#f2a867'],
  			['F','#f17e23'],
  			['G','#e31d3e']
			],
			'b_type': [
				['Detached','#1f78b4'],
				['Semi-Detached' ,'#33a02c'],
				['Mid-Terrace','#e31a1c'],
				['Enclosed Mid-Terrace','#ff7f00'],
				['End-Terrace' ,'#6a3d9a'],
				['Enclosed End-Terrace','#b15928']
			],
			'p_type': [
				['Flat','#e31a1c'],
				['House' ,'#33a02c'],
				['Maisonette','#1f78b4'],
				['Bungalow','#6a3d9a'],
				['Park home' ,'#ff7f00']
			],
			'tenure': [
				['Rented (social)','#1f78b4'],
				['Rented (private)','#e31a1c'],
				['Owner occupied' ,'#33a02c'],
				['Missing' ,'#000000'],
				['Unknown','#999898']
			],
			'age': [
				['<1900','#9e0142'],
				['1900-1929' ,'#d53e4f'],
				['1930-1949','#f46d43'],
				['1950-1966','#fdae61'],
				['1967-1975' ,'#fee08b'],
				['1976-1982','#ffffbf'],
				['1983-1990','#e6f598'],
				['1991-1995','#abdda4'],
				['1996-2002' ,'#66c2a5'],
				['2003-2006','#3288bd'],
				['2007-2011','#5e4fa2'],
				['2012-2021','#934fa2'],
				['>2022','#c259a7']
			],
			'year': [
				['<2014','#e31d3e'],
				['2016','#f17e23'],
				['2018','#f2a867'],
				['2020','#f6cc15'],
				['2022','#8cbc42'],
				['2024','#0e7e58']
			],
			'area': [
				['<40','#4d9221'],
				['40-60' ,'#7fbc41'],
				['60-80','#b8e186'],
				['80-100','#e6f5d0'],
				['100-120' ,'#fde0ef'],
				['120-140','#f1b6da'],
				['140-160','#de77ae'],
				['>160','#c51b7d']
			],
			
			'floor_ee': [
				['Very Good','#2c7bb6'],
				['Good' ,'#abd9e9'],
				['Average','#ffffbf'],
				['Poor','#fdae61'],
				['Very Poor' ,'#d7191c']
			],
			'water_ee': [
				['Very Good','#2c7bb6'],
				['Good' ,'#abd9e9'],
				['Average','#ffffbf'],
				['Poor','#fdae61'],
				['Very Poor' ,'#d7191c']
			],
			'wind_ee': [
				['Very Good','#2c7bb6'],
				['Good' ,'#abd9e9'],
				['Average','#ffffbf'],
				['Poor','#fdae61'],
				['Very Poor' ,'#d7191c']
			],
			'wall_ee': [
				['Very Good','#2c7bb6'],
				['Good' ,'#abd9e9'],
				['Average','#ffffbf'],
				['Poor','#fdae61'],
				['Very Poor' ,'#d7191c']
			],
			'roof_ee': [
				['Very Good','#2c7bb6'],
				['Good' ,'#abd9e9'],
				['Average','#ffffbf'],
				['Poor','#fdae61'],
				['Very Poor' ,'#d7191c']
			],
			'heat_ee': [
				['Very Good','#2c7bb6'],
				['Good' ,'#abd9e9'],
				['Average','#ffffbf'],
				['Poor','#fdae61'],
				['Very Poor' ,'#d7191c']
			],
			'con_ee': [
				['Very Good','#2c7bb6'],
				['Good' ,'#abd9e9'],
				['Average','#ffffbf'],
				['Poor','#fdae61'],
				['Very Poor' ,'#d7191c']
			],
			'light_ee': [
				['Very Good','#2c7bb6'],
				['Good' ,'#abd9e9'],
				['Average','#ffffbf'],
				['Poor','#fdae61'],
				['Very Poor' ,'#d7191c']
			],
		  	'sol_wat': [
				['yes','#fdae61'],
  				['no','#2c7bb6'],
				['No data','#000000']
			],
			'pv': [
				['yes','#fdae61'],
  				['no','#2c7bb6'],
				['No data','#000000']
			],
			'price_2024': [
				['<£200k','#276419'],
				['£200-300k','#4d9221'],
				['£300-400k','#7fbc41'],
				['£400-500k','#b8e186'],
				['£500-600k','#e6f5d0'],
				['£600-800k','#fde0ef'],
				['£800-1000k','#f1b6da'],
				['£1-2m','#de77ae'],
				['£2-3m','#c51b7d'],
				['>£3m','#8e0152'],
				['No Data','#000000']
			],
			'freehold': [
				['Freehold','#1f78b4'],
				['Leasehold','#e31a1c'],
				['No Data','#000000']
			]
			
		},
		zones: {
			'epc_score_avg': [
				['0-50','#d73027'],
				['50-55' ,'#fc8d59'],
				['55-60','#fee08b'],
				['60-65','#ffffbf'],
				['65-70','#d9ef8b'],
				['70-80' ,'#91cf60'],
				['80-100','#1a9850']
			],
			'modal_age': [
				['<1900','#9e0142'],
				['1900-1929' ,'#d53e4f'],
				['1930-1949','#f46d43'],
				['1950-1966','#fdae61'],
				['1967-1975' ,'#fee08b'],
				['1976-1982','#ffffbf'],
				['1983-1990','#e6f598'],
				['1991-1995','#abdda4'],
				['1996-2002' ,'#66c2a5'],
				['2003-2006','#3288bd'],
				['2007-2011','#5e4fa2'],
				['2012-2021','#934fa2'],
				['>2022','#c259a7']
			],
			'floor_area_avg': [
				['<40','#4d9221'],
				['40-60' ,'#7fbc41'],
				['60-80','#b8e186'],
				['80-100','#e6f5d0'],
				['100-120' ,'#fde0ef'],
				['120-140','#f1b6da'],
				['140-160','#de77ae'],
				['>160','#c51b7d']
			],
			'modal_wall': [
				['Very Good','#2c7bb6'],
				['Good' ,'#abd9e9'],
				['Average','#ffffbf'],
				['Poor','#fdae61'],
				['Very Poor' ,'#d7191c']
			],
			'modal_roof': [
				['Very Good','#2c7bb6'],
				['Good' ,'#abd9e9'],
				['Average','#ffffbf'],
				['Poor','#fdae61'],
				['Very Poor' ,'#d7191c'],
				['Another property above' ,'#4d9221']
			],
			'modal_heat': [
				['Very Good','#2c7bb6'],
				['Good' ,'#abd9e9'],
				['Average','#ffffbf'],
				['Poor','#fdae61'],
				['Very Poor' ,'#d7191c']
			],
			'modal_window': [
				['Very Good','#2c7bb6'],
				['Good' ,'#abd9e9'],
				['Average','#ffffbf'],
				['Poor','#fdae61'],
				['Very Poor' ,'#d7191c']
			],
			'modal_mainheat': [
				['Community','#377eb8'],
				['Gas boiler' ,'#e41a1c'],
				['Heat pump','#4daf4a'],
				['Oil boiler','#984ea3'],
				['Room heater' ,'#ffff33'],
				['Storage heater' ,'#ff7f00']
			],
			'modal_mainfuel': [
				['Biomass','#4daf4a'],
				['Electricity' ,'#377eb8'],
				['LPG','#ff7f00'],
				['Mains gas','#e41a1c'],
				['Oil' ,'#984ea3']
			],
			'modal_floord': [
				['Another property below','#225ea8'],
				['Solid insulated' ,'#b2e2e2'],
				['Solid limited insulation','#66c2a4'],
				['Solid uninsulated','#238b45'],
				['Suspended limited insulation' ,'#df65b0'],
				['Suspended uninsulated' ,'#ce1256']
			],
			'modal_type': [
				['Flat' ,'#e31a1c'],
				['House detached' ,'#c2e699'],
				['House semi-detached' ,'#78c679'],
				['House end-terrace' ,'#31a354'],
				['House mid-terrace' ,'#006837'],
				['Bungalow detached','#fbb4b9'],
				['Bungalow semi-detached','#f768a1'],
				['Bungalow end-terrace' ,'#c51b8a'],
				['Bungalow mid-terrace','#7a0177'],
				['Maisonette' ,'#1f78b4'],
				['Park home' ,'#fa7c00']
			],
			'modal_tenure': [
				['Rented (social)','#1f78b4'],
				['Rented (private)','#e31a1c'],
				['Owner occupied' ,'#33a02c'],
				['Unknown','#999898']
			],
		  	'percent_EPC': [
				['<30%','#ffffb2'],
				['30-50%' ,'#fed976'],
				['50-60%','#feb24c'],
				['60-70%','#fd8d3c'],
				['70-80%' ,'#fc4e2a'],
				['80-90%','#e31a1c'],
				['>90%','#b10026']
			],
			'price_2024': [
				['<£200k','#276419'],
				['£200-300k','#4d9221'],
				['£300-400k','#7fbc41'],
				['£400-500k','#b8e186'],
				['£500-600k','#e6f5d0'],
				['£600-800k','#fde0ef'],
				['£800-1000k','#f1b6da'],
				['£1-2m','#de77ae'],
				['£2-3m','#c51b7d'],
				['>£3m','#8e0152'],
				['No Data','#000000']
			],
			'house_income_ratio': [
				['<2','#4d9221'],
				['2-4','#7fbc41'],
				['4-6','#b8e186'],
				['6-8','#e6f5d0'],
				['8-10','#fde0ef'],
				['10-12','#f1b6da'],
				['12-14','#de77ae'],
				['>14','#c51b7d']
			],
			'median_gas_kwh': [
				['<6000 kWh','#4575b4'],
				['6000-8000 kWh','#91bfdb'],
				['8000-10000 kWh','#e0f3f8'],
				['10000-12000 kWh','#ffffbf'],
				['12000-14000 kWh','#fee090'],
				['14000-16000 kWh','#fc8d59'],
				['>16000 kWh','#d73027'],
				['No data','#000000']
			],
			'median_elec_kwh': [
				['<1000 kWh','#4575b4'],
				['1500-2000 kWh','#91bfdb'],
				['2000-2500 kWh','#e0f3f8'],
				['2500-3000 kWh','#ffffbf'],
				['3000-3500 kWh','#fee090'],
				['3500-4000 kWh','#fc8d59'],
				['>4000 kWh','#d73027'],
				['No data','#000000'],
			],
			'fuelcost_bivaraite': {
				'mode': 'bivariate',
				'labels': ['Bills','Income'],
				'colours': [
					[11,'#F07621'],
					[12,'#F3896D'],		
					[13,'#F597A5'],
					[14,'#EF5091'],
					[15,'#E90C7E'],
					[21,'#DEB15C'],
					[22,'#EDBD9D'],
					[23,'#F8CBD1'],
					[24,'#E991BB'],
					[25,'#D959A6'],
					[31,'#CEE28D'],
					[32,'#E8F0CC'],
					[33,'#FAFAFA'],
					[34,'#E3CBE1'],
					[35,'#CC9BC8'],
					[41,'#7BBC6D'],
					[42,'#AAD2B0'],
					[43,'#D6E7EB'],
					[44,'#BCB3D2'],
					[45,'#9D7CB8'],
					[51,'#0D8943'],
					[52,'#51A788'],
					[53,'#9BC8D2'],
					[54,'#7A8BB9'],
					[55,'#5950A1']
				]
			}
			
		},
		epc_nondom: {
			'band': [
				['A','#0e7e58'],
				['B' ,'#2aa45b'],
				['C','#8cbc42'],
				['D','#f6cc15'],
				['E' ,'#f2a867'],
				['F','#f17e23'],
				['G','#e31d3e']
			],
			'transaction': [
				['Mandatory issue (Display in public building)','#1f78b4'],
				['Mandatory issue (Marketed sale)' ,'#33a02c'],
				['Mandatory issue (Non-marketed sale)','#e31a1c'],
				['Mandatory issue (Property on construction)','#ff7f00'],
				['Mandatory issue (Property to let)' ,'#6a3d9a'],
				['Voluntary (No legal requirement for an EPC)','#b15928'],
				['Voluntary re-issue (A valid EPC is already lodged)','#ffff99']
			],
			'year': [
				['<2014','#e31d3e'],
  				['2016','#f17e23'],
  				['2018','#f2a867'],
  				['2020','#f6cc15'],
  				['2022','#8cbc42'],
  				['2024','#0e7e58']
			],
			'area': [
				['<40','#4d9221'],
  				['40-60' ,'#7fbc41'],
  				['60-80','#b8e186'],
  				['80-100','#e6f5d0'],
  				['100-120' ,'#fde0ef'],
  				['120-140','#f1b6da'],
  				['140-160','#de77ae'],
  				['>160','#c51b7d']
			],
			'price_2024': [
				['<£200k','#276419'],
				['£200-300k','#4d9221'],
				['£300-400k','#7fbc41'],
				['£400-500k','#b8e186'],
				['£500-600k','#e6f5d0'],
				['£600-800k','#fde0ef'],
				['£800-1000k','#f1b6da'],
				['£1-2m','#de77ae'],
				['£2-3m','#c51b7d'],
				['>£3m','#8e0152'],
				['No Data','#000000']
			]
		},
	},
	
	lineColours: {
	  postcodes: {
			'Grade': [
				'A+','#313695',
				'A' ,'#4575b4',
				'A-','#4575b4',
				'B+','#74add1',
				'B' ,'#abd9e9',
				'B-','#abd9e9',
				'C+','#e0f3f8',
				'C' ,'#e0f3f8',
				'C-','#ffffbf',
				'D+','#ffffbf',
				'D' ,'#fee090',
				'D-','#fee090',
				'E+','#fdae61',
				'E' ,'#fdae61',
				'E-','#f46d43',
				'F+','#d73027',
				'F' ,'#d73027',
				'F-','#a50026',
				'#000000'
			]
		},
		
	
		zones: {
			'epc_score_avg': [
				'0-50','#d73027',
				'50-55' ,'#fc8d59',
				'55-60','#fee08b',
				'60-65','#ffffbf',
				'65-70','#d9ef8b',
				'70-80' ,'#91cf60',
				'80-100','#1a9850',
				'#000000'
			],
			'modal_age': [
				'pre1900','#9e0142',
				'19001929' ,'#d53e4f',
				'19301949','#f46d43',
				'19501966','#fdae61',
				'19671975' ,'#fee08b',
				'19761982','#ffffbf',
				'19831990','#e6f598',
				'19911995','#abdda4',
				'19962002' ,'#66c2a5',
				'20032006','#3288bd',
				'20072011','#5e4fa2',
				'20122021','#934fa2',
				'post2022','#c259a7',
				'#000000'
			],
			'floor_area_avg': [
			  	'0-40','#4d9221',
				'40-60' ,'#7fbc41',
				'60-80','#b8e186',
				'80-100','#e6f5d0',
				'100-120' ,'#fde0ef',
				'120-140','#f1b6da',
				'140-160','#de77ae',
				'160-500','#c51b7d',
				'#000000'
			],
			'modal_wall': [
				'verygood','#2c7bb6',
				'good' ,'#abd9e9',
				'average','#ffffbf',
				'poor','#fdae61',
				'verypoor' ,'#d7191c',
				'#000000'
			],
			'modal_roof': [
				'verygood','#2c7bb6',
				'good' ,'#abd9e9',
				'average','#ffffbf',
				'poor','#fdae61',
				'verypoor' ,'#d7191c',
				'above' ,'#4d9221',
				'#000000'
			],
			'modal_heat': [
				'verygood','#2c7bb6',
				'good' ,'#abd9e9',
				'average','#ffffbf',
				'poor','#fdae61',
				'verypoor' ,'#d7191c',
				'#000000'
			],
			'modal_window': [
				'verygood','#2c7bb6',
				'good' ,'#abd9e9',
				'average','#ffffbf',
				'poor','#fdae61',
				'verypoor' ,'#d7191c',
				'#000000'
			],
			'modal_mainheat': [
				'community','#377eb8',
				'gasboiler' ,'#e41a1c',
				'heatpump','#4daf4a',
				'oilboiler','#984ea3',
				'roomheater' ,'#ffff33',
				'storageheater' ,'#ff7f00',
				'#000000'
			],
			'modal_mainfuel': [
				'biomass','#4daf4a',
				'electric' ,'#377eb8',
				'lpg','#ff7f00',
				'mainsgas','#e41a1c',
				'oil' ,'#984ea3',
				'#000000'
			],
			'modal_floord': [
				'below','#225ea8',
				'solidinsulated' ,'#b2e2e2',
				'solidlimitedinsulated','#66c2a4',
				'soliduninsulated','#238b45',
				'suspendedlimitedinsulated' ,'#df65b0',
				'suspendeduninsulated' ,'#ce1256',
				'#000000'
			],
			'modal_type': [
			  	'flat' ,'#e31a1c',
				'house_detached' ,'#c2e699',
				'house_semi' ,'#78c679',
				'house_endterrace' ,'#31a354',
				'house_midterrace' ,'#006837',
				'bungalow_detached','#fbb4b9',
				'bungalow_semi','#f768a1',
				'bungalow_endterrace' ,'#c51b8a',
				'bungalow_midterrace','#7a0177',
				'maisonette' ,'#1f78b4',
				'parkhome' ,'#fa7c00',
				'#000000'
			],
			'modal_tenure': [
				'socialrent','#1f78b4',
				'owner' ,'#33a02c',
				'privaterent','#e31a1c',
				'unknown','#999898',
				'#000000'
			],
		  	'percent_EPC': [
				'0-30','#ffffb2',
				'30-50' ,'#fed976',
				'50-60','#feb24c',
				'60-70','#fd8d3c',
				'70-80' ,'#fc4e2a',
				'80-90','#e31a1c',
				'90-200','#b10026',
				'#000000'
			],
			'price_2024': [
				0,'#276419',
				200000,'#4d9221',
				300000,'#7fbc41',
				400000,'#b8e186',
				500000,'#e6f5d0',
				600000,'#fde0ef',
				800000,'#f1b6da',
				1000000,'#de77ae',
				2000000,'#c51b7d',
				3000000,'#8e0152'
			],	
			'house_income_ratio': [
				0,'#4d9221',
				2,'#7fbc41',
				4,'#b8e186',
				6,'#e6f5d0',
				8,'#fde0ef',
				10,'#f1b6da',
				12,'#de77ae',
				14,'#c51b7d'
			],	
			'median_gas_kwh': [
				0,'#000000',
				1,'#4575b4',
				6000,'#91bfdb',
				8000,'#e0f3f8',
				10000,'#ffffbf',
				12000,'#fee090',
				14000,'#fc8d59',
				16000,'#d73027'
			],	
			'median_elec_kwh': [
				0,'#000000',
				1,'#4575b4',
				1500,'#91bfdb',
				2000,'#e0f3f8',
				2500,'#ffffbf',
				3000,'#fee090',
				3500,'#fc8d59',
				4000,'#d73027'
			],	
			'fuelcost_bivaraite': [
				11,'#F07621',
				12,'#F3896D',		
				13,'#F597A5',
				14,'#EF5091',
				15,'#E90C7E',
				21,'#DEB15C',
				22,'#EDBD9D',
				23,'#F8CBD1',
				24,'#E991BB',
				25,'#D959A6',
				31,'#CEE28D',
				32,'#E8F0CC',
				33,'#FAFAFA',
				34,'#E3CBE1',
				35,'#CC9BC8',
				41,'#7BBC6D',
				42,'#AAD2B0',
				43,'#D6E7EB',
				44,'#BCB3D2',
				45,'#9D7CB8',
				51,'#0D8943',
				52,'#51A788',
				53,'#9BC8D2',
				54,'#7A8BB9',
				55,'#5950A1',
				'#000000'
			]
			
		},
		
		epc_dom: {
			'cur_rate': [
				'A','#0e7e58',
				'B' ,'#2aa45b',
				'C','#8cbc42',
				'D','#f6cc15',
				'E' ,'#f2a867',
				'F','#f17e23',
				'G','#e31d3e',
				'#000000'
			],
			'b_type': [
				'Detached','#1f78b4',
				'Semi-Detached' ,'#33a02c',
				'Mid-Terrace','#e31a1c',
				'Enclosed Mid-Terrace','#ff7f00',
				'End-Terrace' ,'#6a3d9a',
				'Enclosed End-Terrace','#b15928',
				'#000000'
			],
			'p_type': [
				'Flat','#e31a1c',
				'House' ,'#33a02c',
				'Maisonette','#1f78b4',
				'Bungalow','#6a3d9a',
				'Park home' ,'#ff7f00',
				'#000000'
			],
			'age': [
				'before 1900','#9e0142',
				'1900-1929' ,'#d53e4f',
				'1930-1949','#f46d43',
				'1950-1966','#fdae61',
				'1967-1975' ,'#fee08b',
				'1976-1982','#ffffbf',
				'1983-1990','#e6f598',
				'1991-1995','#abdda4',
				'1996-2002' ,'#66c2a5',
				'2003-2006','#3288bd',
				'2007-2011','#5e4fa2',
				'2012-2021','#934fa2',
				'2022 onwards','#c259a7',
				'#000000'
			],
			'year': [
				2014,'#e31d3e',
				2016,'#f17e23',
				2018,'#f6cc15',
				2020 ,'#f2a867',
				2022,'#8cbc42',
				2024,'#0e7e58'
			],
			'area': [
				0,'#4d9221',
				40,'#7fbc41',
				60,'#b8e186',
				80,'#e6f5d0',
				100,'#fde0ef',
				120,'#f1b6da',
				140,'#de77ae',
				160,'#c51b7d'
			],		
			
			'floor_ee': [
				'Very Good','#2c7bb6',
				'Good' ,'#abd9e9',
				'Average','#ffffbf',
				'Poor','#fdae61',
				'Very Poor' ,'#d7191c',
				'#000000'
			],
			'water_ee': [
				'Very Good','#2c7bb6',
				'Good' ,'#abd9e9',
				'Average','#ffffbf',
				'Poor','#fdae61',
				'Very Poor' ,'#d7191c',
				'#000000'
			],
			'wind_ee': [
				'Very Good','#2c7bb6',
				'Good' ,'#abd9e9',
				'Average','#ffffbf',
				'Poor','#fdae61',
				'Very Poor' ,'#d7191c',
				'#000000'
			],
			'wall_ee': [
				'Very Good','#2c7bb6',
				'Good' ,'#abd9e9',
				'Average','#ffffbf',
				'Poor','#fdae61',
				'Very Poor' ,'#d7191c',
				'#000000'
			],
			'roof_ee': [
				'Very Good','#2c7bb6',
				'Good' ,'#abd9e9',
				'Average','#ffffbf',
				'Poor','#fdae61',
				'Very Poor' ,'#d7191c',
				'#000000'
			],
			'heat_ee': [
				'Very Good','#2c7bb6',
				'Good' ,'#abd9e9',
				'Average','#ffffbf',
				'Poor','#fdae61',
				'Very Poor' ,'#d7191c',
				'#000000'
			],
			'con_ee': [
				'Very Good','#2c7bb6',
				'Good' ,'#abd9e9',
				'Average','#ffffbf',
				'Poor','#fdae61',
				'Very Poor' ,'#d7191c',
				'#000000'
			],
			'light_ee': [
				'Very Good','#2c7bb6',
				'Good' ,'#abd9e9',
				'Average','#ffffbf',
				'Poor','#fdae61',
				'Very Poor' ,'#d7191c',
				'#000000'
			],
			'sol_wat': [
					'yes','#fdae61',
					'no','#2c7bb6',
					'#000000'
				],
			'pv': [
					'yes','#fdae61',
					'no','#2c7bb6',
					'#000000'
				],
			'price_2024': [
				0,'#276419',
				200000,'#4d9221',
				300000,'#7fbc41',
				400000,'#b8e186',
				500000,'#e6f5d0',
				600000,'#fde0ef',
				800000,'#f1b6da',
				1000000,'#de77ae',
				2000000,'#c51b7d',
				3000000,'#8e0152'
			],
			'tenure': [
				'rented (social)','#1f78b4',
				'owner-occupied' ,'#33a02c',
				'rented (private)','#e31a1c',
				'unknown','#999898',
				'#000000'
			],
			'freehold': [
				'F','#2c7bb6',
				'L' ,'#d7191c',
				'#000000'
			],
			
		},
		
		epc_nondom: {
			'band': [
				'A','#0e7e58',
				'B' ,'#2aa45b',
				'C','#8cbc42',
				'D','#f6cc15',
				'E' ,'#f2a867',
				'F','#f17e23',
				'G','#e31d3e',
				'#000000'
			],
			'transaction': [
				'Mandatory issue (Display in public building)','#1f78b4',
				'Mandatory issue (Marketed sale)' ,'#33a02c',
				'Mandatory issue (Non-marketed sale)','#e31a1c',
				'Mandatory issue (Property on construction)','#ff7f00',
				'Mandatory issue (Property to let)' ,'#6a3d9a',
				'Voluntary (No legal requirement for an EPC)','#b15928',
				'Voluntary re-issue (A valid EPC is already lodged)','#ffff99',
				'#000000'
			],
			'year': [
				2014,'#e31d3e',
				2016,'#f17e23',
				2018,'#f6cc15',
				2020 ,'#f2a867',
				2022,'#8cbc42',
				2024,'#0e7e58'
			],
			'area': [
				0,'#4d9221',
				40 ,'#7fbc41',
				60,'#b8e186',
				80,'#e6f5d0',
				100 ,'#fde0ef',
				120,'#f1b6da',
				140,'#de77ae',
				160,'#c51b7d'
			],
			'price_2024': [
				0,'#276419',
				200000,'#4d9221',
				300000,'#7fbc41',
				400000,'#b8e186',
				500000,'#e6f5d0',
				600000,'#fde0ef',
				800000,'#f1b6da',
				1000000,'#de77ae',
				2000000,'#c51b7d',
				3000000,'#8e0152'
			]
			
		},
	},
	
	// Chart definitions, indexed by map layer ID
	charts: {
	  postcodes: {
	    postcodes : {
	    // Data fields
  			// #!# Should use a main server URL setting
  			dataUrl: 'https://pbcc.blob.core.windows.net/pbcc-data/Postcode/%id.json',
  			propertiesField: 'postcode',
  			titleField: 'postcode',
  			
  			// Title
  			titlePrefix: 'Postcode Summary: ',
  			
  			charts: [
  				[
  					// Access Proximity
  					'access_proximity',
  					'Access Proximity',
  					'Description goes here',
  					'Access by public transport'
  				]
  		  ]
	  }
	  },
	  
	  zones: {
	    zones : {
	    // Data fields
  			// #!# Should use a main server URL setting
  			dataUrl: 'https://pbcc.blob.core.windows.net/pbcc-data/epc_dom/%id.json',
  			propertiesField: 'LSOA21CD',
  			titleField: 'LSOA21CD',
  			
  			// Title
  			titlePrefix: 'Neighbourhood Summary: ',
  			
  			charts: [
  				[
  					// Access Proximity
  					'access_proximity',
  					'Access Proximity',
  					'Description goes here',
  					'Access by public transport'
  				]
  		  ]
	  }
	  }
	},
	
	// Popups
	popups: {
	  	'epc_dom': {
			layerId: 'epc_dom',
			templateId: 'epc_dom-popup',
			preprocessingCallback: popupCallback,
		},
		'epc_nondom': {
			layerId: 'epc_nondom',
			templateId: 'epc_nondom-popup',
			preprocessingCallback: popupCallback,
		},
		'uprn_unknown': {
			layerId: 'uprn_unknown',
			templateId: 'uprn_unknown-popup',
			preprocessingCallback: popupCallback,
		}
	}
};

//console.log(datasets_common);
const datasets = mergeObjects(datasets_extra, datasets_common);
//const datasets = { ...datasets_common, ...datasets_extra };
//console.log(datasets);

// Function to determine the style column
function getStyleColumn (layerId, datasets)
{
	const style_col_selected = datasets.lineColours.postcodes.hasOwnProperty(layerId) ? layerId : '_';
	return datasets.lineColours.postcodes['Grade'];
}

// Function to determine the style column
function getStyleColumnZones (layerId, datasets)
{
	const style_col_selected = datasets.lineColours.zones.hasOwnProperty(layerId) ? layerId : '_';
	return datasets.lineColours.zones[style_col_selected];
}

// Styling callback for data postcodes (including buildings styling)
function postcodesStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	// Update the legend (even if map layer is off)
	const field = document.querySelector ('select.updatelayer[data-layer="postcodes"][name="field"]').value
	createLegend (datasets.legends.postcodes, "Grade", 'postcodeslegend'); // Fixed Legeng for Grades

	// Set paint properties
	//map.setPaintProperty (layerId, 'fill-color', ['step', ['get', field], getStyleColumn (field, datasets)]);
	//map.setPaintProperty (layerId, 'fill-color', '#000000');
	map.setPaintProperty (layerId, 'fill-color', ['match', ['get', field], ...getStyleColumn (field, datasets)]);
	map.setPaintProperty (layerId, 'fill-opacity', 0.8); 
	
	// Set buildings layer colour/visibility
	const buildingColour = '#9c9898';
	map.setPaintProperty ('buildings', 'fill-extrusion-color', (buildingColour || '#9c9898'));
	map.setLayoutProperty ('buildings', 'visibility', (buildingColour ? 'visible' : 'none'));
	map.setPaintProperty (layerId, 'fill-outline-color', 'rgba(0, 0, 0, 0.2)'); 
	
	
}


// Function to determine the style column
function getEPCDomStyleColumn (layerId, datasets)
{
	const style_col_selected = datasets.lineColours.epc_dom.hasOwnProperty(layerId) ? layerId : '_';
	console.log(style_col_selected);
	console.log(datasets.lineColours.epc_dom[style_col_selected]);
	return datasets.lineColours.epc_dom[style_col_selected];
}

// Styling callback for data epc_dom (including buildings styling)
function EPCDomStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	// Update the legend (even if map layer is off)
	const field = document.querySelector ('select.updatelayer[data-layer="epc_dom"][name="field"]').value

	createLegend (datasets.legends.epc_dom, field, 'epcdomlegend');
	//console.log("Field is ",field);
	const style = getEPCDomStyleColumn (field, datasets);
	//console.log(style);

  let interpolate = ['area', 'year', 'price_2024'];

	// Set paint properties
	if(interpolate.includes(field)){
	  map.setPaintProperty (layerId, 'circle-color', ['interpolate', ['linear'], ['get', field], ...style]);
	} else {
	  map.setPaintProperty (layerId, 'circle-color', ['match', ['get', field], ...style]);
	}

}

// Function to determine the style column
function getEPCNonDomStyleColumn (layerId, datasets)
{
	const style_col_selected = datasets.lineColours.epc_nondom.hasOwnProperty(layerId) ? layerId : '_';
	//console.log(style_col_selected);
	//console.log(datasets.lineColours.epc_dom[style_col_selected]);
	return datasets.lineColours.epc_nondom[style_col_selected];
}

// Styling callback for data epc_dom (including buildings styling)
function EPCNonDomStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	// Update the legend (even if map layer is off)
	const field = document.querySelector ('select.updatelayer[data-layer="epc_nondom"][name="field"]').value

	createLegend (datasets.legends.epc_nondom, field, 'epcnondomlegend');
	//console.log("Field is ",field);
	const style = getEPCNonDomStyleColumn (field, datasets);
	//console.log(style);

  let interpolate = ['area', 'year','price_2024'];

	// Set paint properties
	if(interpolate.includes(field)){
	  map.setPaintProperty (layerId, 'circle-color', ['interpolate', ['linear'], ['get', field], ...style]);
	} else {
	  map.setPaintProperty (layerId, 'circle-color', ['match', ['get', field], ...style]);
	}

}

// Styling callback for data zones (including buildings styling)
function zonesStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	
	console.log("zoneStyling " + layerId);
	
	// Update the legend (even if map layer is off)
	const field = document.querySelector ('select.updatelayer[data-layer="zones"][name="field"]').value
	createLegend (datasets.legends.zones, field, 'zoneslegend'); // Fixed Legeng for Grades
	
	// Get UI state
	const daysymetricMode = document.querySelector ('input.updatelayer[data-layer="zones"][name="daysymetricmode"]').checked;
	
	let interpolate = ['price_2024', 'house_income_ratio','median_gas_kwh','median_elec_kwh'];

	// Set paint properties
	if(interpolate.includes(field)){
	  map.setPaintProperty (layerId, 'fill-color', ['interpolate', ['linear'], ['get', field], ...getStyleColumnZones (field, datasets)]);
	} else {
	  map.setPaintProperty (layerId, 'fill-color', ['match', ['get', field], ...getStyleColumnZones (field, datasets)]);
	}


	//map.setPaintProperty (layerId, 'fill-color', ['match', ['get', field], ...getStyleColumnZones (field, datasets)]);
	map.setPaintProperty (layerId, 'fill-opacity', (daysymetricMode ? 0.1 : 0.8)); // Very faded-out in daysymetric mode, as the buildings are coloured
	map.setPaintProperty (layerId, 'fill-outline-color', 'rgba(0, 0, 0, 0.2)'); 
	
	// Set buildings layer colour/visibility
	const buildingColour = getBuildingsColour(settings);
	map.setPaintProperty ('buildings', 'fill-extrusion-color', (buildingColour || '#9c9898'))
	map.setLayoutProperty ('buildings', 'visibility', (buildingColour ? 'visible' : 'none'));
		
}

// Function to determine the buildings colour
function getBuildingsColour (settings)
{
	// If datazones is off, buildings shown, if vector style, as static colour appropriate to the basemap
	
	if (!document.querySelector ('input.showlayer[data-layer="zones"]').checked) {
		const styleName = document.querySelector('#basemapform input:checked').value;	// Same as nptUi.getBasemapStyle()
		return settings.basemapStyles[styleName].buildingColour;
	}
	
	// If dasymetric mode, use a colour set based on the layer
	if (document.querySelector ('input.updatelayer[data-layer="zones"][name="daysymetricmode"]').checked) {
		const field = document.querySelector ('select.updatelayer[data-layer="zones"][name="field"]').value;

		let interpolate = ['price_2024', 'house_income_ratio','median_gas_kwh','median_elec_kwh'];

		// Set paint properties
		if(interpolate.includes(field)){
			return ['interpolate', ['linear'], ['get', field], ...getStyleColumnZones (field, datasets)];
		} else {
			return ['match', ['get', field], ...getStyleColumnZones (field, datasets)];
		}
	}
	
	// Default to gray
	console.log("Default to gray")
	return '#9c9898';
}





