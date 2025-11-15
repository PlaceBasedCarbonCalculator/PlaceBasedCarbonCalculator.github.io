// Settings for retofit tool
const settings_extra = {
	
	// Buildings/placenames tiles URL; can use %tileserverUrl to represent the above
	buildingsTilesUrl: 'pmtiles://%tileserverUrl/buildings_retrofit_20251115.pmtiles',
	
};

const settings = { ...settings_common, ...settings_extra };
