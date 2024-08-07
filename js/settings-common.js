
// Settings for this installation
const settings = {
	
	// Map position
	initialPosition: {
		center: [-0.151, 51.482],	// Lon,lat
		zoom: 8,
	},
	maxZoom: 19,
	minZoom: 6,
	
	// Basemap styles
	basemapStyleDefault: 'greyscale_nobuild',
	basemapStyles: {
		'greyscale_nobuild': {
			title: 'OS greyscale',
			buildingColour: '#d1cfcf'
		},
		'satellite': {
			title: 'Satellite',
			buildingColour: false   // No buildings
		},
		'opencyclemap': {
			title: 'OpenCycleMap',
			buildingColour: false   // No buildings
		},
		'google_nobuild': {
			title: 'Outdoors',
			buildingColour: '#f0eded'
		},
		'dark_nobuild': {
			title: 'Dark',
			buildingColour: '#000000'
		},
	},
	
	// Tileserver for data layers
	tileserverUrl: 'https://pbcc.blob.core.windows.net/pbcc-pmtiles',		// Not slash-terminated
	tileserverTempLocalOverrides: {		// Temporarily define any local folder paths where particular layers should come from
		//rnet: 'utilitytrips/',
		//cohesivenetwork: 'cohesivenetwork/',
	},
	
	// Buildings/placenames tiles URL; can use %tileserverUrl to represent the above
	buildingsTilesUrl: 'pmtiles://%tileserverUrl/buildings.pmtiles',
	placenamesTilesUrl: 'pmtiles://%tileserverUrl/oszoom_names.pmtiles',
	
	// Manual
	manualEditingUrl: 'https://github.com/PlaceBasedCarbonCalculator/PlaceBasedCarbonCalculator.github.io/edit/dev/%id/index.md',
	
	// OSM data date
	osmDate: '6 December 2023',
	
	// Analytics
	gaProperty: 'G-Q11V10CDRV',
	
	// UI callback

};
  

		
