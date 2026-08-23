/**
* Template Name: Singularity
* Template URL: https://bootstrapmade.com/Singularity-free-bootstrap-html-template-corporate/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  const body = document.body;
  const header = document.querySelector('#header');
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  const navmenuLinks = document.querySelectorAll('#navmenu a');
  let aosDebounceTimer = null;

  function toggleScrolled() {
    if (!header) return;
    if (!header.classList.contains('scroll-up-sticky') && !header.classList.contains('sticky-top') && !header.classList.contains('fixed-top')) return;
    if (window.scrollY > 100) {
      body.classList.add('scrolled');
    } else {
      body.classList.remove('scrolled');
    }
  }

  function updateMobileNavState() {
    if (!mobileNavToggleBtn) return;
    const expanded = body.classList.contains('mobile-nav-active');
    mobileNavToggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  function closeMobileNav() {
    body.classList.remove('mobile-nav-active');
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.remove('bi-x');
      mobileNavToggleBtn.classList.add('bi-list');
      updateMobileNavState();
    }
  }

  function toggleMobileNav() {
    if (!mobileNavToggleBtn) return;
    body.classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
    updateMobileNavState();
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', toggleMobileNav);
  }

  navmenuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (body.classList.contains('mobile-nav-active')) {
        closeMobileNav();
      }
    });
  });

  document.querySelectorAll('.navmenu .toggle-dropdown').forEach((toggle) => {
    toggle.addEventListener('click', function(event) {
      event.preventDefault();
      const parent = this.parentNode;
      parent.classList.toggle('active');
      const submenu = parent.querySelector('ul');
      if (submenu) {
        submenu.classList.toggle('dropdown-active');
      }
      event.stopImmediatePropagation();
    });
  });

  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => preloader.remove());
  }

  const scrollTopButton = document.querySelector('.scroll-top');
  function toggleScrollTop() {
    if (!scrollTopButton) return;
    if (window.scrollY > 100) {
      scrollTopButton.classList.add('active');
    } else {
      scrollTopButton.classList.remove('active');
    }
  }

  if (scrollTopButton) {
    scrollTopButton.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);
  }

  function aosInit() {
    if (typeof AOS !== 'undefined' && typeof AOS.init === 'function') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
      });
    }
  }

  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll('.init-swiper').forEach((swiperElement) => {
      const configElement = swiperElement.querySelector('.swiper-config');
      if (!configElement) return;
      let config = {};
      try {
        config = JSON.parse(configElement.innerHTML.trim());
      } catch (error) {
        console.warn('Invalid Swiper config', error);
      }

      if (swiperElement.classList.contains('swiper-tab') && typeof initSwiperWithCustomPagination === 'function') {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  function setupFaqAccessibility() {
    document.querySelectorAll('.faq-item').forEach((item) => {
      const heading = item.querySelector('h3');
      const toggleIcon = item.querySelector('.faq-toggle');
      const content = item.querySelector('.faq-content');
      const expanded = item.classList.contains('faq-active');
      const interactiveElements = [heading, toggleIcon].filter(Boolean);

      if (content) {
        content.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      }

      interactiveElements.forEach((element) => {
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
        element.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        element.addEventListener('click', () => toggleFaqItem(item));
        element.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleFaqItem(item);
          }
        });
      });
    });
  }

  function toggleFaqItem(item) {
    item.classList.toggle('faq-active');
    const expanded = item.classList.contains('faq-active');
    const interactiveElements = [item.querySelector('h3'), item.querySelector('.faq-toggle')].filter(Boolean);
    const content = item.querySelector('.faq-content');

    interactiveElements.forEach((element) => {
      element.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });

    if (content) {
      content.setAttribute('aria-hidden', expanded ? 'false' : 'true');
    }
  }

  function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#navmenu a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const linkPath = href.split('?')[0].split('#')[0].split('/').pop();
      if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /* Service details scrollspy: observes sections inside services.html and toggles the
     active state on the left `.services-list` navigation. */
  function initServiceDetailsScrollspy() {
    const serviceNavLinks = document.querySelectorAll('.services-overview .services-list a');
    if (!serviceNavLinks || serviceNavLinks.length === 0) return;

    const sections = [];
    serviceNavLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      const section = document.querySelector(href);
      if (section) sections.push({ id: href, section, link });
      // smooth scroll for clicks
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          const scrollMarginTop = parseInt(getComputedStyle(target).scrollMarginTop, 10) || 20;
          const targetTop = target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: targetTop - scrollMarginTop, behavior: 'smooth' });
          history.replaceState(null, '', link.getAttribute('href'));
        }
      });
    });

    const observerOptions = { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.target || entry.intersectionRatio <= 0) return;
        const id = `#${entry.target.id}`;
        document.querySelectorAll('.services-overview .services-list a.active').forEach((a) => a.classList.remove('active'));
        const match = document.querySelector(`.services-overview .services-list a[href="${id}"]`);
        if (match) {
          match.classList.add('active');
          match.setAttribute('aria-current', 'page');
        }
      });
    }, observerOptions);

    sections.forEach((s) => observer.observe(s.section));
  }

  function navmenuScrollspy() {
    navmenuLinks.forEach((navmenuLink) => {
      if (!navmenuLink.hash) return;
      const section = document.querySelector(navmenuLink.hash);
      if (!section) return;
      const position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        document.querySelectorAll('.navmenu a.active').forEach((link) => link.classList.remove('active'));
        navmenuLink.classList.add('active');
      } else {
        navmenuLink.classList.remove('active');
      }
    });
  }

  window.addEventListener('load', () => {
    toggleScrolled();
    aosInit();
    initSwiper();
    toggleScrollTop();
    navmenuScrollspy();
    setupFaqAccessibility();
    initServiceDetailsScrollspy();

    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          const scrollMarginTop = parseInt(getComputedStyle(section).scrollMarginTop, 10) || 0;
          window.scrollTo({ top: section.offsetTop - scrollMarginTop, behavior: 'smooth' });
        }, 100);
      }
    }
    setActiveNavLink();
  });

  document.addEventListener('scroll', () => {
    toggleScrolled();
    navmenuScrollspy();

    if (aosDebounceTimer !== null) {
      clearTimeout(aosDebounceTimer);
    }
    aosDebounceTimer = setTimeout(() => {
      if (typeof AOS !== 'undefined' && typeof AOS.refreshHard === 'function') {
        AOS.refreshHard();
      }
    }, 200);
  });
})();
