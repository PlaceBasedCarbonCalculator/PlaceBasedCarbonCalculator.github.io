// Range-request data access for the single-binary datasets.
//
// Replaces the old "one JSON file per zone" folders. Each dataset is now a
// single brotli-compressed binary (data_<name>_<date>.bin) plus a gzipped
// lookup index (index_<name>_<date>.json.gz), both served from the
// pbcc-jsonbin blob container. The index maps each record ID to its byte
// offset and length inside the binary, so a single zone's data is fetched
// with one HTTP range request instead of a whole file.
//
// Usage (returns a Promise resolving to the same JSON the old per-zone file
// held, i.e. an array for "rows" datasets or a columns object for "columns"):
//
//     capBin.fetchRecord('epc_dom', 'E01000001').then(function (data) { ... });
//
// A missing ID rejects (like the old 404), so existing .catch() handlers keep
// working unchanged. The gzipped index is downloaded and decompressed once per
// dataset per page load, then cached in memory for all subsequent lookups.
//
// Datasets are rebuilt and re-uploaded independently, so their date-stamped
// file names drift apart over time. Rather than hard-code a single version
// here, each dataset's current index file name is registered by the code that
// uses it (each tool's datasets.js, and area-map.js for the report boundaries):
//
//     capBin.register({ epc_dom: 'index_epc_dom_2026-07-09.json.gz' });
//
// The matching data_*.bin file name is read from the index itself
// (meta.bin_file), so only the index file name needs recording. Bump the
// recorded name whenever that one dataset is rebuilt and re-uploaded.
//
// Some datasets are too large for a monolithic index (e.g. postcode, ~1.5M
// records). For those, the per-record byte range is carried elsewhere (the
// postcode pmtiles feature properties) and fed in at click time with
// primeRange(); the dataset is registered with just its .bin file name:
//
//     capBin.register({ postcode: { bin: 'data_postcode_2026-07-09.bin' } });
//     capBin.primeRange('postcode', 'AB10 1AU', offset, compressedLength);
//
// fetchRecord() then serves that ID straight from the range, never loading an
// index. NOTE: such a .bin and the source of its offsets (the pmtiles) must be
// rebuilt and redeployed in lockstep - stale offsets read the wrong bytes.
const capBin = (function () {

	'use strict';

	// Blob container holding both the .bin data files and the .json.gz indexes.
	const BASE = 'https://pbcc.blob.core.windows.net/pbcc-jsonbin/';

	// datasetName -> either an index file name string, or { index?, bin? }
	const _registry = {};

	// name -> Promise<{meta, zones}>  (dedupes concurrent loads and caches)
	const _indexCache = {};

	// name -> { id -> {offset, compressed_length} }  (ranges primed from pmtiles)
	const _rangeCache = {};

	// Record the current file name(s) for one or more bin datasets. Called from
	// each tool's datasets.js so the file names live next to the code that uses
	// them and can be bumped independently as each dataset is rebuilt. A value is
	// either an index file name (string) or an object { index, bin } - use the
	// { bin } form for datasets served by primeRange() without an index.
	function register(entries) {
		Object.keys(entries).forEach(function (name) { _registry[name] = entries[name]; });
	}

	function _indexFileFor(name) {
		const e = _registry[name];
		return (typeof e === 'string') ? e : (e && e.index);
	}

	function _binFileFor(name) {
		const e = _registry[name];
		return (e && typeof e === 'object') ? e.bin : undefined;
	}

	// Feed in a record's byte range ahead of a fetchRecord() call, so that call
	// can skip the index entirely (see the primeRange note at the top). Ignored
	// if offset/length are absent (fetchRecord then falls back to the index).
	function primeRange(name, id, offset, length) {
		if (offset === undefined || offset === null || length === undefined || length === null) { return; }
		(_rangeCache[name] || (_rangeCache[name] = {}))[id] = {
			offset: Number(offset),
			compressed_length: Number(length)
		};
	}

	function decompress(arrayBuffer, format) {
		if (!('DecompressionStream' in self)) {
			return Promise.reject(new Error('DecompressionStream unsupported in this browser'));
		}
		const stream = new Blob([arrayBuffer]).stream().pipeThrough(new DecompressionStream(format));
		return new Response(stream).arrayBuffer();
	}

	// Fetch + gunzip + parse a dataset's index, caching the promise.
	function loadIndex(name) {
		if (!_indexCache[name]) {
			const indexFile = _indexFileFor(name);
			if (!indexFile) {
				return Promise.reject(new Error('Bin dataset "' + name + '" has no index registered; call capBin.register() in the relevant datasets.js'));
			}
			const url = BASE + indexFile;
			_indexCache[name] = fetch(url)
				.then(function (response) {
					if (!response.ok) { throw new Error('Index fetch failed for ' + name + ': ' + response.status); }
					return response.arrayBuffer();
				})
				.then(function (buf) { return decompress(buf, 'gzip'); })
				.then(function (buf) { return JSON.parse(new TextDecoder().decode(buf)); })
				.catch(function (err) {
					// Don't cache a failed load: allow a later retry
					delete _indexCache[name];
					throw err;
				});
		}
		return _indexCache[name];
	}

	// Range-request one record's slice of a binary, brotli-decompress and parse it.
	function rangeFetchAndDecode(binFile, offset, compressedLength, label) {
		const start = offset;
		const end = offset + compressedLength - 1;
		return fetch(BASE + binFile, { headers: { Range: 'bytes=' + start + '-' + end } })
			.then(function (response) {
				if (!response.ok && response.status !== 206) {
					throw new Error('Range request failed for ' + label + ': ' + response.status);
				}
				return response.arrayBuffer();
			})
			.then(function (buf) {
				// If a proxy ignored the Range header and returned the whole file
				// (200), slice out the record ourselves.
				if (buf.byteLength !== compressedLength) {
					buf = buf.slice(offset, offset + compressedLength);
				}
				return decompress(buf, 'brotli');
			})
			.then(function (buf) { return JSON.parse(new TextDecoder().decode(buf)); });
	}

	// Fetch a single record by ID, returning the same JSON the old per-zone file
	// held. If a range was primed for this ID (and a .bin is registered), fetch
	// it directly and skip the index; otherwise resolve the range via the index
	// (whose meta.bin_file self-describes the binary). Rejects if the ID cannot
	// be located.
	function fetchRecord(name, id) {
		const primed = _rangeCache[name] && _rangeCache[name][id];
		const binFile = _binFileFor(name);
		if (primed && binFile) {
			return rangeFetchAndDecode(binFile, primed.offset, primed.compressed_length, name + '/' + id);
		}
		return loadIndex(name).then(function (index) {
			const rec = index.zones[id];
			if (!rec) { throw new Error('Record "' + id + '" not found in ' + name + ' index'); }
			return rangeFetchAndDecode(index.meta.bin_file, rec.offset, rec.compressed_length, name + '/' + id);
		});
	}

	// True if a record exists for this ID without fetching it (index must load).
	function hasRecord(name, id) {
		return loadIndex(name).then(function (index) { return Object.prototype.hasOwnProperty.call(index.zones, id); });
	}

	return {
		base: BASE,
		register: register,
		primeRange: primeRange,
		loadIndex: loadIndex,
		fetchRecord: fetchRecord,
		hasRecord: hasRecord
	};

}());
