// Settings for PBCC tool
const settings_extra = {
	
	// Buildings/placenames tiles URL; can use %tileserverUrl to represent the above
	// #!# Reverted from buildings_pbcc_20260811.pmtiles: that blob is an MBTiles
	// (SQLite) file uploaded under a .pmtiles name, so every read of it fails with
	// "Wrong magic number for PMTiles archive". Restore the dated name once the
	// tileset has been re-uploaded as a real PMTiles archive.
	buildingsTilesUrl: 'pmtiles://%tileserverUrl/buildings_pbcc_20260821.pmtiles',
	
};

const settings = { ...settings_common, ...settings_extra };
