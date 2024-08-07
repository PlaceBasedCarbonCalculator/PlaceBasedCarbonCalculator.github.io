

function toggleLayer(layerName){
  var checkBox = document.getElementById(layerName.concat('checkbox'));
  // If the checkbox is checked add the layer to the map
  if (checkBox.checked === true){
    switch(layerName) {
      case 'carbon':
        // code block
        switchLayer();;
        break;
      case 'la':
        // code block
        map.addLayer({
            'id': 'la',
            'type': 'line',
            'source': 'la',
            'source-layer': 'la',
            'paint': {
              'line-color': 'rgba(107, 7, 7, 1)',
              'line-width': 2
            }
        });
        break;
      case 'wards':
        // code block
        map.addLayer({
            'id': 'wards',
            'type': 'line',
            'source': 'wards',
            'source-layer': 'wards',
            'paint': {
              'line-color': 'rgba(32, 107, 7, 1)',
              'line-width': 2
            }
        });
        break;
      case 'constituencies':
        // code block
        map.addLayer({
            'id': 'constituencies',
            'type': 'line',
            'source': 'constituencies',
            'source-layer': 'constituencies',
            'paint': {
              'line-color': 'rgba(7, 54, 107, 1)',
              'line-width': 2
            }
        });
        break;
      case 'parish':
        // code block
        map.addLayer({
            'id': 'parish',
            'type': 'line',
            'source': 'parish',
            'source-layer': 'parish',
            'paint': {
              'line-color': 'rgba(107, 7, 99, 1)',
              'line-width': 2
            }
        });
        break;
      case 'pct':
        // code block
        switchPCT();
        break;
      case 'transitstops':
        // code block
        map.addLayer({
            'id': 'transitstops',
            'type': 'circle',
            'source': 'transitstops',
            'source-layer': 'transitstops',
            'paint': {
              // make circles larger as the user zooms from z12 to z22
              'circle-radius': {
                'base': 2.5,
                'stops': [
                  [8, 3],
                  [22, 180]
                ]
              },
              // color circles by ethnicity, using a match expression
              // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
              'circle-stroke-width': 1,
              "circle-color": [
          			'match',
          			['get', 'grade'],
          			'A+','#313695',
          			'A','#4575b4',
          			'A-','#4575b4',
          			'B+','#74add1',
          			'B','#abd9e9',
          			'B-','#abd9e9',
          			'C+','#e0f3f8',
          			'C','#e0f3f8',
          			'C-','#ffffbf',
          			'D+','#ffffbf',
          			'D','#fee090',
          			'D-','#fee090',
          			'E+','#fdae61',
          			'E','#fdae61',
          			'E-','#f46d43',
          			'F+','#d73027',
          			'F','#d73027',
          			'F-','#a50026',
          			/* other */ '#e0e0e0'
          			]
            }
        });
        break;
      case 'centroids':
        // code block
        map.addLayer({
            'id': 'centroids',
            'type': 'circle',
            'source': 'centroids',
            'source-layer': 'centroids',
            'paint': {
              // make circles larger as the user zooms from z12 to z22
              'circle-radius': {
                'base': 5,
                'stops': [
                  [10, 7],
                  [22, 180]
                ]
              },
              // color circles by ethnicity, using a match expression
              // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
              'circle-color': '#000000'
            }
        });
        break;
      case 'postcode':
        // code block
        switchpostcode();
        break;
      case 'epc':
        // code block
        map.addLayer({
            'id': 'epc',
            'type': 'circle',
            'source': 'epc',
            'source-layer': 'epc',
            'paint': {
              // make circles larger as the user zooms from z12 to z22
              'circle-radius': {
                'base': 2.5,
                'stops': [
                  [8, 3],
                  [22, 180]
                ]
              },
              'circle-stroke-width': 1,
              "circle-color": [
          			'match',
          			['get', 'cur_rate'],
          			        'G','#e31d3e',
                        'F','#f17e23',
                        'E','#f2a867',
                        'D','#f6cc15',
                        'C','#8cbc42',
                        'B','#2aa45b',
                        'A','#0e7e58',
          			/* other */ '#e0e0e0'
          			]
            }
        });
        break;
      default:
        console.log('unknown layer selected');
    } 
  } else {
    if (map.getLayer(layerName)) map.removeLayer(layerName);
    if(layerName == 'carbon'){
      document.getElementById("legend").innerHTML = ``;
    }
  }
}

function removeisochrones(){
  if (map.getLayer('isochrones')){
    console.log("removed layer");
    map.removeLayer('isochrones');
    
  }
  
  if(map.getSource('isochrones')){
    console.log("removed source");
    map.removeSource('isochrones');
  }
}

function switchPCT(){
  var checkBox = document.getElementById('pctcheckbox');
  var layerId = document.getElementById("pctinput").value;
  if (checkBox.checked === true){
    if (map.getLayer('pct')) map.removeLayer('pct');
            map.addLayer({
            'id': 'pct',
            'type': 'line',
            'source': 'pct',
            'source-layer': 'pct',
            'paint': {
              'line-color': ["step",["get",layerId],
              "rgba(0,0,0,0)",
              1,
              "#9C9C9C",10,
              "#FFFF73",50,
              "#AFFF00",100,
              "#00FFFF",250,
              "#30B0FF",500,
              "#2E5FFF",1000,
              "#0000FF",2000,
              "#FF00C5"],
              'line-width': 2
            }
        });
  }
}

function switchpostcode(){
  var checkBox = document.getElementById('postcodecheckbox');
  var layerId = document.getElementById("postcodeinput").value;
  if (checkBox.checked === true){
    if (map.getLayer('postcode')) map.removeLayer('postcode');
      
      switch(layerId) {
      case 'gas_kwh_median':
        // code block
        map.addLayer({
            'id': 'postcode',
            'type': 'fill',
            'source': 'postcode',
            'source-layer': 'postcode',
            'paint': {
              'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'gas_kwh_median'],
              0,
              '#4575b4',
              7528,
              '#74add1',
              9185 ,
              '#abd9e9',
              11507 ,
              '#e0f3f8',
              13777 ,
              '#ffffbf',
              15199  ,
              '#fee090',
              17143 ,
              '#fdae61',
              20553,
              '#f46d43',
              30000 ,
              '#d73027'
              ],
              'fill-opacity': 0.7,
              'fill-outline-color': 'rgba(0, 0, 0, 0.2)'
            }
            }, 'roads 0 Restricted Road'
        );
        break;
      case 'elec_kwh_median':
        // code block
        map.addLayer({
            'id': 'postcode',
            'type': 'fill',
            'source': 'postcode',
            'source-layer': 'postcode',
            'paint': {
              'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'elec_kwh_median'],
              0,
              '#4575b4',
              1917,
              '#74add1',
              2268 ,
              '#abd9e9',
              2765 ,
              '#e0f3f8',
              3243 ,
              '#ffffbf',
              3545  ,
              '#fee090',
              3976 ,
              '#fdae61',
              4821,
              '#f46d43',
              7000 ,
              '#d73027'
              ],
              'fill-opacity': 0.7,
              'fill-outline-color': 'rgba(0, 0, 0, 0.2)'
              }
            }, 'roads 0 Restricted Road'
        );
        break;
      default:
        console.log("unknown postcode layer");
    }
  }
}


function switchLayer(layer) {
  
  var checkBox = document.getElementById('carboncheckbox');
  var layerId = document.getElementById("layerinput").value;
  var filterid = document.getElementById("layerfilter").value;
  var layers = map.getStyle().layers;
  
  if (checkBox.checked === true){
    
    if (map.getLayer('carbon')) map.removeLayer('carbon');
    switchLayerDesc();
    
    switch(layerId) {
      case 'SOAC11NM':
        // code block
        
        document.getElementById("legend").innerHTML = `<button onclick="showlegend(false)" style="float:right" aria-label="Hide legend"><i class="fas fa-times"></i></button>
        <h4>Office for National Statistics Area Classifications</h4>
        <div><span style="background-color: #955123"></span>Cosmopolitan student neighbourhoods</div>
  			<div><span style="background-color: #007f42"></span>Ageing rural neighbourhoods</div>
  			<div><span style="background-color: #3ea456"></span>Prospering countryside life</div>
  			<div><span style="background-color: #8aca8e"></span>Remoter communities</div>
  			<div><span style="background-color: #cfe8d1"></span>Rural traits</div>
  			<div><span style="background-color: #00498d"></span>Achieving neighbourhoods</div>
  			<div><span style="background-color: #2967ad"></span>Asian traits</div>
  			<div><span style="background-color: #7b99c7"></span>Highly qualified professionals</div>
  			<div><span style="background-color: #b9c8e1"></span>Households in terraces and flats</div>
  			<div><span style="background-color: #e3ac20"></span>Challenged white communities</div>
  			<div><span style="background-color: #edca1a"></span>Constrained renters</div>
  			<div><span style="background-color: #f6e896"></span>Hampered neighbourhoods</div>
  			<div><span style="background-color: #fcf5d8"></span>Hard-pressed flat dwellers</div>
  			<div><span style="background-color: #e64c2b"></span>Ageing urban communities</div>
  			<div><span style="background-color: #ec773c"></span>Aspiring urban households</div>
  			<div><span style="background-color: #faa460"></span>Comfortable neighbourhoods</div>
  			<div><span style="background-color: #fcc9a0"></span>Endeavouring social renters</div>
  			<div><span style="background-color: #fee4ce"></span>Primary sector workers</div>
  			<div><span style="background-color: #f79ff0"></span>Inner city cosmopolitan</div>
  			<div><span style="background-color: #6a339a"></span>Urban cultural mix</div>
  			<div><span style="background-color: #9f84bd"></span>Young ethnic communities</div>
  			<div><span style="background-color: #576362"></span>Affluent communities</div>
  			<div><span style="background-color: #a1a2a1"></span>Ageing suburbanites</div>
  			<div><span style="background-color: #e5e4e3"></span>Comfortable suburbia</div>`;
    		
    		
        if(filterid == 'all'){
          map.addLayer(
          {
          'id': 'carbon',
          'type': 'fill',
          'source': 'carbon',
          'source-layer': 'carbon',
          "paint": {
                  "fill-color": [
          			'match',
          			['get', layerId],
          			"Cosmopolitan student neighbourhoods",'#955123',
          			"Ageing rural neighbourhoods",'#007f42',
          			"Prospering countryside life",'#3ea456',
          			"Remoter communities",'#8aca8e',
          			"Rural traits",'#cfe8d1',
          			"Achieving neighbourhoods",'#00498d',
          			"Asian traits",'#2967ad',
          			"Highly qualified professionals",'#7b99c7',
          			"Households in terraces and flats",'#b9c8e1',
          			"Challenged white communities",'#e3ac20',
          			"Constrained renters",'#edca1a',
          			"Hampered neighbourhoods",'#f6e896',
          			"Hard-pressed flat dwellers",'#fcf5d8',
          			"Ageing urban communities",'#e64c2b',
          			"Aspiring urban households",'#ec773c',
          			"Comfortable neighbourhoods",'#faa460',
          			"Endeavouring social renters",'#fcc9a0',
          			"Primary sector workers",'#fee4ce',
          			"Inner city cosmopolitan",'#f79ff0',
          			"Urban cultural mix",'#6a339a',
          			"Young ethnic communities",'#9f84bd',
          			"Affluent communities",'#576362',
          			"Ageing suburbanites",'#a1a2a1',
          			"Comfortable suburbia",'#e5e4e3',
                /* other */ '#ffffff'
          			],
                  "fill-opacity": 0.7,
                  'fill-outline-color': 'rgba(0, 0, 0, 0.2)'
                }
          },  'roads 0 Restricted Road' /*'landcover_grass'*/
          );
        } else {
          map.addLayer(
          {
          'id': 'carbon',
          'type': 'fill',
          'source': 'carbon',
          'source-layer': 'carbon',
          'filter': ['==', 'SOAC11NM', filterid],
          "paint": {
                  "fill-color": [
          			'match',
          			['get', layerId],
          			"Cosmopolitan student neighbourhoods",'#955123',
          			"Ageing rural neighbourhoods",'#007f42',
          			"Prospering countryside life",'#3ea456',
          			"Remoter communities",'#8aca8e',
          			"Rural traits",'#cfe8d1',
          			"Achieving neighbourhoods",'#00498d',
          			"Asian traits",'#2967ad',
          			"Highly qualified professionals",'#7b99c7',
          			"Households in terraces and flats",'#b9c8e1',
          			"Challenged white communities",'#e3ac20',
          			"Constrained renters",'#edca1a',
          			"Hampered neighbourhoods",'#f6e896',
          			"Hard-pressed flat dwellers",'#fcf5d8',
          			"Ageing urban communities",'#e64c2b',
          			"Aspiring urban households",'#ec773c',
          			"Comfortable neighbourhoods",'#faa460',
          			"Endeavouring social renters",'#fcc9a0',
          			"Primary sector workers",'#fee4ce',
          			"Inner city cosmopolitan",'#f79ff0',
          			"Urban cultural mix",'#6a339a',
          			"Young ethnic communities",'#9f84bd',
          			"Affluent communities",'#576362',
          			"Ageing suburbanites",'#a1a2a1',
          			"Comfortable suburbia",'#e5e4e3',
                /* other */ '#ffffff'
          			],
                  "fill-opacity": 0.7,
                  'fill-outline-color': 'rgba(0, 0, 0, 0.2)'
                }
          },  'roads 0 Restricted Road' /*'landcover_grass'*/
          );
        }
        
        break;
      case 'EPCScore':
        // code block
        
        document.getElementById("legend").innerHTML = `<button onclick="showlegend(false)" style="float:right" aria-label="Hide legend"><i class="fas fa-times"></i></button>
        <h4>EPC Scores</h4>
        <div><span style="background-color: #0e7e58"></span>A 92-100</div>
  			<div><span style="background-color: #2aa45b"></span>B 81-91</div>
  			<div><span style="background-color: #8cbc42"></span>C 69-80</div>
  			<div><span style="background-color: #f6cc15"></span>D 55-86</div>
  			<div><span style="background-color: #f2a867"></span>E 39-54</div>
  			<div><span style="background-color: #f17e23"></span>F 21-38</div>
  			<div><span style="background-color: #e31d3e"></span>G 1-20</div>`;
    		
    		
        if(filterid == 'all'){
          map.addLayer(
          {
          'id': 'carbon',
          'type': 'fill',
          'source': 'carbon',
          'source-layer': 'carbon',
          "paint": {
                  'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'epc_score_avg'],
                        0,'#e31d3e',
                        21,'#f17e23',
                        39,'#f2a867',
                        55,'#f6cc15',
                        69,'#8cbc42',
                        81,'#2aa45b',
                        92,'#0e7e58'
                        ],
                  'fill-outline-color': 'rgba(0, 0, 0, 0.2)',
                  'fill-opacity': 0.7
                }
          },  'roads 0 Restricted Road'
          );
        } else {
          map.addLayer(
          {
          'id': 'carbon',
          'type': 'fill',
          'source': 'carbon',
          'source-layer': 'carbon',
          'filter': ['==', 'SOAC11NM', filterid],
          "paint": {
                  'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'epc_score_avg'],
                        0,'#e31d3e',
                        21,'#f17e23',
                        39,'#f2a867',
                        55,'#f6cc15',
                        69,'#8cbc42',
                        81,'#2aa45b',
                        92,'#0e7e58'
                        ],
                  'fill-outline-color': 'rgba(0, 0, 0, 0.2)',
                  'fill-opacity': 0.7
                }
          },  'roads 0 Restricted Road'
          );
        }
        
        break;
      case 'floor_area_avg':
        // code block
        
        document.getElementById("legend").innerHTML = `<button onclick="showlegend(false)" style="float:right" aria-label="Hide legend"><i class="fas fa-times"></i></button>
        <h4>EPC Average floor areas</h4>
        <div><span style="background-color: #4d9221"></span>30 m<sup>2</sup></div>
  			<div><span style="background-color: #a1d76a"></span>60 m<sup>2</sup></div>
  			<div><span style="background-color: #e6f5d0"></span>90 m<sup>2</sup></div>
  			<div><span style="background-color: #f7f7f7"></span>120 m<sup>2</sup></div>
  			<div><span style="background-color: #fde0ef"></span>150 m<sup>2</sup></div>
  			<div><span style="background-color: #e9a3c9"></span>180 m<sup>2</sup></div>
  			<div><span style="background-color: #c51b7d"></span>>200 m<sup>2</sup></div>`;
    		
    		
        if(filterid == 'all'){
          map.addLayer(
          {
          'id': 'carbon',
          'type': 'fill',
          'source': 'carbon',
          'source-layer': 'carbon',
          "paint": {
                  'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'floor_area_avg'],
                        30,'#4d9221',
                        60,'#a1d76a',
                        90,'#e6f5d0',
                        120,'#f7f7f7',
                        150,'#fde0ef',
                        180,'#e9a3c9',
                        200,'#c51b7d'
                        ],
                  'fill-outline-color': 'rgba(0, 0, 0, 0.2)',
                  'fill-opacity': 0.7
                }
          },  'roads 0 Restricted Road'
          );
        } else {
          map.addLayer(
          {
          'id': 'carbon',
          'type': 'fill',
          'source': 'carbon',
          'source-layer': 'carbon',
          'filter': ['==', 'SOAC11NM', filterid],
          "paint": {
                  'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'floor_area_avg'],
                        30,'#4d9221',
                        60,'#a1d76a',
                        90,'#e6f5d0',
                        120,'#f7f7f7',
                        150,'#fde0ef',
                        180,'#e9a3c9',
                        200,'#c51b7d'
                        ],
                  'fill-outline-color': 'rgba(0, 0, 0, 0.2)',
                  'fill-opacity': 0.7
                }
          },  'roads 0 Restricted Road'
          );
        }
        
        break;
        case 'low_energy_light':
        // code block
        
        document.getElementById("legend").innerHTML = `<button onclick="showlegend(false)" style="float:right" aria-label="Hide legend"><i class="fas fa-times"></i></button>
        <h4>% low energy lights</h4>
        <div><span style="background-color: #800026"></span>20% </div>
  			<div><span style="background-color: #bd0026"></span>30% </div>
  			<div><span style="background-color: #e31a1c"></span>40% </div>
  			<div><span style="background-color: #fc4e2a"></span>50% </div>
  			<div><span style="background-color: #fd8d3c"></span>60% </div>
  			<div><span style="background-color: #feb24c"></span>70% </div>
  			<div><span style="background-color: #fed976"></span>80% </div>
  			<div><span style="background-color: #ffeda0"></span>90% </div>
  			<div><span style="background-color: #ffffcc"></span>100% </div>`;
    		
    		
        if(filterid == 'all'){
          map.addLayer(
          {
          'id': 'carbon',
          'type': 'fill',
          'source': 'carbon',
          'source-layer': 'carbon',
          "paint": {
                  'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'low_energy_light'],
                        20,'#800026',
                        30,'#bd0026',
                        40,'#e31a1c',
                        50,'#fc4e2a',
                        60,'#fd8d3c',
                        70,'#feb24c',
                        80,'#fed976',
                        90,'#ffeda0',
                        100,'#ffffcc'
                        ],
                  'fill-outline-color': 'rgba(0, 0, 0, 0.2)',
                  'fill-opacity': 0.7
                }
          },  'roads 0 Restricted Road'
          );
        } else {
          map.addLayer(
          {
          'id': 'carbon',
          'type': 'fill',
          'source': 'carbon',
          'source-layer': 'carbon',
          'filter': ['==', 'SOAC11NM', filterid],
          "paint": {
                  'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'low_energy_light'],
                        20,'#800026',
                        30,'#bd0026',
                        40,'#e31a1c',
                        50,'#fc4e2a',
                        60,'#fd8d3c',
                        70,'#feb24c',
                        80,'#fed976',
                        90,'#ffeda0',
                        100,'#ffffcc'
                        ],
                  'fill-outline-color': 'rgba(0, 0, 0, 0.2)',
                  'fill-opacity': 0.7
                }
          },  'roads 0 Restricted Road'
          );
        }
        
        break;
      default:
        // One of the grades layers 
        document.getElementById("legend").innerHTML = `<button onclick="showlegend(false)" style="float:right" aria-label="Hide legend"><i class="fas fa-times"></i></button>
        <h4>Grades</h4>
        <div><span style="background-color: #313695"></span>A+ (best 1%)</div>
    		<div><span style="background-color: #4575b4"></span>A</div>
    		<div><span style="background-color: #4575b4"></span>A- (best 10%)</div>
    		<div><span style="background-color: #74add1"></span>B+</div>
    		<div><span style="background-color: #abd9e9"></span>B</div>
    		<div><span style="background-color: #abd9e9"></span>B-</div>
    		<div><span style="background-color: #e0f3f8"></span>C+</div>
    		<div><span style="background-color: #e0f3f8"></span>C</div>
    		<div><span style="background-color: #ffffbf"></span>C- (above average)</div>
    		<div><span style="background-color: #ffffbf"></span>D+ (below average)</div>
    		<div><span style="background-color: #fee090"></span>D</div>
    		<div><span style="background-color: #fee090"></span>D-</div>
    		<div><span style="background-color: #fdae61"></span>E+</div>
    		<div><span style="background-color: #fdae61"></span>E</div>
    		<div><span style="background-color: #f46d43"></span>E-</div>
    		<div><span style="background-color: #d73027"></span>F+ (worst 10%)</div>
    		<div><span style="background-color: #d73027"></span>F</div>
    		<div><span style="background-color: #a50026"></span>F- (worst 1%)</div>
    		<div><span style="background-color: #e0e0e0"></span>No Data</div>`;
        
        if(filterid == 'all'){
          map.addLayer(
          {
          'id': 'carbon',
          'type': 'fill',
          'source': 'carbon',
          'source-layer': 'carbon',
          "paint": {
                  "fill-color": [
          			'match',
          			['get', layerId],
          			'A+','#313695',
          			'A','#4575b4',
          			'A-','#4575b4',
          			'B+','#74add1',
          			'B','#abd9e9',
          			'B-','#abd9e9',
          			'C+','#e0f3f8',
          			'C','#e0f3f8',
          			'C-','#ffffbf',
          			'D+','#ffffbf',
          			'D','#fee090',
          			'D-','#fee090',
          			'E+','#fdae61',
          			'E','#fdae61',
          			'E-','#f46d43',
          			'F+','#d73027',
          			'F','#d73027',
          			'F-','#a50026',
          			/* other */ '#e0e0e0'
          			],
                  "fill-opacity": 0.7,
                  'fill-outline-color': 'rgba(0, 0, 0, 0.5)'
                }
          },  'roads 0 Restricted Road'/*'roads' /* /*'landcover_grass'*/
          );
        } else {
          map.addLayer(
          {
          'id': 'carbon',
          'type': 'fill',
          'source': 'carbon',
          'source-layer': 'carbon',
          'filter': ['==', 'SOAC11NM', filterid],
          "paint": {
                  "fill-color": [
          			'match',
          			['get', layerId],
          			'A+','#313695',
          			'A','#4575b4',
          			'A-','#4575b4',
          			'B+','#74add1',
          			'B','#abd9e9',
          			'B-','#abd9e9',
          			'C+','#e0f3f8',
          			'C','#e0f3f8',
          			'C-','#ffffbf',
          			'D+','#ffffbf',
          			'D','#fee090',
          			'D-','#fee090',
          			'E+','#fdae61',
          			'E','#fdae61',
          			'E-','#f46d43',
          			'F+','#d73027',
          			'F','#d73027',
          			'F-','#a50026',
          			/* other */ '#e0e0e0'
          			],
                  "fill-opacity": 0.7,
                  'fill-outline-color': 'rgba(0, 0, 0, 0.5)'
                }
          },  'roads 0 Restricted Road'/*'roads' /* /*'landcover_grass'*/
          );
        }
        
        
    }
    
    
  } else {
    document.getElementById("legend").innerHTML = ``;
  }
  
  map.triggerRepaint();
}





