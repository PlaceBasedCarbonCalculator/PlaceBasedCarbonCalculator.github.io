// Settings for landuse tool
const settings_extra = {
	
	// Buildings/placenames tiles URL; can use %tileserverUrl to represent the above
	buildingsTilesUrl: 'pmtiles://%tileserverUrl/buildings_v2.pmtiles',

	// No tour button on the welcome splash here. It hides the splash to start
	// the tour, which would let people reach the map without giving the name
	// and consent the Land Registry licence requires. The tour is still
	// offered from the layer panel, behind that form.
	welcomeTourButton: false,

};

const settings = { ...settings_common, ...settings_extra };

  

		
