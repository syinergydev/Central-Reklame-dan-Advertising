document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  const galleryButtons = [...document.querySelectorAll('.gallery-item')];
  const filters = [...document.querySelectorAll('.filter-button')];
  const count = document.querySelector('.gallery-count');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    const category = button.dataset.filter;
    let visible = 0;
    galleryButtons.forEach(card => {
      const show = category === 'all' || card.dataset.category.split(' ').includes(category);
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });
    count.textContent = `${visible} VISUAL`;
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }));

  const viewport = document.querySelector('.gallery-viewport');
  const scrollGallery = direction => {
    const cards = visibleCardsForScroll();
    if (!cards.length) return;
    const current = cards.reduce((best, card) =>
      Math.abs(card.offsetLeft - viewport.scrollLeft) < Math.abs(best.offsetLeft - viewport.scrollLeft) ? card : best
    , cards[0]);
    const index = cards.indexOf(current);
    const target = cards[Math.max(0, Math.min(cards.length - 1, index + direction))];
    if (target) viewport.scrollTo({ left: target.offsetLeft - viewport.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  const visibleCardsForScroll = () => galleryButtons.filter(card => !card.classList.contains('is-hidden'));
  document.querySelector('.gallery-next').addEventListener('click', () => scrollGallery(1));
  document.querySelector('.gallery-prev').addEventListener('click', () => scrollGallery(-1));

  // Native touch scrolling remains available on phones, including when GSAP is unavailable.
  let dragStartX = 0;
  let dragStartScroll = 0;
  let draggingGallery = false;
  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(max-width: 760px)').matches) return;
    draggingGallery = true;
    dragStartX = event.clientX;
    dragStartScroll = viewport.scrollLeft;
    viewport.classList.add('is-dragging');
  });
  viewport.addEventListener('pointermove', event => {
    if (!draggingGallery) return;
    viewport.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
  });
  ['pointerup','pointercancel','pointerleave'].forEach(type => viewport.addEventListener(type, () => {
    draggingGallery = false;
    viewport.classList.remove('is-dragging');
  }));

  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxTitle = lightbox.querySelector('figcaption b');
  const lightboxDetail = lightbox.querySelector('figcaption span');
  let currentIndex = 0;
  const visibleCards = () => galleryButtons.filter(card => !card.classList.contains('is-hidden'));
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
  const openLightbox = card => {
    currentIndex = visibleCards().indexOf(card);
    showImage(currentIndex);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  };
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  galleryButtons.forEach(card => card.addEventListener('click', () => openLightbox(card)));
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(currentIndex - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(currentIndex + 1));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
    if (event.key === 'Escape') closeLightbox();
  });

  if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    const dot = document.querySelector('.cursor');
    const ring = document.querySelector('.cursor-ring');
    let pointerX = 0, pointerY = 0;
    document.addEventListener('pointermove', event => {
      pointerX = event.clientX; pointerY = event.clientY;
      dot.style.transform = `translate3d(${pointerX - 3}px,${pointerY - 3}px,0)`;
      ring.style.transform = `translate3d(${pointerX - 17}px,${pointerY - 17}px,0)`;
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
    .to('.hero-image', { scale: 1, duration: 1.5, ease: 'power2.out' }, '<');

  gsap.utils.toArray('.reveal').forEach((element, index) => {
    gsap.to(element, {
      y: 0, opacity: 1, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 88%', once: true }
    });
  });

  gsap.to('.hero-image', {
    yPercent: 12, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.utils.toArray('.reference-image img, .service-feature img, .process-image img').forEach(image => {
    gsap.fromTo(image, { scale: 1.09 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom top', scrub: .7 }
    });
  });

  const galleryTrack = document.querySelector('.gallery-track');
  const galleryDistance = () => Math.max(0, galleryTrack.scrollWidth - window.innerWidth + 42);
  if (window.matchMedia('(min-width: 761px)').matches) {
    gsap.to(galleryTrack, {
      x: () => -galleryDistance(), ease: 'none',
      scrollTrigger: {
        trigger: '.portfolio', start: 'top top+=35', end: () => `+=${galleryDistance()}`,
        pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true
      }
    });
  }

  gsap.to('.marquee-track', {
    xPercent: -25, duration: 24, ease: 'none', repeat: -1,
    modifiers: { xPercent: gsap.utils.wrap(-25, 0) }
  });

  document.querySelectorAll('.magnetic').forEach(button => {
    const strength = 9;
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
      gsap.to(button, { x: x * strength, y: y * strength, duration: .35, ease: 'power3.out' });
    });
    button.addEventListener('pointerleave', () => gsap.to(button, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.45)' }));
  });
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  }, { passive: true });
  window.addEventListener('orientationchange', () => {
    window.setTimeout(() => ScrollTrigger.refresh(), 250);
  }, { passive: true });
});
