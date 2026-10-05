/* Grupo Tarar Construcción SL — script.js
   1 Language switch (ES default / EN) · 2 Mobile menu · 3 Quote form · 4 Small effects */
(() => {
  'use strict';
  const doc = document.documentElement;
  doc.classList.add('js');
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  /* ---------- 1. LANGUAGE ----------
     Spanish text lives in the HTML. English lives next to it:
       data-en="..."          -> element text
       data-en-ph="..."       -> placeholder
       data-en-label="..."    -> aria-label
       data-en-content="..."  -> meta content                                */
  const ATTRS = [['data-en', null], ['data-en-ph', 'placeholder'], ['data-en-label', 'aria-label'], ['data-en-content', 'content']];
  const MSG = {
    es: { err: 'Completa tu nombre, un email válido y tu mensaje.', ok: 'Se abrirá tu aplicación de correo con el mensaje listo para enviar.' },
    en: { err: 'Please enter your name, a valid email and your message.', ok: 'Your email app will open with the message ready to send.' }
  };
  const status = $('#form-status');
  let statusKey = '';

  function setStatus(key) {
    statusKey = key;
    status.textContent = key ? MSG[doc.lang][key] : '';
    status.dataset.type = key;
  }

  function setLang(lang) {
    doc.lang = lang;
    ATTRS.forEach(([src, attr]) => $$(`[${src}]`).forEach((el) => {
      const saved = el._es || (el._es = {});
      if (!(src in saved)) saved[src] = attr ? el.getAttribute(attr) : el.textContent;
      const value = lang === 'en' ? el.getAttribute(src) : saved[src];
      if (attr) el.setAttribute(attr, value); else el.textContent = value;
    }));
    $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    setStatus(statusKey);
    try { localStorage.setItem('lang', lang); } catch (e) { /* storage unavailable */ }
  }

  $$('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  try { if (localStorage.getItem('lang') === 'en') setLang('en'); } catch (e) { /* ignore */ }

  /* ---------- 2. MOBILE MENU ---------- */
  const header = $('.site-header');
  const burger = $('.burger');
  const toggle = (open) => {
    header.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => toggle(!header.classList.contains('open')));
  $$('.nav a').forEach((a) => a.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });

  /* ---------- 3. QUOTE FORM ----------
     No backend: the form opens the visitor's email app with the message prepared.
     To use a form service later (Formspree, Netlify...), replace this handler
     with a fetch() to the service URL.                                          */
  const form = $('#quote-form');
  $$('[data-service]').forEach((a) => a.addEventListener('click', () => { form.elements.service.value = a.dataset.service; }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const valid = d.name.trim() && /^\S+@\S+\.\S+$/.test(d.email.trim()) && d.message.trim();
    if (!valid) { setStatus('err'); return; }
    const en = doc.lang === 'en';
    const labels = en ? ['Name', 'Email', 'Phone', 'Service'] : ['Nombre', 'Email', 'Teléfono', 'Servicio'];
    const subject = (en ? 'Quote request - ' : 'Solicitud de presupuesto - ') + d.name.trim();
    const body = [`${labels[0]}: ${d.name}`, `${labels[1]}: ${d.email}`, `${labels[2]}: ${d.phone}`, `${labels[3]}: ${d.service}`, '', d.message].join('\n');
    setStatus('ok');
    location.href = `mailto:info@grupotararconstruccion.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  /* ---------- 4. SMALL EFFECTS ---------- */
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 10), { passive: true });
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, obs) => entries.forEach((x) => {
        if (x.isIntersecting) { x.target.classList.add('in'); obs.unobserve(x.target); }
      }), { threshold: 0.15 })
    : null;
  $$('.reveal').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));
})();
