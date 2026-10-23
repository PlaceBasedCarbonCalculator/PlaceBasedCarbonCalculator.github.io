// Google Analytics loader, gated on consent.
//
// gtag.js is not requested at all until the visitor accepts cookies in the
// banner, so nothing reaches Google before they answer. That matches the
// privacy policy, which says analytics data is shared with Google only if you
// have consented, and it is stricter than Consent Mode alone (which still
// sends cookieless pings while consent is denied). Consent Mode is declared as
// well, so the state is unambiguous once the tag does load.
//
// dataLayer and the gtag() shim are always defined, so capUi.trackEvent and
// anything else can call gtag() at any time without checking: calls queue in
// dataLayer and are sent as soon as consent loads the real script. If consent
// is never given they sit in the array and go when the page does.
//
// Loaded synchronously from the <head> of every page, before anything that
// might call gtag(). It is precached, so bump CACHE_VERSION in sw.js when
// changing it.

(function () {

	var MEASUREMENT_ID = 'G-Q11V10CDRV';
	var CONSENT_COOKIE = 'analyticstrack';		// 'true' once the banner is accepted
	var DISABLE_FLAG = 'ga-disable-' + MEASUREMENT_ID;	// gtag.js reads this off window

	window.dataLayer = window.dataLayer || [];
	window.gtag = window.gtag || function () { window.dataLayer.push (arguments); };

	function readCookie (name)
	{
		var match = document.cookie.match ('(^|; )' + name + '=([^;]*)');
		return (match ? decodeURIComponent (match[2]) : '');
	}

	// Honour the long-lived opt-out cookie set by the banner's "No" button. This
	// has to happen before gtag.js runs, which is the reason this file is loaded
	// synchronously in the head rather than from the end of the body: the old
	// arrangement set the flag after the async tag had already fired page_view.
	if (readCookie (DISABLE_FLAG) === 'true') { window[DISABLE_FLAG] = true; }

	var granted = (readCookie (CONSENT_COOKIE) === 'true' && !window[DISABLE_FLAG]);

	// Consent Mode v2. Declared before any tag runs, and denied by default so a
	// first-time visitor is not measured while the banner is still on screen.
	// We run no advertising tags, so those stay denied permanently.
	gtag ('consent', 'default', {
		'ad_storage': 'denied',
		'ad_user_data': 'denied',
		'ad_personalization': 'denied',
		'analytics_storage': (granted ? 'granted' : 'denied')
	});

	gtag ('js', new Date ());
	gtag ('config', MEASUREMENT_ID);

	var loaded = false;

	function loadTag ()
	{
		if (loaded || window[DISABLE_FLAG]) { return; }
		loaded = true;
		var script = document.createElement ('script');
		script.async = true;
		script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
		document.head.appendChild (script);
	}

	// Called by the cookie banner in js/common-nonmap.js and js/ui-common.js, and
	// by the Land Ownership Explorer's welcome form, so a visit starts being
	// measured the moment consent is given rather than on the next page load.
	window.capAnalytics = {

		grant: function ()
		{
			// Clear any earlier opt-out, or gtag.js would drop every hit
			document.cookie = DISABLE_FLAG + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
			window[DISABLE_FLAG] = false;
			gtag ('consent', 'update', {'analytics_storage': 'granted'});
			loadTag ();
		},

		deny: function ()
		{
			window[DISABLE_FLAG] = true;
			gtag ('consent', 'update', {'analytics_storage': 'denied'});
		},

		isGranted: function () { return (readCookie (CONSENT_COOKIE) === 'true'); }
	};

	if (granted) { loadTag (); }

}) ();
