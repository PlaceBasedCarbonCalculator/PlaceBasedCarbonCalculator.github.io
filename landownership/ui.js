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

  var nameSpan = box && box.querySelector('.consent-name');
  if (nameSpan && visitor.name) { nameSpan.textContent = ' as ' + visitor.name; }

  setConsentKnown(true);
}

document.addEventListener('DOMContentLoaded', function () {
  // Initialize welcome behaviour after DOM ready
  try { welcomeInit(); } catch (e) {}
});

