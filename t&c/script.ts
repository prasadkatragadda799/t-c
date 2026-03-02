/* =============================================
   KEERTHANA CONCEPTS - Interactive TypeScript
   ============================================= */

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  classReceiptDocument?: string;
  aadharFrontDocument?: string;
  aadharBackDocument?: string;
  donationReceiptDocument?: string;
}

document.addEventListener('DOMContentLoaded', () => {

  // --- Header Scroll Effect ---
  const header = document.querySelector('.header') as HTMLElement;
  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Mobile Navigation ---
  const hamburger = document.querySelector('.hamburger') as HTMLElement;
  const mobileNav = document.querySelector('.mobile-nav') as HTMLElement;
  const mobileLinks = mobileNav.querySelectorAll('a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href) as HTMLElement;
      if (target) {
        const offset = header.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Active Nav Section Highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const highlightNav = () => {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      const top = (section as HTMLElement).offsetTop;
      const bottom = top + (section as HTMLElement).offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach((el, i) => {
    (el as HTMLElement).style.transitionDelay = `${(i % 4) * 100}ms`;
    revealObserver.observe(el);
  });

  // --- Animated Counters ---
  const counters = document.querySelectorAll('.stat-num');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0');
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current >= target) {
          counter.textContent = target + suffix;
          return;
        }
        counter.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
      };
      requestAnimationFrame(updateCounter);
    });
  };

  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.unobserve(statsSection);
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question') as HTMLElement;
    const answer = item.querySelector('.faq-answer') as HTMLElement;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(fi => {
        fi.classList.remove('active');
        (fi.querySelector('.faq-answer') as HTMLElement).style.maxHeight = '0';
      });

      // Open clicked (if wasn't active)
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // --- Program Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      programCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const cardEl = card as HTMLElement;
        if (filter === 'all' || category === filter) {
          cardEl.style.display = '';
          cardEl.style.opacity = '0';
          cardEl.style.transform = 'translateY(20px)';
          setTimeout(() => {
            cardEl.style.transition = 'opacity 0.4s, transform 0.4s';
            cardEl.style.opacity = '1';
            cardEl.style.transform = 'translateY(0)';
          }, 50);
        } else {
          cardEl.style.display = 'none';
        }
      });
    });
  });

  // --- Contact Form Handling & Google Sheets Integration ---
  const contactForm = document.getElementById('contactForm') as HTMLFormElement;
  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalBtnText = submitBtn.innerHTML;
    const serviceInput = contactForm.querySelector('#service') as HTMLSelectElement;
    const classRegistrationDocs = contactForm.querySelector('#classRegistrationDocs') as HTMLElement | null;
    const donationDocs = contactForm.querySelector('#donationDocs') as HTMLElement | null;
    const classReceiptInput = contactForm.querySelector('#classReceipt') as HTMLInputElement | null;
    const aadharFrontInput = contactForm.querySelector('#aadharFront') as HTMLInputElement | null;
    const aadharBackInput = contactForm.querySelector('#aadharBack') as HTMLInputElement | null;
    const donationReceiptInput = contactForm.querySelector('#donationReceipt') as HTMLInputElement | null;

    function resetFileInput(input: HTMLInputElement | null) {
      if (input) input.value = '';
    }

    function toggleDocumentRequirements() {
      const selected = (serviceInput?.value || '').trim();
      const isClassRegistration = selected === 'class-registration';
      const isDonation = selected === 'donation';

      if (classRegistrationDocs) classRegistrationDocs.hidden = !isClassRegistration;
      if (donationDocs) donationDocs.hidden = !isDonation;

      if (classReceiptInput) classReceiptInput.required = isClassRegistration;
      if (aadharFrontInput) aadharFrontInput.required = isDonation;
      if (aadharBackInput) aadharBackInput.required = isDonation;
      if (donationReceiptInput) donationReceiptInput.required = isDonation;

      if (!isClassRegistration) {
        resetFileInput(classReceiptInput);
        classRegistrationDocs?.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
      }
      if (!isDonation) {
        resetFileInput(aadharFrontInput);
        resetFileInput(aadharBackInput);
        resetFileInput(donationReceiptInput);
        donationDocs?.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
      }
    }

    toggleDocumentRequirements();
    if (serviceInput) {
      serviceInput.addEventListener('change', toggleDocumentRequirements);
    }

    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        const group = (field as HTMLElement).closest('.form-group');
        if (group) group.classList.remove('error');
      });
      field.addEventListener('change', () => {
        const group = (field as HTMLElement).closest('.form-group');
        if (group) group.classList.remove('error');
      });
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      // Validate required fields
      const nameInput = contactForm.querySelector('#name') as HTMLInputElement;
      const emailInput = contactForm.querySelector('#email') as HTMLInputElement;
      const phoneInput = contactForm.querySelector('#phone') as HTMLInputElement;
      const messageInput = contactForm.querySelector('#message') as HTMLTextAreaElement;

      if (!nameInput.value.trim()) { setError(nameInput); valid = false; }
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) { setError(emailInput); valid = false; }
      if (!phoneInput.value.trim() || phoneInput.value.trim().length < 10) { setError(phoneInput); valid = false; }
      if (!messageInput.value.trim()) { setError(messageInput); valid = false; }
      const selectedService = (serviceInput.value || '').trim();
      if (selectedService === 'class-registration' && (!classReceiptInput?.files || classReceiptInput.files.length === 0)) {
        if (classReceiptInput) setError(classReceiptInput);
        valid = false;
      }
      if (selectedService === 'donation') {
        if (!aadharFrontInput?.files || aadharFrontInput.files.length === 0) {
          if (aadharFrontInput) setError(aadharFrontInput);
          valid = false;
        }
        if (!aadharBackInput?.files || aadharBackInput.files.length === 0) {
          if (aadharBackInput) setError(aadharBackInput);
          valid = false;
        }
        if (!donationReceiptInput?.files || donationReceiptInput.files.length === 0) {
          if (donationReceiptInput) setError(donationReceiptInput);
          valid = false;
        }
      }

      if (valid) {
        const formData: ContactFormData = {
          name: nameInput.value,
          email: emailInput.value,
          phone: phoneInput.value,
          service: serviceInput.value,
          message: messageInput.value,
          classReceiptDocument: classReceiptInput?.files?.[0]?.name || '',
          aadharFrontDocument: aadharFrontInput?.files?.[0]?.name || '',
          aadharBackDocument: aadharBackInput?.files?.[0]?.name || '',
          donationReceiptDocument: donationReceiptInput?.files?.[0]?.name || ''
        };

        // UI Loading State
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        try {
          // Google Sheets Submission
          const SCRIPT_URL = contactForm.getAttribute('data-sheet-url');
          if (SCRIPT_URL && SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
            await fetch(SCRIPT_URL, {
              method: 'POST',
              mode: 'no-cors', // Google Apps Script requires no-cors for simple redirects
              cache: 'no-cache',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
            });
            showToast('Thank you! Your message has been saved to Google Sheets and sent successfully.', 'success');
          } else {
            console.warn('Google Sheets URL not configured. Form submitted locally.');
            showToast('Thank you! Message received (Sheets URL not set).', 'success');
          }

          contactForm.reset();
          toggleDocumentRequirements();
        } catch (error) {
          console.error('Submission error:', error);
          showToast('Failed to connect to Google Sheets. Please check your URL or connection.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      } else {
        showToast('Please fill in all required fields correctly.', 'error');
      }
    });
  }

  function setError(input: HTMLElement) {
    const group = input.closest('.form-group');
    if (group) group.classList.add('error');
  }

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // --- Toast Notification ---
  function showToast(message: string, type: 'success' | 'error') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // --- Parallax floating elements ---
  const floatingCards = document.querySelectorAll('.floating-card');
  if (floatingCards.length && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      floatingCards.forEach((card, i) => {
        const factor = i % 2 === 0 ? 1 : -1;
        (card as HTMLElement).style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    }, { passive: true });
  }

  // --- Process Steps Stagger Animation ---
  const steps = document.querySelectorAll('.step');
  const stepsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const allSteps = entry.target.parentElement?.querySelectorAll('.step');
        if (allSteps) {
          allSteps.forEach((step, i) => {
            setTimeout(() => {
              (step as HTMLElement).style.opacity = '1';
              (step as HTMLElement).style.transform = 'translateY(0)';
            }, i * 150);
          });
        }
        stepsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (steps.length > 0) {
    steps.forEach(step => {
      const stepEl = step as HTMLElement;
      stepEl.style.opacity = '0';
      stepEl.style.transform = 'translateY(30px)';
      stepEl.style.transition = 'opacity 0.5s, transform 0.5s';
    });
    stepsObserver.observe(steps[0]);
  }

});
