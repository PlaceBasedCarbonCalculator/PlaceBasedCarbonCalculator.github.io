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

// Top nav
topnav ();