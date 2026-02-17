/* ============================================
   DARSHAN KATESHIYA — PORTFOLIO
   JavaScript — Interactions & Animations
   ============================================ */

(function () {
    'use strict';

    // ========== NAVIGATION ==========
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav__toggle');
    const navMobile = document.querySelector('.nav__mobile');

    // Scroll effect
    if (nav) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 60) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // Mobile menu toggle
    if (navToggle && navMobile) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.classList.contains('open');
            navToggle.classList.toggle('open');
            navMobile.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });

        // Close mobile menu on link click
        const mobileLinks = navMobile.querySelectorAll('.nav__mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMobile.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Active nav link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath ||
            (href !== '/' && currentPath.includes(href)) ||
            (currentPath.endsWith('/index.html') && (href === '/' || href === 'index.html'))) {
            link.classList.add('active');
        }
    });

    // ========== SCROLL REVEAL ANIMATIONS ==========
    const revealElements = document.querySelectorAll('.reveal, .stagger-children');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // ========== CUSTOM CURSOR (Desktop only) ==========
    const cursor = document.querySelector('.custom-cursor');
    const workItems = document.querySelectorAll('.work-item');

    if (cursor && window.matchMedia('(hover: hover)').matches) {
        let cursorX = 0, cursorY = 0;
        let targetX = 0, targetY = 0;

        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        function updateCursor() {
            cursorX += (targetX - cursorX) * 0.15;
            cursorY += (targetY - cursorY) * 0.15;

            cursor.style.left = cursorX - 40 + 'px';
            cursor.style.top = cursorY - 40 + 'px';

            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        workItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            item.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });
    }

    // ========== PAGE TRANSITIONS ==========
    const transitionOverlay = document.querySelector('.page-transition');
    const transitionLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not([target="_blank"])');

    if (transitionOverlay) {
        transitionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
                    e.preventDefault();
                    transitionOverlay.classList.add('active');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 400);
                }
            });
        });
    }

    // ========== SMOOTH SCROLL TO TOP ==========
    const backToTop = document.querySelector('.footer__back-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== CONTACT FORM ==========
    const contactForm = document.querySelector('.contact-form');
    const formSuccess = document.querySelector('.form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate form submission
            const submitBtn = contactForm.querySelector('.btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                if (formSuccess) {
                    formSuccess.classList.add('show');
                    setTimeout(() => {
                        formSuccess.classList.remove('show');
                    }, 5000);
                }
            }, 1500);
        });
    }

    // ========== LAZY LOADING IMAGES ==========
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px'
        });

        lazyImages.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.6s ease';
            imageObserver.observe(img);
        });
    }

    // ========== YEAR DISPLAY ==========
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });

    // ========== KEYBOARD NAVIGATION ==========
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu
            if (navToggle && navToggle.classList.contains('open')) {
                navToggle.classList.remove('open');
                navMobile.classList.remove('open');
                document.body.classList.remove('no-scroll');
            }
            // Close image lightbox
            const lightbox = document.querySelector('.image-lightbox');
            if (lightbox && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        }

        // Lightbox navigation with arrow keys
        const lightbox = document.querySelector('.image-lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });

    // ========== IMAGE LIGHTBOX ==========
    let currentImageIndex = 0;
    let lightboxImages = [];

    function createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'image-lightbox';
        lightbox.innerHTML = `
            <div class="image-lightbox__content">
                <img class="image-lightbox__img" src="" alt="" />
            </div>
            <button class="image-lightbox__close" aria-label="Close"></button>
            <button class="image-lightbox__nav image-lightbox__nav--prev" aria-label="Previous image"></button>
            <button class="image-lightbox__nav image-lightbox__nav--next" aria-label="Next image"></button>
            <div class="image-lightbox__counter"></div>
        `;
        document.body.appendChild(lightbox);
        return lightbox;
    }

    function updateLightboxImage() {
        const lightbox = document.querySelector('.image-lightbox');
        if (!lightbox) return;

        const lightboxImg = lightbox.querySelector('.image-lightbox__img');
        const counter = lightbox.querySelector('.image-lightbox__counter');
        const currentImg = lightboxImages[currentImageIndex];

        lightboxImg.src = currentImg.src;
        lightboxImg.alt = currentImg.alt || '';
        counter.textContent = `${currentImageIndex + 1} / ${lightboxImages.length}`;
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % lightboxImages.length;
        updateLightboxImage();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + lightboxImages.length) % lightboxImages.length;
        updateLightboxImage();
    }

    function openLightbox(imgElement) {
        let lightbox = document.querySelector('.image-lightbox');
        if (!lightbox) {
            lightbox = createLightbox();
        }

        // Find index of clicked image
        currentImageIndex = lightboxImages.indexOf(imgElement);
        updateLightboxImage();

        setTimeout(() => {
            lightbox.classList.add('active');
            document.body.classList.add('no-scroll');
        }, 10);

        // Close on click outside or on close button
        const closeBtn = lightbox.querySelector('.image-lightbox__close');
        closeBtn.onclick = closeLightbox;

        const prevBtn = lightbox.querySelector('.image-lightbox__nav--prev');
        const nextBtn = lightbox.querySelector('.image-lightbox__nav--next');
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            showPrevImage();
        };
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            showNextImage();
        };

        lightbox.onclick = (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        };
    }

    function closeLightbox() {
        const lightbox = document.querySelector('.image-lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    // Collect all case media images
    const caseMediaImages = document.querySelectorAll('.case-media__hero-img img, .case-media__gallery-item img');
    lightboxImages = Array.from(caseMediaImages);

    caseMediaImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(img);
        });
    });

    // ========== PARALLAX SUBTLE EFFECT ==========
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length > 0 && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.1;
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.style.transform = `translateY(${scrollY * speed}px)`;
                }
            });
        }, { passive: true });
    }

})();
