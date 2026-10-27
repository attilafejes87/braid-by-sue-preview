(() => {
  'use strict';
  const card = document.getElementById('square-booking');
  if (!card) return;
  // Collection enquiries keep their existing, prefilled enquiry flow.
  const query = new URLSearchParams(location.search);
  if (query.has('wig') || query.has('product')) return;
  const configuredUrl = String((window.TRESS_SITE_CONFIG || {}).squareBookingUrl || '').trim();
  if (!configuredUrl) return;
  let url;
  try { url = new URL(configuredUrl); } catch (_) { return; }
  const host = url.hostname;
  const squareHost = ['squareup.com', 'square.site'].some(domain => host === domain || host.endsWith('.' + domain));
  if (url.protocol !== 'https:' || !squareHost || url.username || url.password) return;
  const link = document.getElementById('square-booking-link');
  if (!link) return;
  link.href = url.href;
  card.hidden = false;
})();
