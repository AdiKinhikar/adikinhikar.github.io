const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.yr').forEach(e => e.textContent = new Date().getFullYear());
 
/* ---- scroll reveal with staggered delays ---- */
const targets = document.querySelectorAll(
  '.hero>*,.page-head>*,main h2,main section .lead,main section>.chips,main section>.wrap>p,.stats>div,.card,.links a,form,.filters,.prose>*,.facts>div,.pn a');
const counts = new Map();
targets.forEach(el => {
  el.classList.add('reveal');
  const i = counts.get(el.parentElement) || 0;
  counts.set(el.parentElement, i + 1);
  el.style.setProperty('--d', Math.min(i * 0.09, 0.45) + 's');
});
 
function countUp(el) {
  const end = +el.dataset.count;
  if (reduce) return;
  const t0 = performance.now(), dur = 1300;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}
 
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    el.classList.add('in');
    setTimeout(() => el.classList.add('done'), 1500);
    el.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
targets.forEach(el => io.observe(el));
 
/* ---- project filters (cards re-animate) ---- */
const btns = document.querySelectorAll('.filters button'),
      cards = document.querySelectorAll('#grid .card');
btns.forEach(b => b.addEventListener('click', () => {
  btns.forEach(x => x.classList.remove('on')); b.classList.add('on');
  let i = 0;
  cards.forEach(c => {
    const show = b.dataset.f === 'all' || c.dataset.t.split(' ').includes(b.dataset.f);
    c.classList.toggle('hide', !show);
    if (!show) return;
    c.classList.remove('in', 'done');
    c.style.setProperty('--d', (i++ * 0.06) + 's');
    void c.offsetWidth;
    c.classList.add('in');
    setTimeout(() => c.classList.add('done'), 1200);
  });
}));
 
/* ---- nav shadow, scroll progress bar, gentle hero parallax ---- */
const nav = document.querySelector('nav'), hero = document.querySelector('.hero');
const bar = document.createElement('div'); bar.id = 'bar'; document.body.appendChild(bar);
let ticking = false;
function onScroll() {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  nav.classList.toggle('scrolled', y > 8);
  bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
  if (hero && !reduce) hero.style.transform = 'translateY(' + Math.min(y * 0.12, 60) + 'px)';
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();
 
/* ---- fade between pages ---- */
document.addEventListener('click', e => {
  const a = e.target.closest('a');
  if (!a || reduce || a.target || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const u = new URL(a.href, location.href);
  if (!/^(https?:|file:)$/.test(u.protocol) || u.origin !== location.origin ||
      (u.pathname === location.pathname)) return;
  e.preventDefault();
  document.body.classList.add('leaving');
  setTimeout(() => location.href = a.href, 260);
});
addEventListener('pageshow', () => document.body.classList.remove('leaving'));
 
/* ---- contact form opens the visitor's email app ---- */
const f = document.getElementById('contact-form');
if (f) f.addEventListener('submit', e => {
  e.preventDefault();
  const n = f.name.value, m = f.email.value, msg = f.message.value;
  location.href = 'mailto:YOUR_EMAIL@olin.edu?subject=' + encodeURIComponent('Portfolio message from ' + n) +
    '&body=' + encodeURIComponent(msg + '\n\n' + n + ' (' + m + ')');
});
 
