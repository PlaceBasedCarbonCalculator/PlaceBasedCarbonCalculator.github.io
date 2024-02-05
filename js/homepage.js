var phrases = ["Matters", "is Different", "Emits Carbon", "is at Risk"];
        //var colors = ["#ffffff", "#ffffff", "#ffffff", "#fffff"];
        //var images = ["/images/ui/banners/headline1.jpg", "/images/ui/banners/headline2.jpg", "/images/ui/banners/headline3.jpg", "/images/ui/banners/headline4.jpg"];
        var i = 0;

        function animateText() {
            anime.timeline({loop: false})
            .add({
                targets: '#animated-text',
                opacity: 0,
                duration: 250,
                easing: "easeOutExpo",
                complete: function(anim) {
                    document.getElementById("animated-text").textContent = phrases[i];
                    //document.getElementById("animated-text").style.color = colors[i];
                    //document.getElementById("banner").style.background = "url('" + images[i] + "') no-repeat center top fixed";
                }
            })
            .add({
                targets: '#animated-text',
                opacity: 1,
                duration: 250,
                easing: "easeInExpo"
            })
            .add({
                targets: '#animated-text',
                opacity: 0,
                duration: 250,
                easing: "easeOutExpo",
                delay: 30000
            });

            i = (i + 1) % phrases.length;
        }

        animateText();
        setInterval(animateText, 4000); // Change phrase every 4 seconds