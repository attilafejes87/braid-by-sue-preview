(() => {
  'use strict';
  const card = document.getElementById('square-booking');
  const link = document.getElementById('square-booking-link');
  const whatsapp = document.getElementById('whatsapp-enquiry-link');
  if (!card || !link || !whatsapp) return;
  const configuredUrl = String((window.TRESS_SITE_CONFIG || {}).squareBookingUrl || '').trim();
  try {
    const url = new URL(configuredUrl);
    const squareHost = ['squareup.com', 'square.site'].some(domain => url.hostname === domain || url.hostname.endsWith('.' + domain));
    if (url.protocol === 'https:' && squareHost && !url.username && !url.password) link.href = url.href;
  } catch (_) { /* The HTML booking link remains available. */ }
  whatsapp.addEventListener('click', () => document.dispatchEvent(new CustomEvent('tress:whatsapp-enquiry')));
  const query = new URLSearchParams(location.search);
  const wigs = {"copper-bob": {"name": "Copper Bob", "price": 99}, "silky-straight": {"name": "Silky Straight", "price": 139}, "body-wave": {"name": "Soft Body Wave", "price": 149}, "deep-curls": {"name": "Defined Curls", "price": 159}, "beach-wave": {"name": "Beach Wave", "price": 149}, "yaki-straight": {"name": "Yaki Straight", "price": 139}, "balayage-wave": {"name": "Balayage Wave", "price": 169}, "ash-blonde": {"name": "Ash Blonde", "price": 179}, "fringe-bob": {"name": "Highlight Fringe Bob", "price": 129}, "help": {"name": "Help choosing a wig", "price": null}};
  const products = {"cleansing-shampoo": {"name": "Cantu Cleansing Cream Shampoo \u00b7 13.5 oz", "price": 6.99}, "hydrating-conditioner": {"name": "Cantu Hydrating Cream Conditioner \u00b7 13.5 oz", "price": 6.99}, "leave-in-cream": {"name": "Cantu Leave-In Conditioning Cream \u00b7 16 oz", "price": 7.99}, "deep-treatment": {"name": "Cantu Deep Treatment Masque \u00b7 12 oz", "price": 8.99}, "detangling-therapy": {"name": "Aunt Jackie\u2019s Knot On My Watch Detangler \u00b7 355 ml", "price": 8.99}, "olive-styling-gel": {"name": "Eco Style Olive Oil Styling Gel \u00b7 16 oz", "price": 4.99}, "braiding-gel": {"name": "Shine \u2019n Jam Extra Hold Conditioning Gel \u00b7 8 oz / 227 g", "price": 7.99}, "setting-mousse": {"name": "Magic Fingers Setting Mousse \u00b7 12 oz", "price": 7.99}, "castor-oil": {"name": "Sunny Isle Jamaican Black Castor Oil \u00b7 4 oz", "price": 5.99}, "satin-bonnet": {"name": "Magic Black Satin Bonnet \u00b7 XL", "price": 3.99}, "edge-brush": {"name": "T&G Twin Edge Brush \u00b7 1 brush", "price": 2.49}, "afro-comb": {"name": "Essentials Plastic Afro Comb \u00b7 1 comb", "price": 2.49}, "help": {"name": "Help choosing haircare products", "price": null}};
  const styles = {knotless: 'Knotless braids', cornrows: 'Cornrows / feed-in braids', children: 'Children’s braids'};
  const wigKey = query.get('wig') === 'styling' ? 'help' : query.get('wig');
  const wig = Object.hasOwn(wigs, wigKey) ? wigs[wigKey] : null;
  const product = products[query.get('product')];
  const style = styles[query.get('style')];
  const selection = product || wig;
  let message = 'Hi Tress Braid Styles, I’d like a personalised quote. I’ll send my style photo and postcode.';
  if (selection) {
    const title = product ? 'Let’s talk haircare.' : 'Let’s find your next wig.';
    document.getElementById('booking-title').textContent = title;
    document.querySelector('.enquiry-intro > p').textContent = 'Message us on WhatsApp to discuss your selection, availability and price.';
    document.getElementById('booking-enquiry-title').textContent = product ? 'Ask about this product' : 'Ask about this wig';
    document.getElementById('booking-enquiry-copy').textContent = 'We’ll confirm availability and the total price before you order.';
    const label = selection.name + (selection.price == null ? '' : ' · Guide price from £' + selection.price.toFixed(2));
    const selected = document.getElementById('booking-selection');
    selected.textContent = label;
    selected.hidden = false;
    card.hidden = true;
    message = 'Hi Tress Braid Styles, I’d like to ask about ' + label + '.';
    document.getElementById('booking-enquiry-note').textContent = 'An enquiry is not an order. We’ll confirm the exact item, total price and any delivery or collection arrangements before you pay.';
  } else if (style) {
    document.getElementById('booking-title').textContent = 'Let’s plan your ' + style.toLowerCase() + '.';
    message = 'Hi Tress Braid Styles, I’d like a quote for ' + style.toLowerCase() + '. I’ll send my style photo and postcode.';
  }
  const chat = new URL('https://wa.me/447901368390');
  chat.searchParams.set('text', message);
  whatsapp.href = chat.href;
})();
