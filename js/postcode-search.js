// Homepage postcode search.
// Validates a UK postcode, resolves it to its 2021 LSOA (and surrounding
// administrative areas) via the free postcodes.io API, then routes the user to
// the combined local report at /reports/lsoa.html?lsoa=<code>.
//
// The same box also accepts an ONS area code as an undocumented shortcut, which
// skips the postcode lookup entirely. See ONS_AREA_TYPES below.
(function () {
	'use strict';

	// Standard UK postcode validation (incl. the GIR 0AA special case)
	var UK_POSTCODE_RE = /^(GIR ?0AA)$|^((([A-Z][0-9]{1,2})|(([A-Z][A-HJ-Y][0-9]{1,2})|(([A-Z][0-9][A-Z])|([A-Z][A-HJ-Y][0-9]?[A-Z]))))\s?[0-9][A-Z]{2})$/i;

	// Hidden shortcut: an ONS code typed into the postcode box opens that area's
	// report directly, with no call to postcodes.io. A code is a country letter
	// followed by eight digits, and the first two digits identify the geography,
	// so the three-character prefix alone says which report page to open.
	//
	// These are not a general list of ONS geography types. They are exactly the
	// prefixes present in the site's own lookups (reports/la.json, wards.json,
	// parish.json, westminster.json and data/lsoa_centroids.json), because those
	// are the only areas that have a report to open. Anything else that is
	// code-shaped, an MSOA (E02) or a region (E12) say, is rejected with a
	// message rather than being sent to the postcode API, which would only fail.
	var ONS_CODE_RE = /^[ESW][0-9]{8}$/;
	var ONS_AREA_TYPES = {
		'E01': ['lsoa', 'neighbourhood'],			// LSOA, England
		'W01': ['lsoa', 'neighbourhood'],			// LSOA, Wales
		'S01': ['lsoa', 'neighbourhood'],			// Data Zone, Scotland
		'E04': ['parishes', 'parish'],				// civil parish
		'W04': ['parishes', 'parish'],				// community
		'E05': ['wards', 'ward'],					// electoral ward, England
		'W05': ['wards', 'ward'],					// electoral ward, Wales
		'S13': ['wards', 'ward'],					// electoral ward, Scotland
		'E06': ['la', 'local authority'],			// unitary authority
		'E07': ['la', 'local authority'],			// non-metropolitan district
		'E08': ['la', 'local authority'],			// metropolitan district
		'E09': ['la', 'local authority'],			// London borough
		'S12': ['la', 'local authority'],			// council area
		'W06': ['la', 'local authority'],			// unitary authority
		'E14': ['constituencies', 'constituency'],	// Westminster, England
		'S14': ['constituencies', 'constituency'],	// Westminster, Scotland
		'W07': ['constituencies', 'constituency']	// Westminster, Wales
	};

	function init() {
		var form = document.getElementById('postcode-search-form');
		if (!form) { return; }
		var input = document.getElementById('postcode-search-input');
		var errorEl = document.getElementById('postcode-search-error');
		var button = form.querySelector('button');

		function showError(msg) {
			if (errorEl) {
				errorEl.textContent = msg;
				errorEl.style.display = 'block';
			}
		}
		function clearError() {
			if (errorEl) {
				errorEl.textContent = '';
				errorEl.style.display = 'none';
			}
		}

		form.addEventListener('submit', function (e) {
			e.preventDefault();
			clearError();

			var raw = (input.value || '').trim();
			if (!raw) { showError('Please enter a postcode.'); return; }

			var pc = raw.toUpperCase().replace(/\s+/g, '');

			// Tested before the postcode pattern. A code can never be a postcode,
			// since every UK postcode ends in two letters, but checking the
			// postcode first would reject it as a malformed one.
			if (ONS_CODE_RE.test(pc)) {
				var area = ONS_AREA_TYPES[pc.substring(0, 3)];
				if (!area) {
					showError('That looks like an ONS area code, but not one we publish a report for. ' +
						'We cover neighbourhoods, wards, parishes, local authorities and constituencies.');
					return;
				}
				// Analytics: only sent once the user has explicitly opted in
				if (typeof getCookie === 'function' && getCookie('analyticstrack') === 'true' && typeof gtag === 'function') {
					gtag('event', 'ons_code_search', { 'method': 'homepage', 'area_type': area[1] });
				}
				// No check that the code exists: the four name lookups are 2.5MB
				// between them and the neighbourhood list has no names at all, so
				// a bad code is left to the report page, which already handles one
				// with its own "we could not load a report for..." message.
				window.location.href = '/reports/' + area[0] + '.html?id=' + encodeURIComponent(pc);
				return;
			}

			if (!UK_POSTCODE_RE.test(raw)) {
				showError('That does not look like a valid UK postcode. Please check and try again.');
				return;
			}

			var originalLabel = button.textContent;
			button.disabled = true;
			button.textContent = 'Searching…';

			// Analytics: only sent once the user has explicitly opted in
			if (typeof getCookie === 'function' && getCookie('analyticstrack') === 'true' && typeof gtag === 'function') {
				gtag('event', 'postcode_search', { 'method': 'homepage' });
			}

			fetch('https://api.postcodes.io/postcodes/' + encodeURIComponent(pc))
				.then(function (r) {
					if (r.status === 404) { throw new Error('notfound'); }
					if (!r.ok) { throw new Error('api'); }
					return r.json();
				})
				.then(function (data) {
					var result = data && data.result;
					var lsoa = result && result.codes && result.codes.lsoa21;
					if (!lsoa) { throw new Error('nolsoa'); }
					// Our zones are English, Welsh and Scottish only. postcodes.io
					// does return an lsoa21 code for Northern Ireland (N-prefixed),
					// so a truthy code is not on its own proof of coverage: without
					// this check a BT postcode is sent to a report that cannot
					// exist and fails there with a generic "try again later".
					if (lsoa.charAt(0) === 'N' || result.country === 'Northern Ireland') {
						throw new Error('northernireland');
					}
					if (!/^[EWS]/.test(lsoa)) { throw new Error('nolsoa'); }
					var params = new URLSearchParams();
					params.set('lsoa', lsoa);
					params.set('postcode', result.postcode || pc);
					window.location.href = '/reports/lsoa.html?' + params.toString();
				})
				.catch(function (err) {
					button.disabled = false;
					button.textContent = originalLabel;
					if (err && err.message === 'notfound') {
						showError('We could not find that postcode. Please check it and try again.');
					} else if (err && err.message === 'northernireland') {
						showError('Sorry, we don’t cover Northern Ireland yet.');
					} else if (err && err.message === 'nolsoa') {
						showError('That postcode is outside our data coverage (Great Britain only).');
					} else {
						showError('Sorry, the postcode lookup service is currently unavailable. Please try again later.');
					}
				});
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
