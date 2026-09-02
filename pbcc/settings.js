// Settings for PBCC tool
const settings_extra = {
	
	// Buildings/placenames tiles URL; can use %tileserverUrl to represent the above
	// buildings_pbcc_20260811.pmtiles was once skipped here because that blob was
	// an MBTiles (SQLite) file uploaded under a .pmtiles name, so every read of it
	// failed with "Wrong magic number for PMTiles archive". Check the first seven
	// bytes of a tileset read "PMTiles" before pointing this at a new build; the
	// upload script (build/RScripts/azure_upload_*.R) now does that check itself.
	buildingsTilesUrl: 'pmtiles://%tileserverUrl/buildings_pbcc_20260829.pmtiles',
	
};

const settings = { ...settings_common, ...settings_extra };
