/* =============================================
   KEERTHANA CONCEPTS - Enhanced Interactive JS
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
    // --- Header Scroll Effect ---
    const header = document.querySelector('.header');
    const handleScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- Scroll Progress Bar ---
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // --- Back to Top Button ---
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        const toggleBackToTop = () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        };
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
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

    // Close mobile nav on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const href = anchor.getAttribute('href');
            if (!href) return;
            const target = document.querySelector(href);
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
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
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
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach((el, i) => {
        el.style.transitionDelay = `${(i % 4) * 80}ms`;
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
                    counter.textContent = target.toLocaleString() + suffix;
                    return;
                }
                counter.textContent = Math.floor(current).toLocaleString() + suffix;
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
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // Close all
            faqItems.forEach(fi => {
                fi.classList.remove('active');
                fi.querySelector('.faq-answer').style.maxHeight = '0';
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
            let delay = 0;
            programCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const cardEl = card;
                if (filter === 'all' || category === filter) {
                    cardEl.style.display = '';
                    cardEl.style.opacity = '0';
                    cardEl.style.transform = 'translateY(20px) scale(0.97)';
                    setTimeout(() => {
                        cardEl.style.transition = 'opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)';
                        cardEl.style.opacity = '1';
                        cardEl.style.transform = 'translateY(0) scale(1)';
                    }, 50 + delay);
                    delay += 60;
                } else {
                    cardEl.style.opacity = '0';
                    cardEl.style.transform = 'translateY(10px) scale(0.97)';
                    setTimeout(() => {
                        cardEl.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // --- Contact Form Handling & Google Sheets Integration ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        const serviceInput = contactForm.querySelector('#service');
        const classRegistrationDocs = contactForm.querySelector('#classRegistrationDocs');
        const donationDocs = contactForm.querySelector('#donationDocs');
        const classReceiptInput = contactForm.querySelector('#classReceipt');
        const aadharFrontInput = contactForm.querySelector('#aadharFront');
        const aadharBackInput = contactForm.querySelector('#aadharBack');
        const donationReceiptInput = contactForm.querySelector('#donationReceipt');

        function resetFileInput(input) {
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

        // Real-time validation - clear error when user starts typing
        contactForm.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', () => {
                const group = field.closest('.form-group');
                if (group) group.classList.remove('error');
            });
            field.addEventListener('change', () => {
                const group = field.closest('.form-group');
                if (group) group.classList.remove('error');
            });
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let valid = true;
            // Clear previous errors
            contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
            // Validate required fields
            const nameInput = contactForm.querySelector('#name');
            const emailInput = contactForm.querySelector('#email');
            const phoneInput = contactForm.querySelector('#phone');
            const messageInput = contactForm.querySelector('#message');
            if (!nameInput.value.trim()) {
                setError(nameInput);
                valid = false;
            }
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                setError(emailInput);
                valid = false;
            }
            if (!phoneInput.value.trim() || phoneInput.value.trim().length < 10) {
                setError(phoneInput);
                valid = false;
            }
            if (!messageInput.value.trim()) {
                setError(messageInput);
                valid = false;
            }
            const selectedService = (serviceInput.value || '').trim();
            if (selectedService === 'class-registration' && (!classReceiptInput.files || classReceiptInput.files.length === 0)) {
                setError(classReceiptInput);
                valid = false;
            }
            if (selectedService === 'donation') {
                if (!aadharFrontInput.files || aadharFrontInput.files.length === 0) {
                    setError(aadharFrontInput);
                    valid = false;
                }
                if (!aadharBackInput.files || aadharBackInput.files.length === 0) {
                    setError(aadharBackInput);
                    valid = false;
                }
                if (!donationReceiptInput.files || donationReceiptInput.files.length === 0) {
                    setError(donationReceiptInput);
                    valid = false;
                }
            }
            if (valid) {
                const formData = {
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
                            mode: 'no-cors',
                            cache: 'no-cache',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(formData)
                        });
                        showToast('Thank you! Your message has been sent successfully.', 'success');
                    } else {
                        console.warn('Google Sheets URL not configured. Form submitted locally.');
                        showToast('Thank you! Message received (Sheets URL not set).', 'success');
                    }
                    contactForm.reset();
                    toggleDocumentRequirements();
                } catch (error) {
                    console.error('Submission error:', error);
                    showToast('Failed to send. Please check your connection.', 'error');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            } else {
                showToast('Please fill in all required fields correctly.', 'error');
                // Scroll to first error
                const firstError = contactForm.querySelector('.form-group.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
    function setError(input) {
        const group = input.closest('.form-group');
        if (group) group.classList.add('error');
    }
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // --- Toast Notification ---
    function showToast(message, type) {
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
        let ticking = false;
        window.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const x = (e.clientX / window.innerWidth - 0.5) * 20;
                    const y = (e.clientY / window.innerHeight - 0.5) * 20;
                    floatingCards.forEach((card, i) => {
                        const factor = i % 2 === 0 ? 1 : -1;
                        card.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // --- Process Steps Stagger Animation ---
    const stepContainers = document.querySelectorAll('.process-steps');
    stepContainers.forEach(container => {
        const steps = container.querySelectorAll('.step');
        if (steps.length === 0) return;

        steps.forEach(step => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(30px)';
            step.style.transition = 'opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    steps.forEach((step, i) => {
                        setTimeout(() => {
                            step.style.opacity = '1';
                            step.style.transform = 'translateY(0)';
                        }, i * 120);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        observer.observe(container);
    });
});
