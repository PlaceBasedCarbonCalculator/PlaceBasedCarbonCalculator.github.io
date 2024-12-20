// Settings for transport tool
const settings_extra = {
	
	// Buildings/placenames tiles URL; can use %tileserverUrl to represent the above
	buildingsTilesUrl: 'pmtiles://%tileserverUrl/buildings_transport.pmtiles',
	
};

const settings = { ...settings_common, ...settings_extra };
