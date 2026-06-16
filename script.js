/* ============================================================
   CyberAcademy — script.js
   Telegram: Bot & Chat settings
============================================================ */
const BOT_TOKEN = '8858737351:AAEY7YiD2kOzktwZpJ_pBKMk7niU_uAIHIo';
const CHAT_ID   = '8709273671';

/* ============================================================
   1. NAVBAR — scroll effect + burger
============================================================ */
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

burger.addEventListener('click', () => {
  drawer.classList.toggle('open');
});

// close drawer when a link is clicked
document.querySelectorAll('.drawer-link').forEach(link => {
  link.addEventListener('click', () => drawer.classList.remove('open'));
});

/* ============================================================
   2. MATRIX RAIN
============================================================ */
(function initMatrix() {
  const canvas = document.getElementById('matrix');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, cols, drops;

  function setup() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols  = Math.floor(W / 14);
    drops = Array(cols).fill(1);
  }
  setup();
  window.addEventListener('resize', setup);

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%アイウエオカキクケコ';
  setInterval(() => {
    ctx.fillStyle = 'rgba(4,12,18,0.05)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#00ff88';
    ctx.font = '13px Share Tech Mono';
    for (let i = 0; i < drops.length; i++) {
      ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * 14, drops[i] * 14);
      if (drops[i] * 14 > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }, 50);
})();

/* ============================================================
   3. FLOATING PARTICLES
============================================================ */
(function initParticles() {
  const wrap = document.getElementById('particles');
  if (!wrap) return;
  for (let i = 0; i < 45; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    const s = Math.random() * 2.5 + 0.5;
    el.style.cssText =
      `left:${Math.random()*100}%;` +
      `width:${s}px;height:${s}px;` +
      `animation-duration:${Math.random()*14+10}s;` +
      `animation-delay:${Math.random()*12}s;`;
    wrap.appendChild(el);
  }
})();

/* ============================================================
   4. ANIMATED COUNTERS
============================================================ */
function animateCounters() {
  document.querySelectorAll('.counter-val').forEach(el => {
    const target = +el.dataset.target;
    const dur    = 1800;
    const step   = 16;
    const steps  = dur / step;
    let cur = 0;
    const inc = target / steps;
    const t = setInterval(() => {
      cur = Math.min(cur + inc, target);
      el.textContent = Math.floor(cur);
      if (cur >= target) clearInterval(t);
    }, step);
  });
}

/* ============================================================
   5. SCROLL REVEAL — Intersection Observer
============================================================ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');

    // trigger counter animation when hero section visible
    if (entry.target.classList.contains('counters')) animateCounters();

    // trigger progress bar fills in curriculum
    entry.target.querySelectorAll?.('.cur-fill').forEach(bar => {
      bar.classList.add('animated');
    });

    // seats bar
    const seat = entry.target.querySelector?.('.seats-fill');
    if (seat) seat.style.animationPlayState = 'running';

    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.15 });

// Observe elements
const toReveal = [
  '.counters',
  '.bento-card',
  '.cur-card',
  '.cur-grid',
  '.info-card',
  '.seats-bar-wrap',
];
toReveal.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    el.style.transitionDelay = '0s';
    revealObs.observe(el);
  });
});

// stagger bento cards
document.querySelectorAll('.bento-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.07}s`;
});
document.querySelectorAll('.info-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.06}s`;
});

// mark visible
const markObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

toReveal.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => markObs.observe(el));
});

/* ============================================================
   6. CURSOR SPOTLIGHT on form card
============================================================ */
const formGlass = document.querySelector('.form-glass');
if (formGlass) {
  formGlass.addEventListener('mousemove', e => {
    const r = formGlass.getBoundingClientRect();
    formGlass.style.setProperty('--mx', `${e.clientX - r.left}px`);
    formGlass.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}

/* ============================================================
   7. PHONE INPUT FORMATTER
============================================================ */
document.getElementById('phone').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 9);
  let f = '';
  if (v.length > 0) f += v.slice(0, 2);
  if (v.length > 2) f += ' ' + v.slice(2, 5);
  if (v.length > 5) f += ' ' + v.slice(5, 7);
  if (v.length > 7) f += ' ' + v.slice(7, 9);
  this.value = f;
});

/* ============================================================
   8. TELEGRAM SEND
============================================================ */
async function sendToTelegram(name, phone) {
  const now  = new Date();
  const time = now.toLocaleString('uz-UZ', { timeZone:'Asia/Tashkent', dateStyle:'short', timeStyle:'short' });
  const text =
    `🛡️ *CyberAcademy — Yangi ro'yxat!*\n\n` +
    `👤 *Ism:* ${name}\n` +
    `📱 *Telefon:* +998 ${phone}\n` +
    `🕐 *Vaqt:* ${time}\n\n` +
    `✅ Yangi talabgor kursga qo'shilmoqchi!`;

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' })
  });
  if (!res.ok) {
    const e = await res.json();
    throw new Error(e.description || 'Telegram xatosi');
  }
}

/* ============================================================
   9. FORM SUBMIT
============================================================ */
const form      = document.getElementById('registerForm');
const submitBtn = document.getElementById('submitBtn');
const btnText   = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');
const btnArrow  = submitBtn.querySelector('.btn-arrow');

form.addEventListener('submit', async e => {
  e.preventDefault();
  clearErrors();

  const name  = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  let ok = true;

  if (!name || name.length < 3) {
    setError('nameField', 'nameErr', "Iltimos, to'liq ismingizni kiriting");
    ok = false;
  }
  if (phone.replace(/\D/g,'').length < 9) {
    setError('phoneField', 'phoneErr', "Telefon raqamini to'liq kiriting");
    ok = false;
  }
  if (!ok) return;

  setLoading(true);
  try {
    await sendToTelegram(name, phone);
    form.reset();
    showModal();
  } catch {
    showToast('❌ Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
  } finally {
    setLoading(false);
  }
});

function setLoading(on) {
  submitBtn.disabled      = on;
  btnText.style.display   = on ? 'none' : 'inline';
  btnLoader.style.display = on ? 'flex' : 'none';
  btnArrow.style.display  = on ? 'none' : 'inline';
}

function setError(fieldId, errId, msg) {
  document.getElementById(fieldId).classList.add('has-error');
  document.getElementById(errId).textContent = '⚠ ' + msg;
  document.getElementById(fieldId).querySelector('input').addEventListener('focus', () => {
    document.getElementById(fieldId).classList.remove('has-error');
    document.getElementById(errId).textContent = '';
  }, { once: true });
}

function clearErrors() {
  document.querySelectorAll('.fg-field').forEach(f => f.classList.remove('has-error'));
  document.querySelectorAll('.field-err').forEach(e => e.textContent = '');
}

/* ============================================================
   10. MODAL
============================================================ */
const overlay  = document.getElementById('modalOverlay');
const closeBtn = document.getElementById('modalClose');
const dismiss  = document.getElementById('modalDismiss');

function showModal() {
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function hideModal() {
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', hideModal);
dismiss.addEventListener('click', hideModal);
overlay.addEventListener('click', e => { if (e.target === overlay) hideModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') hideModal(); });

/* ============================================================
   11. ERROR TOAST
============================================================ */
function showToast(msg) {
  document.querySelector('.err-toast')?.remove();
  const t = document.createElement('div');
  t.className = 'err-toast';
  t.style.cssText = `
    position:fixed; bottom:28px; left:50%; transform:translateX(-50%);
    background:rgba(20,5,5,.95); border:1px solid #f87171; color:#fca5a5;
    padding:12px 24px; border-radius:12px; font-size:13px;
    font-family:var(--f-mono); z-index:9999;
    backdrop-filter:blur(12px);
    animation:toastIn .3s ease;
    box-shadow:0 8px 32px rgba(248,113,113,.2);
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  const s = document.createElement('style');
  s.textContent = `@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`;
  document.head.appendChild(s);
  setTimeout(() => t.remove(), 4000);
}

/* ============================================================
   12. TYPING BADGE
============================================================ */
(function typingBadge() {
  const texts = ["Yangi guruh — 2024", "Faqat 20 ta joy!", "Hoziroq ro'yxatdan o'ting!"];
  const el = document.querySelector('.pill-text');
  if (!el) return;
  let ti = 0, ci = 0, del = false;
  function tick() {
    const full = texts[ti];
    ci = del ? ci - 1 : ci + 1;
    el.textContent = full.slice(0, ci);
    if (!del && ci === full.length) { setTimeout(() => { del = true; }, 2200); }
    else if (del && ci === 0) { del = false; ti = (ti + 1) % texts.length; }
    setTimeout(tick, del ? 35 : 75);
  }
  setTimeout(tick, 900);
})();
