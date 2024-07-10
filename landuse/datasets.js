// Data definitions, i.e. layers, charts, etc.
const datasets_extra = {
	
	// Data layers
	layers: {
	  
	  floodzones : {
	    'id': 'floodzones',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/floodzones.pmtiles'},
      'source-layer': 'floodzones',
      'paint': {
        'fill-color': [
    			'match',
    			['get', 'type'],
    			3,'rgba(49, 54, 149, 0.3)',
    			2,'rgba(69, 117, 180, 0.3)',
    			/* other */ '#f55dc0'
    			]
      }
	  },
	  
	  aonb : {
	    'id': 'aonb',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/aonb.pmtiles'},
      'source-layer': 'aonb',
      'paint': {
        'fill-color': 'rgba(187, 232, 37, 0.3)'
      }
	  },
	  
	  ancientwoodland : {
	    'id': 'ancientwoodland',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/ancientwoodland.pmtiles'},
      'source-layer': 'ancientwoodland',
      'paint': {
        'fill-color': 'rgba(187, 232, 37, 0.3)'
      }
	  },
	  
	  nationalparks : {
	    'id': 'nationalparks',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/nationalparks.pmtiles'},
      'source-layer': 'nationalparks',
      'paint': {
        'fill-color': 'rgba(61, 156, 17, 0.3)'
      }
	  },
	  
	  greenbelt : {
	    'id': 'greenbelt',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/greenbelt.pmtiles'},
      'source-layer': 'greenbelt',
      'paint': {
        'fill-color': 'rgba(34, 227, 85, 0.3)'
      }
	  },
	  
	  conservationareas : {
	    'id': 'conservationareas',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/conservationareas.pmtiles'},
      'source-layer': 'conservationareas',
      'paint': {
        'fill-color': 'rgba(251,154,153, 0.3)'
      }
	  },
	  
	  naturereserves : {
	    'id': 'naturereserves',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/naturereserves.pmtiles'},
      'source-layer': 'naturereserves',
      'paint': {
        'fill-color': 'rgba(178,223,138, 0.3)'
      }
	  },
	  
	  parksandgardens : {
	    'id': 'parksandgardens',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/parksandgardens.pmtiles'},
      'source-layer': 'parksandgardens',
      'paint': {
        'fill-color': 'rgba(51,160,44, 0.3)'
      }
	  },
	  
	  RAMSAR: {
	    'id': 'RAMSAR',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/RAMSAR.pmtiles'},
      'source-layer': 'RAMSAR',
      'paint': {
        'fill-color': 'rgba(166,206,227, 0.3)'
      }
	  },
	  
	  SAC: {
	    'id': 'SAC',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/SAC.pmtiles'},
      'source-layer': 'SAC',
      'paint': {
        'fill-color': 'rgba(251,154,153, 0.3)'
      }
	  },
	  
	  scheduledmonuments: {
	    'id': 'scheduledmonuments',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/scheduledmonuments.pmtiles'},
      'source-layer': 'scheduledmonuments',
      'paint': {
        'fill-color': 'rgba(227,26,28, 0.3)'
      }
	  },
	  
	  SPA : {
	    'id': 'SPA',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/SPA.pmtiles'},
      'source-layer': 'SPA',
      'paint': {
        'fill-color': 'rgba(253,191,111, 0.3)'
      }
	  },
	  SSSI: {
	    'id': 'SSSI',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/SSSI.pmtiles'},
      'source-layer': 'SSSI',
      'paint': {
        'fill-color': 'rgba(202,178,214, 0.3)'
      }
	  },
	  
	  landfill : {
	    'id': 'landfill',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/landfill.pmtiles'},
      'source-layer': 'landfill',
      'paint': {
        'fill-color': 'rgba(135, 62, 7, 0.3)'
      }
	  },
	  
	  worldheritagesite : {
	    'id': 'worldheritagesite',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/worldheritagesite.pmtiles'},
      'source-layer': 'worldheritagesite',
      'paint': {
        'fill-color': 'rgba(106,61,154, 0.3)'
      }
	  },
	  
	  
	 rail_all : {
      'id': 'rail_all',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/rail_all.pmtiles'},
      'source-layer': 'rail_all',
      'paint': {
        'fill-color': [
    			'match',
    			['get', 'rail_all'],
    			50,'rgba(254,240,217,0.6)',
    			55,'rgba(253,212,158,0.6)',
    			60,'rgba(253,187,132,0.6)',
    			65,'rgba(252,141,89,0.6)',
    			70,'rgba(227,74,51,0.6)',
    			75,'rgba(179,0,0,0.6)',
    			/* other */ '#f55dc0'
    			]
      }
    },
	  
	  rail_16 : {
      'id': 'rail_16',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/rail_16.pmtiles'},
      'source-layer': 'rail_16',
      'paint': {
        'fill-color': [
    			'match',
    			['get', 'rail_16'],
    			50,'rgba(254,240,217,0.6)',
    			55,'rgba(253,212,158,0.6)',
    			60,'rgba(253,187,132,0.6)',
    			65,'rgba(252,141,89,0.6)',
    			70,'rgba(227,74,51,0.6)',
    			75,'rgba(179,0,0,0.6)',
    			/* other */ '#f55dc0'
    			]
      }
    },
    
    rail_night : {
      'id': 'rail_night',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/rail_night.pmtiles'},
      'source-layer': 'rail_night',
      'paint': {
        'fill-color': [
    			'match',
    			['get', 'rail_night'],
    			50,'rgba(254,240,217,0.6)',
    			55,'rgba(253,212,158,0.6)',
    			60,'rgba(253,187,132,0.6)',
    			65,'rgba(252,141,89,0.6)',
    			70,'rgba(227,74,51,0.6)',
    			75,'rgba(179,0,0,0.6)',
    			/* other */ '#f55dc0'
    			]
      }
    },
	  
	  road_all : {
      'id': 'road_all',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/road_all.pmtiles'},
      'source-layer': 'road_all',
      'paint': {
        'fill-color': [
    			'match',
    			['get', 'road_all'],
    			50,'rgba(254,240,217,0.6)',
    			55,'rgba(253,212,158,0.6)',
    			60,'rgba(253,187,132,0.6)',
    			65,'rgba(252,141,89,0.6)',
    			70,'rgba(227,74,51,0.6)',
    			75,'rgba(179,0,0,0.6)',
    			/* other */ '#f55dc0'
    			]
      }
    },
	  
	  road_16 : {
      'id': 'road_16',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/road_16.pmtiles'},
      'source-layer': 'road_16',
      'paint': {
        'fill-color': [
    			'match',
    			['get', 'road_16'],
    			50,'rgba(254,240,217,0.6)',
    			55,'rgba(253,212,158,0.6)',
    			60,'rgba(253,187,132,0.6)',
    			65,'rgba(252,141,89,0.6)',
    			70,'rgba(227,74,51,0.6)',
    			75,'rgba(179,0,0,0.6)',
    			/* other */ '#f55dc0'
    			]
      }
    },
    
    road_night : {
      'id': 'road_night',
      'type': 'fill',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/road_night.pmtiles'},
      'source-layer': 'road_night',
      'paint': {
        'fill-color': [
    			'match',
    			['get', 'road_night'],
    			50,'rgba(254,240,217,0.6)',
    			55,'rgba(253,212,158,0.6)',
    			60,'rgba(253,187,132,0.6)',
    			65,'rgba(252,141,89,0.6)',
    			70,'rgba(227,74,51,0.6)',
    			75,'rgba(179,0,0,0.6)',
    			/* other */ '#f55dc0'
    			]
      }
    },
	  
	  // Can't work out custom icons
	  /*
	  food_hygiene : {
	    'id': 'food_hygiene',
      'type': 'symbol',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/food_hygiene.pmtiles'},
      'source-layer': 'food_hygiene',
      
      'layout': {
          'icon-image': [
          'match',
          ['get', 'BusinessType'],
          ['foodrating:Distributors/Transporters'],'Distributors/Transporters',
          ['foodrating:Restaurant/Cafe/Canteen'],'Restaurant/Cafe/Canteen',
          ['foodrating:Takeaway/sandwich shop'],'Takeaway/sandwich shop',
          ['foodrating:Pub/bar/nightclub'],'Pub/bar/nightclub',
          ['foodrating:Farmers/growers'],'Farmers/growers',
          ['foodrating:Hospitals/Childcare/Caring Premises'],'Hospitals/Childcare/Caring Premises',
          ['foodrating:Hotel/bed & breakfast/guest house'],'Hotel/bed & breakfast/guest house',
          ['foodrating:Importers/Exporters'],'Importers/Exporters',
          ['foodrating:Manufacturers/packers'],'Manufacturers/packers',
          ['foodrating:Mobile caterer'],'Mobile caterer',
          ['foodrating:Retailers - other'],'Retailers - other',
          ['foodrating:Retailers - supermarkets/hypermarkets'],'Retailers - supermarkets/hypermarkets',
          ['foodrating:School/college/university'],'School/college/university',
          //''
        ],
        'icon-size': ['interpolate', ['linear'], ['zoom'], 12, 0.5, 15, 1]
      }
	  },
	  */
	  
	  food_hygiene : {
	    'id': 'food_hygiene',
      'type': 'circle',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/food_hygiene.pmtiles'},
      'source-layer': 'food_hygiene',
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
    			['get', 'BusinessType'],
    			        'Restaurant/Cafe/Canteen','#e31d3e',
                  'Pub/bar/nightclub','#f6cc15',
                  'Takeaway/sandwich shop','#0e7e58',

    			 '#e0e0e0'
    			]
      }
	  },
	  
	  
	  listedbuildings : {
	    'id': 'listedbuildings',
      'type': 'circle',
      'source': {'type': 'vector','url': 'pmtiles://%tileserverUrl/listedbuildings.pmtiles'},
      'source-layer': 'listedbuildings',
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
    			['get', 'Grade'],
    			        'I','#e31d3e',
                  'II*','#f6cc15',
                  'II','#0e7e58',

    			/* other */ '#e0e0e0'
    			]
      }
	  }
	  
	
		
	},
	
	// Layer styling callbacks functions, each defined below
	layerStyling: {
	  //food_hygiene: foodStyling
	},
	
	
	// #!# These need to be merged with lineColours
	legends: {

	},
	
	lineColours: {
	 
	},
	
	// Chart definitions, indexed by map layer ID
	charts: {
	  
	},
	
	// Popups
	popups: {
	}
};

//console.log(datasets_common);
const datasets = mergeObjects(datasets_common, datasets_extra);
//const datasets = { ...datasets_common, ...datasets_extra };
//console.log(datasets);

// Function to determine the style column
function getStyleColumn (layerId, datasets)
{
	const style_col_selected = datasets.lineColours.zones.hasOwnProperty(layerId) ? layerId : '_';
	//return datasets.lineColours.zones[style_col_selected];
	return datasets.lineColours.zones['Grade'];
}

// Styling callback for data zones (including buildings styling)
function foodStyling (layerId, map, settings, datasets, createLegend /* callback */)
{
	map.addSprite('food_hygiene', 'http://example.com/sprite-two');
	/*
	
	// Update the legend (even if map layer is off)
	const field = document.querySelector ('select.updatelayer[data-layer="zones"][name="field"]').value
	createLegend (datasets.legends.zones, "Grade", 'zoneslegend'); // Fixed Legeng for Grades
	
	// Get UI state
	const daysymetricMode = document.querySelector ('input.updatelayer[data-layer="zones"][name="daysymetricmode"]').checked;
	
	// Set paint properties
	//map.setPaintProperty (layerId, 'fill-color', ['step', ['get', field], getStyleColumn (field, datasets)]);
	map.setPaintProperty (layerId, 'fill-color', ['match', ['get', field], ...getStyleColumn (field, datasets)]);
	map.setPaintProperty (layerId, 'fill-opacity', (daysymetricMode ? 0.1 : 0.8)); // Very faded-out in daysymetric mode, as the buildings are coloured
	
	// Set buildings layer colour/visibility
	const buildingColour = getBuildingsColour(settings);
	map.setPaintProperty ('buildings', 'fill-extrusion-color', (buildingColour || '#9c9898'));
	//map.setPaintProperty ('buildings', 'fill-extrusion-color', '#9c9898');
	map.setLayoutProperty ('buildings', 'visibility', (buildingColour ? 'visible' : 'none'));
	
	*/
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
		return ['match', ['get', field], ...getStyleColumn (field, datasets)];
	}
	
	// Default to gray
	return '#9c9898';
}








