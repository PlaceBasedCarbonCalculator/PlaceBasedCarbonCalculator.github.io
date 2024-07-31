// Shared Features Across Non-Map Pages

function manageAnalyticsCookie() {

	// Disable tracking if the opt-out cookie exists.
	const disableStr = 'ga-disable-' + 'G-Q11V10CDRV';
	if (document.cookie.indexOf(disableStr + '=true') > -1) {
		window[disableStr] = true;
	}

	// Define the cookie name
	const cookieName = 'analyticstrack';

	// Handle cookie warning buttons

	document.querySelectorAll('#cookiewarning button').forEach(function (button) {
		button.addEventListener('click', function (e) {
			cookieButton(button.value);
		});
	});

	// Show the cookie warning
	showCookieWarning();

	// Opt-out function
	function gaOptout ()
	{
		document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/; SameSite=None; Secure';
		window[disableStr] = true;
	}

	// Warning Control
	function cookieButton (accepted)
	{
		if (accepted) {
			setCookie(cookieName, 'true');
		} else {
			//alert("Tracking Op-Out Disabled");
			gaOptout();
			setCookie(cookieName, 'false');
		}
		const cookiewarning = document.getElementById ('cookiewarning');
		cookiewarning.style.display = 'none';
	}

	// Cookie warning
	function showCookieWarning ()
	{
		const cookiewarning = document.getElementById ('cookiewarning');
		const cookie = getCookie (cookieName);
		//console.log ("Cookie status: '" + cookie + "'");
		cookiewarning.style.display = (cookie === '' ? 'block' : 'none');

	}

}

// Main menu responsive display
topnav = function ()
{
	document.getElementById ('expandtopnav').addEventListener ('click', function (e) {
		const nav = document.querySelector ('nav');
		if (!nav.classList.contains ('responsive')) {
			nav.classList.add ('responsive');
		} else {
			nav.classList.remove ('responsive');
		}
		e.preventDefault ();
	});
}

// Generic cookie managment functions
setCookie = function (name, value, days = 100)
{
	const d = new Date();
	d.setTime(d.getTime() + (24 * 60 * 60 * days * 1000));	// setTime is in ms
	const expires = 'expires=' + d.toUTCString();
	document.cookie = name + '=' + value + ';' + expires + ';path=/';
},


getCookie = function (name)
{
	name = name + '=';
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

// Run Functions
topnav ();
manageAnalyticsCookie ();