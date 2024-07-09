// Data definitions, i.e. layers, charts, etc.
// Common Datasets used on all maps
const datasets_common = {
	
	// Data layers
	layers: {
		
		
		wards: {
			'id': 'wards',
			'type': 'line',
			'source': {
				'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/wards.pmtiles',
			},
			'source-layer': 'wards',
			'paint': {
				'line-color': 'rgba(32, 107, 7, 1)',
				'line-width': 2
			}
		},
		
		la: {
			'id': 'la',
			'type': 'line',
			'source': {
				'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/la.pmtiles',
			},
			'source-layer': 'la',
			'paint': {
				'line-color': 'rgba(107, 7, 7, 1)',
				'line-width': 2
			} 
		},
		
		parish: {
			'id': 'parish',
			'type': 'line',
			'source': {
				'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/parish.pmtiles',
			},
			'source-layer': 'parish',
			'paint': {
				'line-color': 'rgba(107, 7, 7, 1)',
				'line-width': 2
			} 
		},
		
		westminster: {
			'id': 'westminster',
			'type': 'line',
			'source': {
				'type': 'vector',
				'url': 'pmtiles://%tileserverUrl/westminster.pmtiles',
			},
			'source-layer': 'westminster',
			'paint': {
				'line-color': 'rgba(107, 7, 7, 1)',
				'line-width': 2
			} 
		}
		
		
	},
	// Layer styling callbacks functions, each defined below
	layerStyling: {
	},
	// #!# These need to be merged with lineColours
	legends: {
	},
	// #!# These are presumably restatements of dzLegendColours
	circleColours: {
	},
	// Chart definitions, indexed by map layer ID
	// #!# Need to define more clearly the assumed data structure, e.g. the 'charts' key shows a part field
	charts: {
	},
	// Popups
	popups: {
	}
};


// Callbacks
function popupCallback (feature)
{
	/*
	const layerPurpose = document.getElementById('rnet_purpose_input').value;
	const layerType = document.getElementById('rnet_type_input').value;
	const layerScenario = document.getElementById('rnet_scenario_input').value;
	const layerField = layerPurpose + '_' + layerType + '_' + layerScenario;
	feature.properties._ncycle = feature.properties[layerField];
	*/
	return feature;
}


function mergeObjects(obj1, obj2) {
  const merged = { ...obj1 };

  for (const prop in obj2) {
    if (obj2.hasOwnProperty(prop)) {
      //console.log(prop);
      //console.log(obj2[prop]);
      merged[prop] = {...merged[prop], ...obj2[prop]};
    }
  }

  return merged;
}


