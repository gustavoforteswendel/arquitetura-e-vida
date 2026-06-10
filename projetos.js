/* ============================================================
   PROJETOS PAGE — animações de scroll empilhado
   Técnica: covers fixos (clip-path) empilhados por z-index
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {

  /* ---- Entrada: identidade + nav ---- */
  gsap.set(['.page-identity-arq', '.page-identity-vida'], { opacity: 0 });
  gsap.to(['.page-identity-arq', '.page-identity-vida'], {
    opacity: 1, duration: 0.75, stagger: 0.18, delay: 0.2
  });
  gsap.fromTo('.proj-nav',
    { autoAlpha: 0, y: -8 },
    { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.15 }
  );

  /* ---- Cover 1: meta anima na entrada ---- */
  gsap.fromTo('.pj-cover-meta',
    { autoAlpha: 0, y: 24 },
    { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.4 }
  );

  /* ---- Estado inicial: covers 2 e 3 ocultos por clip do topo ----
     inset(top right bottom left)
     inset(100% 0 0 0) = clipa 100% pelo topo → nada visível.
     Ao animar o topo de 100% → 0%, a imagem SOBE de baixo para cima. ---- */
  gsap.set('#cover-2', { clipPath: 'inset(100% 0% 0% 0%)' });
  gsap.set('#cover-3', { clipPath: 'inset(100% 0% 0% 0%)' });

  /* ============================================================
     HELPER — cria a timeline de um projeto
     anchorId   : '#anchor-1' | '#anchor-2' | '#anchor-3'
     infoId     : '#info-1'  | '#info-2'  | '#info-3'
     nextCoverId: '#cover-2' | '#cover-3' | null (último projeto)
  ============================================================ */
  function buildProjectTl(anchorId, infoId, nextCoverId) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: anchorId,
        start: 'top top',
        end: 'bottom top',
        scrub: 2.2,           /* lag suave — mais alto = mais fluido */
      }
    });

    /* ── 0 → 0.30: pausa dramática; cover em tela cheia ── */
    tl.to({}, { duration: 0.30 });

    /* ── 0.30 → 0.52: painel de info sobe ── */
    tl.fromTo(infoId,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: 0.22, ease: 'power3.out' },
      0.30
    );

    if (nextCoverId) {
      /* ── 0.56 → 0.70: painel de info some ── */
      tl.to(infoId, {
        autoAlpha: 0, y: -22, duration: 0.14, ease: 'power2.in'
      }, 0.56);

      /* ── 0.62 → 1.00: próximo cover sobe de baixo para cima ──
         expo.out: arranca rápido, desacelera suavemente no final.
         O inset do topo vai de 100% → 0%: a imagem cresce de baixo. */
      tl.to(nextCoverId, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.38,
        ease: 'expo.out',
      }, 0.62);
    } else {
      /* Último projeto: info some ao final da rolagem */
      tl.to(infoId, {
        autoAlpha: 0, y: -22, duration: 0.14, ease: 'power2.in'
      }, 0.82);
    }

    return tl;
  }

  buildProjectTl('#anchor-1', '#info-1', '#cover-2');
  buildProjectTl('#anchor-2', '#info-2', '#cover-3');
  buildProjectTl('#anchor-3', '#info-3', null);

  /* ---- Transição de saída suave para links internos ---- */
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
