// Settings for landownership tool
const settings_extra = {
	
	// Buildings/placenames tiles URL; can use %tileserverUrl to represent the above
	// Shares the PBCC tool's buildings archive rather than keeping a second one.
	// Buildings are background mapping only here: nothing in this tool colours them
	// by data, so they keep the flat grey set in capUi.addBuildings(). This replaced
	// buildings_v2.pmtiles, which carried seven 2020 emission grades per building
	// that only the PBCC tool ever read. Pointing every tool at one archive also
	// means these tiles are already cached for anyone arriving from another tool.
	buildingsTilesUrl: 'pmtiles://%tileserverUrl/buildings_pbcc_20260829.pmtiles',

	// No tour button on the welcome splash here. It hides the splash to start
	// the tour, which would let people reach the map without giving the name
	// and consent the Land Registry licence requires. The tour is still
	// offered from the layer panel, behind that form.
	welcomeTourButton: false,

};

const settings = { ...settings_common, ...settings_extra };

  

		
