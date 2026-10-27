(() => {
  'use strict';
  const config = window.TRESS_SITE_CONFIG || {};
  const pixelId = String(config.metaPixelId || '').trim();
  const configured = /^\d{10,20}$/.test(pixelId);
  const enabled = configured && (config.trackingHosts || []).includes(location.hostname);
  const choiceKey = 'tress-marketing-consent-v1';
  const pendingKey = 'tress-enquiry-return-v1';
  const choiceLifetime = 180 * 24 * 60 * 60 * 1000;
  let choice = null;
  let started = false;
  let pageRecorded = false;
  let previousFocus = null;
  let panel;

  function storageGet(type, key) { try { return JSON.parse(window[type].getItem(key)); } catch (_) { return null; } }
  function removePending() { try { sessionStorage.removeItem(pendingKey); } catch (_) {} }
  function clearMarketingCookies() {
    for (const name of ['_fbp', '_fbc']) {
      for (const domain of ['', location.hostname, '.tressbraidstyles.co.uk']) {
        document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax' + (domain ? '; Domain=' + domain : '');
      }
    }
  }
  function readChoice() {
    const saved = storageGet('localStorage', choiceKey);
    if (!saved || saved.version !== 1 || !['accepted', 'rejected'].includes(saved.value) || !Number.isFinite(saved.at) || saved.at > Date.now() || Date.now() - saved.at >= choiceLifetime) return null;
    return saved.value;
  }
  function reportStatus() {
    const status = document.getElementById('marketing-cookie-status');
    if (status) status.textContent = !configured ? 'Meta Pixel is not currently enabled on this website.' : !enabled ? 'Meta Pixel does not run on this preview.' : choice === 'accepted' ? 'Optional Meta advertising measurement is allowed. You can change your choice below.' : choice === 'rejected' ? 'Optional Meta advertising measurement is off.' : 'Optional Meta advertising measurement is off until you choose to allow it.';
  }
  function track(eventName, parameters) {
    if (enabled && started && choice === 'accepted') window.fbq('trackSingle', pixelId, eventName, parameters || {});
  }
  function recordPage() {
    if (pageRecorded) return;
    pageRecorded = true;
    track('PageView');
    const page = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    if (page === '/wigs' || page === '/products') track('ViewContent', { content_name: page === '/wigs' ? 'Wig collection' : 'Haircare collection' });

  }
  function startPixel() {
    if (!enabled || choice !== 'accepted') return;
    if (!started) {
      // Meta's standard bootstrap, created only after affirmative consent.
      const fbq = window.fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
      if (!window._fbq) window._fbq = fbq;
      fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
      fbq.disablePushState = true;
      fbq('consent', 'grant');
      // Disable automatic form/button detection and automatic advanced matching.
      fbq('set', 'autoConfig', false, pixelId);
      fbq('init', pixelId);
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
      started = true;
    }
    recordPage();
  }
  function closePanel() {
    panel.hidden = true;
    if (previousFocus && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
  }
  function saveChoice(value) {
    choice = value;
    try { localStorage.setItem(choiceKey, JSON.stringify({ version: 1, value, at: Date.now() })); } catch (_) {}
    closePanel();
    reportStatus();
    if (value === 'accepted') startPixel();
    else {
      removePending();
      clearMarketingCookies();
      if (started) {
        window.fbq('consent', 'revoke');
        // Unload the third-party library as well as stopping its events.
        location.reload();
      }
    }
  }
  choice = readChoice();
  reportStatus();
  if (!enabled) return;

  panel = document.createElement('section');
  panel.className = 'cookie-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', 'cookie-panel-title');
  panel.innerHTML = '<h2 id="cookie-panel-title">Your privacy choices</h2><p>With your permission, we use Meta Pixel to measure Facebook and Instagram advertising and help show relevant ads. Meta receives information about your visit, device and actions such as opening an enquiry chat. We do not send your form answers or photos to the pixel. You can use the whole website without allowing this. <a href="/privacy">Privacy &amp; cookie details</a>.</p><div class="cookie-actions"><button type="button" data-choice="rejected">Reject optional cookies</button><button type="button" data-choice="accepted">Allow Meta cookies</button><button type="button" class="cookie-close" hidden>Keep current choice</button></div>';
  document.body.appendChild(panel);
  panel.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => saveChoice(button.dataset.choice)));
  panel.querySelector('.cookie-close').addEventListener('click', closePanel);

  const settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'cookie-settings';
  settings.textContent = 'Cookie settings';
  settings.setAttribute('aria-controls', 'tress-cookie-panel');
  panel.id = 'tress-cookie-panel';
  function openSettings() {
    previousFocus = document.activeElement;
    panel.hidden = false;
    panel.querySelector('.cookie-close').hidden = !choice;
    panel.querySelector('button').focus({ preventScroll: true });
  }
  settings.addEventListener('click', openSettings);
  const settingsContainer = document.getElementById('cookie-settings-slot') || document.createElement('div');
  if (!settingsContainer.id) {
    settingsContainer.className = 'cookie-settings-wrap';
    (document.querySelector('footer') || document.body).appendChild(settingsContainer);
  }
  settingsContainer.appendChild(settings);
  panel.addEventListener('keydown', event => { if (event.key === 'Escape' && choice) closePanel(); });
  if (choice === 'accepted') startPixel();
  else {
    clearMarketingCookies();
    removePending();
    if (!choice) panel.hidden = false;
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented) return;
    const target = new URL(link.href, location.href);
    if (['www.facebook.com', 'facebook.com', 'm.me', 'www.instagram.com', 'instagram.com'].includes(target.hostname)) track('Contact', { content_name: target.hostname.includes('instagram') ? 'Instagram' : 'Facebook' });
  });
  // Opening a prepared message is a Contact event, never proof of a sent message.
  document.addEventListener('tress:whatsapp-enquiry', () => track('Contact', { content_name: 'WhatsApp enquiry' }));
  window.addEventListener('storage', event => {
    if (event.key !== choiceKey) return;
    const wasAccepted = choice === 'accepted';
    choice = readChoice();
    reportStatus();
    if (choice === 'accepted') { panel.hidden = true; startPixel(); }
    else {
      clearMarketingCookies(); removePending();
      if (wasAccepted && started) { window.fbq('consent', 'revoke'); location.reload(); }
      else panel.hidden = Boolean(choice);
    }
  });
})();
