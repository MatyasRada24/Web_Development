/* =============================================
   script.js — navigace, video, scroll efekty, formulář
   ============================================= */

// Endpoint pro odesílání formuláře bez nutnosti e-mailového klienta u klienta.
// Výchozí: FormSubmit (odesílá přímo na matyas.rada08@gmail.com)
// Pro Formspree vložte vaše ID: 'https://formspree.io/f/VASI_ID_KOD'
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/matyas.rada08@gmail.com';
const RECIPIENT = 'matyas.rada08@gmail.com';

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// ── Scrollovaná navigace ──
window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
});

// ── Mobilní hamburger menu ──
if (navToggle && navLinks) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    navToggle.setAttribute('aria-label', isActive ? 'Zavřít menu' : 'Otevřít menu');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Otevřít menu');
    });
  });

  document.addEventListener('click', (e) => {
    if (navbar && !navbar.contains(e.target) && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Otevřít menu');
    }
  });
}

// ── Hladký posun po kliknutí na kotvy ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Video na pozadí — podpora prefers-reduced-motion ──
const heroVideo = document.querySelector('.hero-video');
if (heroVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroVideo.pause();
}

// ── Animation observer (Fade-in scroll) ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── Pomocná funkce pro předvyplnění a plynulý posun k formuláři ──
function prefillAndScrollToContact({ project, budget, message }) {
  const projectSelect = document.getElementById('project');
  const budgetSelect = document.getElementById('budget');
  const messageTextarea = document.getElementById('message');

  if (projectSelect && project) {
    for (let opt of projectSelect.options) {
      if (opt.value === project || opt.value.includes(project.split(' ')[0])) {
        projectSelect.value = opt.value;
        break;
      }
    }
  }

  if (budgetSelect && budget) {
    for (let opt of budgetSelect.options) {
      if (opt.value === budget) {
        budgetSelect.value = opt.value;
        break;
      }
    }
  }

  if (messageTextarea && message) {
    messageTextarea.value = message;
  }

  const formTarget = document.querySelector('.contact-form') || document.getElementById('contact');
  if (formTarget) {
    formTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ── Karty ceníku — předvyplnění formuláře a posun ke kontaktům ──
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('click', () => {
    const nameEl = card.querySelector('.pricing-name');
    const priceEl = card.querySelector('.pricing-price');

    const projectName = card.dataset.project || (nameEl ? nameEl.textContent.trim() : '');
    const budgetVal = card.dataset.budget || '';
    const priceText = priceEl ? priceEl.textContent.replace(/\s+/g, ' ').trim() : '';

    prefillAndScrollToContact({
      project: projectName,
      budget: budgetVal,
      message: `Dobrý den,\nmám zájem o ${projectName} (${priceText}).`
    });
  });
});

// ── FAQ Akordeon ──
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    if (!item) return;
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item.active').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('active');
        const q = openItem.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      }
    });

    item.classList.toggle('active', !isActive);
    btn.setAttribute('aria-expanded', (!isActive).toString());
  });
});

// ── Interaktivní Kalkulačka / Konfigurátor ──
(function initConfigurator() {
  const calcType = document.getElementById('calcType');
  const calcDocs = document.getElementById('calcDocs');
  const calcSpeed = document.getElementById('calcSpeed');
  const priceDisplay = document.getElementById('calcTotalPrice');
  const timeDisplay = document.getElementById('calcTotalTime');
  const submitBtn = document.getElementById('configToContactBtn');

  if (!calcType || !calcDocs || !calcSpeed || !priceDisplay || !timeDisplay) return;

  function setupOptionGroup(container) {
    const opts = container.querySelectorAll('.config-opt');
    opts.forEach(opt => {
      opt.addEventListener('click', () => {
        opts.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        calculateTotal();
      });
    });
  }

  setupOptionGroup(calcType);
  setupOptionGroup(calcDocs);
  setupOptionGroup(calcSpeed);

  function calculateTotal() {
    const activeType = calcType.querySelector('.config-opt.active');
    const activeDocs = calcDocs.querySelector('.config-opt.active');
    const activeSpeed = calcSpeed.querySelector('.config-opt.active');

    if (!activeType || !activeDocs || !activeSpeed) return;

    const basePrice = parseInt(activeType.dataset.price || '10000', 10);
    const docsExtra = parseInt(activeDocs.dataset.extra || '0', 10);
    const speedExtra = parseInt(activeSpeed.dataset.extra || '0', 10);

    const total = basePrice + docsExtra + speedExtra;
    priceDisplay.textContent = total.toLocaleString('cs-CZ') + ' Kč';

    let timeText = activeType.dataset.time || '2–3 týdny';
    if (activeSpeed.dataset.name && activeSpeed.dataset.name.includes('Expresní')) {
      timeText = 'do 10 dnů';
    }
    timeDisplay.textContent = timeText;
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const activeType = calcType.querySelector('.config-opt.active');
      const activeDocs = calcDocs.querySelector('.config-opt.active');
      const activeSpeed = calcSpeed.querySelector('.config-opt.active');

      const typeName = activeType ? activeType.dataset.name : '';
      const docsName = activeDocs ? activeDocs.dataset.name : '';
      const speedName = activeSpeed ? activeSpeed.dataset.name : '';
      const budgetVal = activeType ? activeType.dataset.budget : '';
      const totalPrice = priceDisplay.textContent;
      const totalTime = timeDisplay.textContent;

      prefillAndScrollToContact({
        project: typeName,
        budget: budgetVal,
        message: `Dobrý den,\nmám zájem o ${typeName}.\n\nKonfigurace:\n- Podklady: ${docsName}\n- Termín: ${speedName}\n- Orientační výpočet: ${totalPrice} (odhadovaná doba ${totalTime}).`
      });
    });
  }

  calculateTotal();
})();

// ── Kontaktní formulář — fetch() s Formspree a fallbackem na mailto ──
const contactForm = document.querySelector('.contact-form form');
const formStatus = document.getElementById('formStatus');
const formSubmitBtn = document.getElementById('formSubmitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const projectEl = document.getElementById('project');
    const budgetEl = document.getElementById('budget');
    const messageEl = document.getElementById('message');
    const honeypotEl = document.getElementById('honeypot');

    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const project = projectEl ? projectEl.value : '';
    const budget = budgetEl ? budgetEl.value : '';
    const message = messageEl ? messageEl.value.trim() : '';
    const honeypotVal = honeypotEl ? honeypotEl.value.trim() : '';

    // Honeypot ochrana proti spambotům — pokud bot vyplnil skryté pole, předstíráme odeslání bez akce
    if (honeypotVal) {
      showFormStatus('Děkuji! Vaše zpráva byla úspěšně odeslána.', 'success');
      contactForm.reset();
      return;
    }

    if (!name || !email) {
      showFormStatus('Vyplňte prosím jméno a e-mail.', 'error');
      return;
    }

    setFormDisabled(true);
    showFormStatus('Odesílám zprávu...', '');

    const payload = {
      name,
      email,
      // FormSubmit tímto polem nastaví hlavičku Reply-To.
      // Kliknutí na „Odpovědět" ve schránce tak zamíří rovnou
      // klientovi, ne technické adrese FormSubmitu.
      _replyto: email,
      _subject: `Nová poptávka: ${project || 'Webový projekt'} od ${name}`,
      project: project || 'Nespecifikováno',
      budget: budget || 'Nespecifikováno',
      message: message || 'Bez zprávy',
      _honey: '',
      _captcha: 'false'
    };

    try {
      if (FORM_ENDPOINT && !FORM_ENDPOINT.includes('YOUR_FORM_ID')) {
        const response = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          showFormStatus('Děkuji! Vaše zpráva byla úspěšně odeslána. Brzy se vám ozvu.', 'success');
          contactForm.reset();
        } else {
          const data = await response.json().catch(() => ({}));
          showFormStatus(data.message || data.error || 'Při odesílání došlo k chybě. Zkuste to prosím znovu.', 'error');
        }
      } else {
        // Záložní odeslání přes mailto klient
        const subject = `Poptávka webu: ${project || 'nový projekt'}`;
        const body =
          `Jméno: ${name}\n` +
          `E-mail: ${email}\n` +
          `Typ projektu: ${project || '-'}\n` +
          `Orientační rozpočet: ${budget || '-'}\n\n` +
          `Zpráva:\n${message}`;

        window.location.href = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        showFormStatus('Otevírám váš e-mailový klient pro odeslání zprávy. Děkuji!', 'success');
        contactForm.reset();
      }
    } catch (err) {
      showFormStatus('Při připojení došlo k chybě. Zkuste to prosím znovu.', 'error');
    } finally {
      setFormDisabled(false);
    }
  });
}

function setFormDisabled(disabled) {
  if (!contactForm) return;
  const inputs = contactForm.querySelectorAll('input, select, textarea, button');
  inputs.forEach(el => el.disabled = disabled);
  if (formSubmitBtn) {
    formSubmitBtn.textContent = disabled ? 'Odesílám...' : 'Odeslat zprávu';
  }
}

function showFormStatus(msg, type) {
  if (!formStatus) return;
  formStatus.textContent = msg;
  formStatus.className = `form-status active ${type}`.trim();
}

// ── Pronásledující kurzor ──
(function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const follower = document.getElementById('cursorFollower');
  if (!dot || !follower) return;

  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;
  let isVisible = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      dot.classList.add('visible');
      follower.classList.add('visible');
      followerX = mouseX;
      followerY = mouseY;
    }

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  document.addEventListener('mouseleave', () => {
    isVisible = false;
    dot.classList.remove('visible');
    follower.classList.remove('visible');
  });

  function animateFollower() {
    if (isVisible) {
      followerX += (mouseX - followerX) * 0.32;
      followerY += (mouseY - followerY) * 0.32;
      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const interactiveSelectors = 'a, button, input, select, textarea, .journey-card, .fit-card, .pricing-card, .faq-item, .contact-method, .config-opt';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      document.body.classList.remove('cursor-hover');
    }
  });
})();
