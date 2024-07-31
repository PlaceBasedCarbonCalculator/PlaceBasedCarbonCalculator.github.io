function enableParallax() {

	window.addEventListener("scroll", function(event){
		var top = this.pageYOffset;
		var layers = document.getElementsByClassName("parallax");
		var layer, speed, y;
		for (var i = 0; i < layers.length; i++) {
			layer = layers[i];
			speed = layer.getAttribute('data-speed');
			var y = -(top * speed / 100);
			layer.setAttribute('style','transform:translate3d(0px,'+y+'px,0px)');
		}
	});
}

document.body.onload = enableParallax();


let installPrompt = null;
const installButton = document.querySelector("#install");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.removeAttribute("hidden");
});

installButton.addEventListener("click", async () => {
  if (!installPrompt) {
    return;
  }
  const result = await installPrompt.prompt();
  console.log(`Install prompt was: ${result.outcome}`);
  disableInAppInstallPrompt();
});

function disableInAppInstallPrompt() {
  installPrompt = null;
  installButton.setAttribute("hidden", "");
}


