document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.createElement('nav');
  mobileNav.className = 'mobile-nav';
  mobileNav.setAttribute('aria-label', 'Navigasi mobile');
  mobileNav.innerHTML = '<a href="#layanan">Layanan</a><a href="#showcase">Showcase</a><a href="#proses">Proses</a><a href="#ulasan">Ulasan</a><a href="#kontak">Kontak ↗</a>';
  document.body.insertBefore(mobileNav, document.querySelector('main'));

  const closeMenu = () => {
    mobileNav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Buka menu navigasi');
    document.body.classList.remove('menu-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    mobileNav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.getElementById('year').textContent = new Date().getFullYear();

  // Hero carousel: real slide state, manual controls, swipe and timed autoplay.
  const hero = document.querySelector('.hero-image-wrap');
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.hero-dot')];
  const counter = document.querySelector('.hero-slide-counter');
  let activeSlide = 0;
  let autoplayTimer = 0;
  let resumeTimer = 0;
  const autoplayDelay = 5600;

  const activateSlide = (nextIndex, source = 'auto') => {
    const next = (nextIndex + slides.length) % slides.length;
    if (next === activeSlide && source !== 'init') return;
    const previous = slides[activeSlide];
    const current = slides[next];
    activeSlide = next;

    slides.forEach((slide, index) => {
      const active = index === activeSlide;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((dot, index) => {
      const active = index === activeSlide;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', String(active));
    });
    counter.innerHTML = `${String(activeSlide + 1).padStart(2, '0')} <i>/</i> 03`;

    if (!reduceMotion && window.gsap) {
      gsap.killTweensOf([previous, current, previous.querySelector('img'), current.querySelector('img')]);
      gsap.set(current, { zIndex: 2, opacity: 0 });
      gsap.set(previous, { zIndex: 1, opacity: 1 });
      gsap.timeline()
        .to(previous, { opacity: 0, duration: .7, ease: 'power2.inOut' }, 0)
        .to(current, { opacity: 1, duration: .9, ease: 'power2.inOut' }, 0)
        .fromTo(current.querySelector('img'), { scale: 1.075 }, { scale: 1, duration: 5.2, ease: 'power1.out' }, 0);
    } else {
      slides.forEach((slide, index) => { slide.style.opacity = index === activeSlide ? '1' : '0'; });
    }
    if (source !== 'auto') pauseAutoplay();
  };

  const scheduleAutoplay = () => {
    window.clearTimeout(autoplayTimer);
    if (reduceMotion || document.hidden || hero.matches(':hover') || hero.matches(':focus-within')) return;
    autoplayTimer = window.setTimeout(() => {
      activateSlide(activeSlide + 1, 'auto');
      scheduleAutoplay();
    }, autoplayDelay);
  };
  const pauseAutoplay = () => {
    window.clearTimeout(autoplayTimer);
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(scheduleAutoplay, 8500);
  };
  document.querySelector('.hero-prev').addEventListener('click', () => activateSlide(activeSlide - 1, 'control'));
  document.querySelector('.hero-next').addEventListener('click', () => activateSlide(activeSlide + 1, 'control'));
  dots.forEach(dot => dot.addEventListener('click', () => activateSlide(Number(dot.dataset.slideTo), 'control')));

  let heroPointerStart = null;
  hero.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse') return;
    heroPointerStart = event.clientX;
  }, { passive: true });
  hero.addEventListener('pointerup', event => {
    if (heroPointerStart === null) return;
    const delta = event.clientX - heroPointerStart;
    heroPointerStart = null;
    if (Math.abs(delta) > 42) activateSlide(activeSlide + (delta < 0 ? 1 : -1), 'swipe');
  }, { passive: true });
  hero.addEventListener('pointercancel', () => { heroPointerStart = null; }, { passive: true });
  hero.addEventListener('mouseenter', () => window.clearTimeout(autoplayTimer));
  hero.addEventListener('mouseleave', scheduleAutoplay);
  hero.addEventListener('focusin', () => window.clearTimeout(autoplayTimer));
  hero.addEventListener('focusout', scheduleAutoplay);
  document.addEventListener('visibilitychange', () => document.hidden ? window.clearTimeout(autoplayTimer) : scheduleAutoplay());
  scheduleAutoplay();

  // Portfolio filters retain the original 17 project records and categories.
  const galleryButtons = [...document.querySelectorAll('.gallery-item')];
  const filters = [...document.querySelectorAll('.filter-button')];
  const count = document.querySelector('.gallery-count');
  const viewport = document.querySelector('.gallery-viewport');
  const galleryTrack = document.querySelector('.gallery-track');
  const visibleCards = () => galleryButtons.filter(card => !card.classList.contains('is-hidden'));
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    const category = button.dataset.filter;
    let visible = 0;
    galleryButtons.forEach(card => {
      const categories = card.dataset.category.split(/\s+/);
      const show = category === 'all' || categories.includes(category);
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });
    count.textContent = `${visible} VISUAL`;
    viewport.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }));

  const scrollGallery = direction => {
    const cards = visibleCards();
    if (!cards.length) return;
    const currentLeft = viewport.scrollLeft;
    const currentIndex = cards.reduce((best, card, index) => {
      const left = card.offsetLeft - galleryTrack.offsetLeft;
      const bestLeft = cards[best].offsetLeft - galleryTrack.offsetLeft;
      return Math.abs(left - currentLeft) < Math.abs(bestLeft - currentLeft) ? index : best;
    }, 0);
    const target = cards[Math.max(0, Math.min(cards.length - 1, currentIndex + direction))];
    if (target) viewport.scrollTo({
      left: target.offsetLeft - galleryTrack.offsetLeft,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  };
  document.querySelector('.gallery-next').addEventListener('click', () => scrollGallery(1));
  document.querySelector('.gallery-prev').addEventListener('click', () => scrollGallery(-1));

  // Mouse-only drag on desktop; touch remains entirely native and is never captured.
  let dragStartX = 0;
  let dragStartScroll = 0;
  let draggingGallery = false;
  let dragMoved = false;
  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || !finePointer) return;
    draggingGallery = true;
    dragMoved = false;
    dragStartX = event.clientX;
    dragStartScroll = viewport.scrollLeft;
    viewport.classList.add('is-dragging');
  });
  viewport.addEventListener('pointermove', event => {
    if (!draggingGallery) return;
    const delta = event.clientX - dragStartX;
    if (Math.abs(delta) > 4) dragMoved = true;
    if (dragMoved) viewport.scrollLeft = dragStartScroll - delta;
  });
  const endGalleryDrag = () => {
    draggingGallery = false;
    viewport.classList.remove('is-dragging');
    if (dragMoved) window.setTimeout(() => { dragMoved = false; }, 80);
  };
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => viewport.addEventListener(type, endGalleryDrag));
  galleryButtons.forEach(card => card.addEventListener('click', event => {
    if (dragMoved) { event.preventDefault(); event.stopPropagation(); dragMoved = false; return; }
    openLightbox(card);
  }));

  // Accessible lightbox and keyboard navigation.
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxTitle = lightbox.querySelector('figcaption b');
  const lightboxDetail = lightbox.querySelector('figcaption span');
  let currentIndex = 0;
  const showImage = index => {
    const cards = visibleCards();
    if (!cards.length) return;
    currentIndex = (index + cards.length) % cards.length;
    const card = cards[currentIndex];
    lightboxImg.src = card.dataset.image;
    lightboxImg.alt = card.querySelector('img').alt;
    lightboxTitle.textContent = card.dataset.title;
    lightboxDetail.textContent = card.dataset.detail;
  };
  function openLightbox(card) {
    currentIndex = visibleCards().indexOf(card);
    showImage(currentIndex);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  }
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(currentIndex - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(currentIndex + 1));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => {
    if (lightbox.classList.contains('is-open')) {
      if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (event.key === 'ArrowRight') showImage(currentIndex + 1);
      if (event.key === 'Escape') closeLightbox();
    }
    if (event.key === 'Escape') closeMenu();
  });

  if (!reduceMotion && finePointer) {
    const dot = document.querySelector('.cursor');
    const ring = document.querySelector('.cursor-ring');
    document.addEventListener('pointermove', event => {
      dot.style.transform = `translate3d(${event.clientX - 3}px,${event.clientY - 3}px,0)`;
      ring.style.transform = `translate3d(${event.clientX - 17}px,${event.clientY - 17}px,0)`;
      dot.classList.add('is-visible'); ring.classList.add('is-visible');
    });
    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('pointerenter', () => ring.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => ring.classList.remove('is-hover'));
    });
  }

  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.remove('js');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.to('.hero-eyebrow', { y: 0, opacity: 1, duration: .7, delay: .15 })
    .to('.hero-title span', { y: 0, opacity: 1, duration: .85, stagger: .12 }, '-=.35')
    .to(['.hero-en', '.hero-id', '.hero-actions'], { y: 0, opacity: 1, duration: .7, stagger: .12 }, '-=.42')
    .to('.hero-image-wrap', { clipPath: 'inset(0 0 0% 0)', duration: 1.15, ease: 'power4.inOut' }, '-=.5')
    .fromTo('.hero-slide.is-active img', { scale: 1.07 }, { scale: 1, duration: 1.6, ease: 'power2.out' }, '<');

  gsap.utils.toArray('.reveal').forEach(element => {
    gsap.to(element, {
      y: 0, opacity: 1, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 88%', once: true }
    });
  });
  gsap.to('.hero-image-wrap', {
    yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.utils.toArray('.reference-image img, .service-feature img, .process-image img').forEach(image => {
    gsap.fromTo(image, { scale: 1.08 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom top', scrub: .7 }
    });
  });

  // No transform-driven horizontal pinning: the same native scroll surface works on desktop and touch devices.
  gsap.utils.toArray('.gallery-item').forEach(item => {
    gsap.fromTo(item, { opacity: .72, scale: .97 }, {
      opacity: 1, scale: 1, duration: .8, ease: 'power2.out',
      scrollTrigger: { trigger: item, horizontal: true, scroller: viewport, start: 'left 92%', once: true }
    });
  });
  if (window.matchMedia('(min-width: 761px)').matches) {
    document.querySelectorAll('.magnetic').forEach(button => {
      const strength = 8;
      button.addEventListener('pointermove', event => {
        const rect = button.getBoundingClientRect();
        gsap.to(button, {
          x: ((event.clientX - rect.left - rect.width / 2) / rect.width) * strength,
          y: ((event.clientY - rect.top - rect.height / 2) / rect.height) * strength,
          duration: .35, ease: 'power3.out'
        });
      });
      button.addEventListener('pointerleave', () => gsap.to(button, { x: 0, y: 0, duration: .65, ease: 'elastic.out(1,.45)' }));
    });
  }
  const marquee = document.querySelector('.marquee-track');
  if (marquee) gsap.to(marquee, {
    xPercent: -25, duration: 24, ease: 'none', repeat: -1,
    modifiers: { xPercent: gsap.utils.wrap(-25, 0) }
  });
  window.addEventListener('resize', () => ScrollTrigger.refresh(), { passive: true });
  window.addEventListener('orientationchange', () => window.setTimeout(() => ScrollTrigger.refresh(), 250), { passive: true });
});
