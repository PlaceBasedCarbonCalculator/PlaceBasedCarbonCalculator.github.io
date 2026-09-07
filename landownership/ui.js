function closewelcome() {
  var x = document.getElementById("welcome-modal");
  var checkBox1 = document.getElementById("Consentcheckbox");
  var checkBox2 = document.getElementById("Cookiescheckbox");
  var namebox = document.getElementById("namebox");

  // If we've already stored the welcome cookie, just close the modal
  var welcomeCookie = capUi.getCookie('landown_welcome');
  if (welcomeCookie !== '') {
    x.style.display = 'none';
    var overlay = document.getElementById('overlay');
    if (overlay) overlay.style.display = 'none';
    return true;
  }

  // Validate inputs
  if (checkBox1.checked === true && namebox.value.trim().length > 3) {

    // Analytics consent: reuse the same cookie name used by manageAnalyticsCookie
    var analyticsConsent = checkBox2.checked === true ? 'true' : 'false';
    // set analyticstrack cookie (manageAnalyticsCookie expects this)
    try {
      capUi.setCookie('analyticstrack', analyticsConsent);
    } catch (e) {
      // fallback to direct cookie assignment if setCookie not available
      var d = new Date(); d.setTime(d.getTime() + (24 * 60 * 60 * 1000 * 100));
      document.cookie = 'analyticstrack=' + analyticsConsent + ';expires=' + d.toUTCString() + ';path=/';
    }

    // If analytics not consented, set the GA opt-out disable cookie (same as gaOptout)
    if (analyticsConsent !== 'true') {
      var disableStr = 'ga-disable-' + 'G-Q11V10CDRV';
      document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/; SameSite=None; Secure';
      window[disableStr] = true;
      if (window.capAnalytics) { capAnalytics.deny(); }
    } else if (window.capAnalytics) {
      // gtag.js is not requested until consent exists (see js/analytics.js), so
      // load it here rather than leaving this visit unmeasured until the next
      // page view.
      capAnalytics.grant();
    }

    // Save a compact visitor cookie with name and consent flags
    var visitor = {
      name: namebox.value.trim(),
      consent: (checkBox1.checked === true ? 'true' : 'false'),
      analytics: analyticsConsent
    };
    try {
      capUi.setCookie('landown_welcome', encodeURIComponent(JSON.stringify(visitor)));
    } catch (e) {
      var d2 = new Date(); d2.setTime(d2.getTime() + (24 * 60 * 60 * 1000 * 100));
      document.cookie = 'landown_welcome=' + encodeURIComponent(JSON.stringify(visitor)) + ';expires=' + d2.toUTCString() + ';path=/';
    }

    // Close modal
    x.style.display = 'none';
    var overlay = document.getElementById('overlay');
    if (overlay) overlay.style.display = 'none';

  } else {
    alert("You cannot view the map until you complete the form");
  }

}

// Show the consent box's "already given" state, or return it to the form.
// The fields keep their values either way, so the visit is still posted and
// logged as the licence requires; only 'required' moves, because a hidden
// unticked required checkbox (anyone who declined analytics last time) makes
// the browser silently refuse to submit with nothing on screen to explain it.
function setConsentKnown(known) {
  var box = document.getElementById('consentbox');
  if (!box) { return; }
  box.classList.toggle('consent-known', known);
  ['namebox', 'Consentcheckbox', 'Cookiescheckbox'].forEach(function (id) {
    var input = document.getElementById(id);
    if (input) { input.required = !known; }
  });
}

// Reflect the site-wide analytics choice in the splash. Someone who has
// already accepted cookies in the banner has answered this exact question, so
// the box is ticked and locked rather than asked again. A disabled checkbox is
// not submitted, hence the hidden mirror, which keeps the posted End-User
// Record the same either way.
function applyAnalyticsGranted(granted) {
  var checkBox2 = document.getElementById('Cookiescheckbox');
  var mirror = document.getElementById('cookiesmirror');
  if (!checkBox2) { return; }
  if (granted) { checkBox2.checked = true; }
  checkBox2.disabled = granted;
  if (mirror) { mirror.disabled = !granted; }
  var row = checkBox2.closest('.consent-check');
  if (row) { row.classList.toggle('is-locked', granted); }
}

// Initialize the welcome form: pre-fill from the stored visit, and collapse
// the fields to a one-line confirmation if we already have consent
function welcomeInit() {
  var welcomeCookie = capUi.getCookie('landown_welcome');
  var namebox = document.getElementById('namebox');
  var checkBox1 = document.getElementById('Consentcheckbox');
  var checkBox2 = document.getElementById('Cookiescheckbox');
  var box = document.getElementById('consentbox');

  // Let the "terms of use" link in the consent box open the collapsed section
  // it points at, rather than jumping to a closed <details> and doing nothing
  var termsLink = box && box.querySelector('a[href^="#"]');
  if (termsLink) {
    termsLink.addEventListener('click', function (e) {
      var target = document.getElementById(termsLink.getAttribute('href').slice(1));
      if (!target) { return; }
      e.preventDefault();
      target.open = true;
      target.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
  }

  var changeButton = box && box.querySelector('.consent-change');
  if (changeButton) {
    changeButton.addEventListener('click', function () {
      setConsentKnown(false);
      if (namebox) { namebox.focus(); }
    });
  }

  // Ticking the box answers the same question the banner is asking at the
  // bottom of the screen, so take the banner away instead of asking twice.
  // Unticking brings it back, so there is still a route to a choice for
  // someone who then abandons the form.
  if (checkBox2) {
    checkBox2.addEventListener('change', function () {
      var banner = document.getElementById('cookiewarning');
      if (!banner) { return; }
      // Once analyticstrack is set the banner is already gone for good, and
      // showCookieWarning is the one that decides that
      if (capUi.getCookie('analyticstrack') !== '') { return; }
      banner.style.display = (checkBox2.checked ? 'none' : 'block');
    });
  }

  // The other direction: answering the banner while the splash is open settles
  // the checkbox. This reads the button's own value rather than the cookie,
  // because ui.js attaches its DOMContentLoaded listener before capUi
  // .initialise runs, so this fires before manageAnalyticsCookie has written
  // the cookie.
  document.querySelectorAll('#cookiewarning button').forEach(function (button) {
    button.addEventListener('click', function () {
      applyAnalyticsGranted(!!button.value);
    });
  });

  applyAnalyticsGranted(capUi.getCookie('analyticstrack') === 'true');

  if (!welcomeCookie || welcomeCookie === '') { return; }

  var visitor;
  try {
    visitor = JSON.parse(decodeURIComponent(welcomeCookie));
  } catch (e) {
    return;   // Unreadable cookie: leave the blank form up and ask again
  }

  if (visitor.name) { namebox.value = visitor.name; }
  if (visitor.consent === 'true') { checkBox1.checked = true; }

  // Analytics state: prefer the analyticstrack cookie, since the site-wide
  // banner may have changed it since this visitor last opened this tool
  var analytic = capUi.getCookie('analyticstrack');
  if (analytic !== '') {
    checkBox2.checked = (analytic === 'true');
  } else if (visitor.analytics) {
    checkBox2.checked = (visitor.analytics === 'true');
  }

  // The wrapper carries the " as ", so only the name itself is emboldened. It
  // stays hidden when there is no stored name, leaving "Consent already given."
  var nameSpan = box && box.querySelector('.consent-name');
  var nameWrap = box && box.querySelector('.consent-as');
  if (nameSpan && nameWrap && visitor.name) {
    nameSpan.textContent = visitor.name;
    nameWrap.hidden = false;
  }

  setConsentKnown(true);
}

document.addEventListener('DOMContentLoaded', function () {
  // Initialize welcome behaviour after DOM ready
  try { welcomeInit(); } catch (e) {}
});

