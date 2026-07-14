// Homepage postcode search.
// Validates a UK postcode, resolves it to its 2021 LSOA (and surrounding
// administrative areas) via the free postcodes.io API, then routes the user to
// the combined local report at /reports/lsoa.html?lsoa=<code>.
(function () {
	'use strict';

	// Standard UK postcode validation (incl. the GIR 0AA special case)
	var UK_POSTCODE_RE = /^(GIR ?0AA)$|^((([A-Z][0-9]{1,2})|(([A-Z][A-HJ-Y][0-9]{1,2})|(([A-Z][0-9][A-Z])|([A-Z][A-HJ-Y][0-9]?[A-Z]))))\s?[0-9][A-Z]{2})$/i;

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
			if (!UK_POSTCODE_RE.test(raw)) {
				showError('That does not look like a valid UK postcode. Please check and try again.');
				return;
			}

			var pc = raw.toUpperCase().replace(/\s+/g, '');
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
