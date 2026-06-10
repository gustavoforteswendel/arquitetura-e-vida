/* ============================================================
   ARQUITETURA E VIDA — Pages de projeto
   Animações de entrada, reveals de scroll, parallax
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ---- Entrada de página ---- */
function initEntry() {
  /* Estado inicial via GSAP antes de qualquer frame */
  gsap.set('.proj-hero-bg',     { clipPath: 'inset(0 0 100% 0)' });
  gsap.set('.proj-title-l1, .proj-title-l2', { yPercent: 110 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  /* Nav e identidade */
  tl.to(['.page-identity-arq', '.page-identity-vida'], {
    opacity: 1, duration: 0.75, stagger: 0.18
  }, 0.15);

  tl.fromTo('.proj-nav',
    { autoAlpha: 0, y: -8 },
    { autoAlpha: 1, y: 0, duration: 0.6 },
    0.1
  );

  /* Hero image — revela de baixo para cima */
  tl.to('.proj-hero-bg', {
    clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'expo.inOut'
  }, 0.12);

  tl.fromTo('.proj-hero-bg video, .proj-hero-bg img',
    { scale: 1.07 },
    { scale: 1, duration: 2.4, ease: 'power2.out' },
    0.12
  );

  /* Categoria + título */
  tl.fromTo('.proj-hero-category',
    { autoAlpha: 0, y: 14 },
    { autoAlpha: 1, y: 0, duration: 0.7 },
    0.45
  );

  tl.to('.proj-title-l1', {
    yPercent: 0, duration: 1.05
  }, 0.52);

  tl.to('.proj-title-l2', {
    yPercent: 0, duration: 1.0
  }, 0.66);

  /* Indicador de scroll */
  tl.fromTo('.proj-scroll-hint',
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.8 },
    1.3
  );
}

/* ---- Reveals ao scroll ---- */
function initScrollReveals() {
  /* Textos grandes */
  gsap.utils.toArray('.proj-quote').forEach((el) => {
    gsap.fromTo(el,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1, y: 0, duration: 1.25, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 87%' }
      }
    );
  });

  /* Corpo + labels */
  gsap.utils.toArray('.proj-body, .proj-label, .proj-sep').forEach((el) => {
    gsap.fromTo(el,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      }
    );
  });

  /* Imagens da galeria — clip-path do topo */
  gsap.utils.toArray('.gal-block').forEach((el) => {
    gsap.fromTo(el,
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)', duration: 1.35, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 92%' }
      }
    );

    const img = el.querySelector('img');
    if (img) {
      gsap.fromTo(img,
        { scale: 1.12 },
        {
          scale: 1, duration: 1.9, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%' }
        }
      );
    }
  });

  /* Footer */
  gsap.fromTo('.proj-footer-cta',
    { autoAlpha: 0, y: 32 },
    {
      autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.proj-footer', start: 'top 86%' }
    }
  );

  gsap.fromTo('.proj-footer-links',
    { autoAlpha: 0, y: 16 },
    {
      autoAlpha: 1, y: 0, duration: 0.85, ease: 'power2.out', delay: 0.2,
      scrollTrigger: { trigger: '.proj-footer', start: 'top 86%' }
    }
  );
}

/* ---- Parallax suave no hero ---- */
function initParallax() {
  /* Hero agora é sticky — o vídeo permanece fixo enquanto o
     conteúdo sobe por cima; parallax não é necessário. */
}

/* ---- Transição de saída ao navegar ---- */
function initExitTransitions() {
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto')) return;

    link.addEventListener('click', (e) => {
      const isSamePage = href === window.location.pathname.split('/').pop();
      if (isSamePage) return;

      e.preventDefault();
      gsap.to('body', {
        autoAlpha: 0, duration: 0.45, ease: 'power2.inOut',
        onComplete: () => { window.location.href = href; }
      });
    });
  });
}

window.addEventListener('load', () => {
  initEntry();
  initScrollReveals();
  initParallax();
  initExitTransitions();
  ScrollTrigger.refresh();
});
