/* ============================================================
   SOBRE PAGE — animações de entrada e scroll
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {

  /* Identidade fixa */
  gsap.set(['.page-identity-arq', '.page-identity-vida'], { opacity: 0 });
  gsap.to(['.page-identity-arq', '.page-identity-vida'], {
    opacity: 1, duration: 0.75, stagger: 0.18, delay: 0.2
  });

  /* Nav */
  gsap.fromTo('.proj-nav',
    { autoAlpha: 0, y: -8 },
    { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.15 }
  );

  /* Hero — texto */
  gsap.fromTo('.sobre-hero-text > *',
    { autoAlpha: 0, y: 28 },
    { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.18, ease: 'power3.out', delay: 0.35 }
  );

  /* Hero — imagem */
  gsap.fromTo('.sobre-hero-img',
    { clipPath: 'inset(0 100% 0 0)' },
    { clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'expo.inOut', delay: 0.1 }
  );
  gsap.fromTo('.sobre-hero-img img',
    { scale: 1.08 },
    { scale: 1, duration: 2.2, ease: 'power2.out', delay: 0.1 }
  );

  /* Declaração — scroll reveal */
  gsap.fromTo('.sobre-statement-text',
    { autoAlpha: 0, y: 40 },
    {
      autoAlpha: 1, y: 0, duration: 1.3, ease: 'power3.out',
      scrollTrigger: { trigger: '.sobre-statement-text', start: 'top 88%' }
    }
  );

  gsap.fromTo('.sobre-body-text',
    { autoAlpha: 0, y: 28 },
    {
      autoAlpha: 1, y: 0, duration: 1.0, ease: 'power3.out', delay: 0.2,
      scrollTrigger: { trigger: '.sobre-body-text', start: 'top 88%' }
    }
  );

  /* Equipe — cards */
  gsap.utils.toArray('.sobre-architect').forEach((el, i) => {
    gsap.fromTo(el,
      { autoAlpha: 0, y: 50 },
      {
        autoAlpha: 1, y: 0, duration: 1.05, ease: 'power3.out',
        delay: i * 0.13,
        scrollTrigger: { trigger: '.sobre-architects', start: 'top 85%' }
      }
    );
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

  /* Transição de saída para links internos */
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      gsap.to('body', {
        autoAlpha: 0, duration: 0.45, ease: 'power2.inOut',
        onComplete: () => { window.location.href = href; }
      });
    });
  });

  ScrollTrigger.refresh();
});
