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
    alert("You can't view the map until you complete the form");
  }

}

// Initialize the welcome form: pre-fill and hide if cookie present
function welcomeInit() {
  var welcomeCookie = capUi.getCookie('landown_welcome');
  var namebox = document.getElementById('namebox');
  var checkBox1 = document.getElementById('Consentcheckbox');
  var checkBox2 = document.getElementById('Cookiescheckbox');
  var form = document.querySelector('#welcome-modal form');

  if (welcomeCookie && welcomeCookie !== '') {
    try {
      var visitor = JSON.parse(decodeURIComponent(welcomeCookie));
      if (visitor.name) namebox.value = visitor.name;
      if (visitor.consent === 'true') checkBox1.checked = true;
      // Analytics state prefer the analyticstrack cookie if present
      var analytic = capUi.getCookie('analyticstrack');
      if (analytic !== '') {
        checkBox2.checked = (analytic === 'true');
      } else if (visitor.analytics) {
        checkBox2.checked = (visitor.analytics === 'true');
      }
    } catch (e) {
      // ignore parse errors
    }

    // Hide the form fields (labels and inputs) but keep the submit button
    if (form) {
      var labels = form.querySelectorAll('label[for="Name"], label[for="Consent"], label[for="Cookies"]');
      labels.forEach(function(l) { l.style.display = 'none'; });
      var inputs = [document.getElementById('namebox'), document.getElementById('Consentcheckbox'), document.getElementById('Cookiescheckbox')];
      inputs.forEach(function(i) { if (i) i.style.display = 'none'; });

      // Remove <br> elements left behind so the box can collapse
      form.querySelectorAll('br').forEach(function(b) { b.parentNode && b.parentNode.removeChild(b); });

      // Replace the header text in the blue wrapper rather than inserting a new message
      var wrapper = form.parentElement;
      if (wrapper) {
        // Find the bold header (<p><b>...</b></p>) and replace its text
        var boldHeader = wrapper.querySelector('p > b');
        if (boldHeader) {
          boldHeader.textContent = 'Consent already granted';
        } else {
          // Fallback: replace first paragraph text
          var firstP = wrapper.querySelector('p');
          if (firstP) firstP.textContent = 'Consent already granted';
        }

        // Compact the wrapper so it shrinks to its content
        wrapper.style.display = 'inline-block';
        wrapper.style.width = '100%';
        wrapper.style.padding = '6px';
      }

      // Ensure submit button remains visible and nicely spaced
      var button = form.querySelector('button[type="submit"]');
      if (button) {
        button.style.display = 'inline-block';
        button.style.marginTop = '6px';
      }
    }

  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Initialize welcome behaviour after DOM ready
  try { welcomeInit(); } catch (e) {}
});

