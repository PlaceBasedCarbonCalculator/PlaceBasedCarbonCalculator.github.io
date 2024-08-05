// Data definitions, i.e. layers, charts, etc.
const datasets_extra = {
	
	// Data layers
	layers: {
	  
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
const datasets = mergeObjects(datasets_extra, datasets_common);
//const datasets = { ...datasets_common, ...datasets_extra };
//console.log(datasets);

// Function to determine the style column
function getStyleColumn (layerId, datasets)
{
	const style_col_selected = datasets.lineColours.zones.hasOwnProperty(layerId) ? layerId : '_';
	//return datasets.lineColours.zones[style_col_selected];
	return datasets.lineColours.zones['Grade'];
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








