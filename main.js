/* ============================================================
   ARQUITETURA E VIDA — Stage 3: GSAP + ScrollTrigger
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* Referência global ao tween horizontal — usada por reveals e textos */
let hTween = null;

/* ============================================================
   UTILS
   ============================================================ */

/* Cria um scrollTrigger vinculado ao scroll horizontal */
function hst(trigger, extra = {}) {
  return {
    containerAnimation: hTween,
    trigger,
    start: 'left 88%',
    toggleActions: 'play none none none',
    ...extra
  };
}

/* ============================================================
   INIT LOADER
   Sequência: ARQUITETURA letra a letra → E → VIDA letra a letra → fade
   ============================================================ */
function splitLetters(el) {
  const text = el.textContent.trim();
  el.innerHTML = text
    .split('')
    .map((ch) => `<span class="loader-letter">${ch}</span>`)
    .join('');
  return el.querySelectorAll('.loader-letter');
}

/* ============================================================
   INIT INTRO REVEAL
   Primeiro viewport da Home — sincronizado com a saída do loader
   ============================================================ */
function initIntroReveal() {
  gsap.to('.image-block--hero', {
    clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'expo.inOut'
  });
  gsap.to('.image-block--hero img', {
    scale: 1, duration: 2, ease: 'power2.out'
  });
  gsap.to('.manifesto-headline .headline-serif', {
    autoAlpha: 1, yPercent: 0, skewY: 0,
    duration: 1.4, ease: 'power4.out', delay: 0.25
  });
  gsap.to('.manifesto-headline .headline-sans', {
    autoAlpha: 1, yPercent: 0,
    duration: 1.2, ease: 'power3.out', delay: 0.48
  });
  gsap.to('.manifesto-body p', {
    autoAlpha: 1, y: 0,
    duration: 1, ease: 'power3.out', delay: 0.65
  });
}

function initLoader() {
  const loader   = document.querySelector('#intro-loader');
  const lineArq  = document.querySelector('#loader-line-arquitetura');
  const lineE    = document.querySelector('#loader-line-e');
  const lineVida = document.querySelector('#loader-line-vida');

  /* .loader-line-wrap: overflow hidden que cria o efeito de slide das letras */
  const wrapArq  = lineArq.closest('.loader-line-wrap');
  const wrapE    = lineE.closest('.loader-line-wrap');
  const wrapVida = lineVida.closest('.loader-line-wrap');

  const identityArq  = document.querySelector('#identity-arquitetura');
  const identityVida = document.querySelector('#identity-vida');

  /* Dividir em letras individuais */
  const lettersArq  = splitLetters(lineArq);
  const lettersVida = splitLetters(lineVida);

  /* Estado inicial — loader */
  gsap.set(loader,   { autoAlpha: 1, pointerEvents: 'all' });
  gsap.set([...lettersArq, ...lettersVida, lineE], { yPercent: 110 });

  /* Estado inicial — primeiro viewport (esconde antes do loader sair) */
  gsap.set('.image-block--hero',                    { clipPath: 'inset(0 0 100% 0)' });
  gsap.set('.image-block--hero img',                { scale: 1.1 });
  gsap.set('.manifesto-headline .headline-serif',   { autoAlpha: 0, yPercent: 22, skewY: 2 });
  gsap.set('.manifesto-headline .headline-sans',    { autoAlpha: 0, yPercent: 18 });
  gsap.set('.manifesto-body p',                     { autoAlpha: 0, y: 22 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl
    /* ---- Fase 1: palavras surgem letra a letra ---- */
    .to(lettersArq, {
      yPercent: 0,
      duration: 0.85,
      stagger: 0.038
    })
    .to(lineE, {
      yPercent: 0,
      duration: 0.65,
      ease: 'power2.out'
    }, '-=0.2')
    .to(lettersVida, {
      yPercent: 0,
      duration: 0.9,
      stagger: 0.058
    }, '-=0.3')

    /* ---- Pausa editorial ---- */
    .to({}, { duration: 0.85 })

    /* ---- Fase 2: separação — palavras animam até as posições finais ----
       Calculado em runtime para coincidir exatamente com a identidade fixa */
    .call(() => {
      const rArq  = wrapArq.getBoundingClientRect();
      const rVida = wrapVida.getBoundingClientRect();
      const rIA   = identityArq.getBoundingClientRect();
      const rIV   = identityVida.getBoundingClientRect();

      /* Deltas centro-a-centro */
      const arqDx  = (rIA.left  + rIA.width  / 2) - (rArq.left  + rArq.width  / 2);
      const arqDy  = (rIA.top   + rIA.height / 2) - (rArq.top   + rArq.height / 2);
      const vidaDx = (rIV.left  + rIV.width  / 2) - (rVida.left + rVida.width  / 2);
      const vidaDy = (rIV.top   + rIV.height / 2) - (rVida.top  + rVida.height / 2);

      /* ARQUITETURA vai para o canto superior esquerdo e desvanece */
      gsap.to(wrapArq, {
        x: arqDx,
        y: arqDy,
        scale: 0.12,
        autoAlpha: 0,
        duration: 1.45,
        ease: 'expo.inOut'
      });

      /* VIDA vai para o canto inferior direito e desvanece */
      gsap.to(wrapVida, {
        x: vidaDx,
        y: vidaDy,
        scale: 0.32,
        autoAlpha: 0,
        duration: 1.45,
        ease: 'expo.inOut'
      });

      /* E desvanece suavemente no lugar */
      gsap.to(wrapE, {
        autoAlpha: 0,
        scale: 0.7,
        duration: 0.6,
        ease: 'power2.out'
      });

      /* Identidade fixa aparece enquanto as palavras chegam (~60% do caminho)
         A identidade NASCE da animação do loader — sem corte */
      gsap.to([identityArq, identityVida], {
        opacity: 1,
        duration: 0.65,
        stagger: 0.15,
        ease: 'power2.out',
        delay: 0.82
      });

      /* Inicia o reveal do primeiro viewport 0.65s antes do fade do loader,
         criando continuidade visual — o conteúdo já está em movimento
         quando o loader desaparece */
      gsap.delayedCall(0.65, initIntroReveal);
    })

    /* ---- Fundo desaparece revelando a Home (acontece durante/após o movimento) ---- */
    .to(loader, {
      autoAlpha: 0,
      duration: 0.75,
      ease: 'power2.inOut',
      onComplete() {
        loader.style.display      = 'none';
        loader.style.pointerEvents = 'none';
      }
    }, '+=0.98');

  return tl;
}

/* ============================================================
   INIT PROJECT TRANSITIONS
   Saída elegante com GSAP antes de navegar para a página do projeto
   ============================================================ */
function initProjectTransitions() {
  document.querySelectorAll('.project-entry a').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      e.preventDefault();

      gsap.to('#horizontal-wrapper', {
        autoAlpha: 0,
        y: -20,
        duration: 0.55,
        ease: 'power2.inOut',
        onComplete: () => { window.location.href = href; }
      });
    });
  });
}

/* ============================================================
   INIT HORIZONTAL SCROLL
   Scroll vertical do usuário → translateX do wrapper
   ============================================================ */
function initHorizontalScroll() {
  const scroll  = document.querySelector('#horizontal-scroll');
  const wrapper = document.querySelector('#horizontal-wrapper');

  /* Desativa overflow do Stage 2 */
  scroll.style.overflow = 'hidden';

  const getDistance = () => wrapper.scrollWidth - window.innerWidth;

  hTween = gsap.to(wrapper, {
    x: () => -getDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: scroll,
      start: 'top top',
      end: () => `+=${getDistance()}`,
      scrub: 1.2,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });
}

/* ============================================================
   INIT IMAGE REVEALS
   Cada imagem surge de forma diferente — sem repetição
   ============================================================ */
function initImageReveals() {
  if (!hTween) return;

  /* ---- Manifesto: primária — clip-path da esquerda ---- */
  gsap.fromTo('.image-block--primary',
    { clipPath: 'inset(0 100% 0 0)' },
    {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.5,
      ease: 'expo.inOut',
      scrollTrigger: hst('.image-block--primary', { start: 'left 100%' })
    }
  );
  gsap.fromTo('.image-block--primary img',
    { scale: 1.15, xPercent: 6 },
    {
      scale: 1, xPercent: 0,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: hst('.image-block--primary', { start: 'left 100%' })
    }
  );

  /* ---- Manifesto: secundária — clip-path de baixo ---- */
  gsap.fromTo('.image-block--secondary',
    { clipPath: 'inset(100% 0 0 0)' },
    {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.2,
      ease: 'expo.inOut',
      delay: 0.3,
      scrollTrigger: hst('.image-block--secondary', { start: 'left 92%' })
    }
  );

  /* ---- Manifesto: acento — opacity + scale ---- */
  gsap.fromTo('.image-block--accent',
    { autoAlpha: 0, scale: 1.1 },
    {
      autoAlpha: 1, scale: 1,
      duration: 1,
      ease: 'power3.out',
      delay: 0.55,
      scrollTrigger: hst('.image-block--accent', { start: 'left 86%' })
    }
  );

  /* ---- Sobre: portrait lead — clip-path do topo ---- */
  gsap.fromTo('.portrait--lead',
    { clipPath: 'inset(0 0 100% 0)' },
    {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.6,
      ease: 'expo.inOut',
      scrollTrigger: hst('.portrait--lead', { start: 'left 100%' })
    }
  );
  gsap.fromTo('.portrait--lead img',
    { scale: 1.12 },
    {
      scale: 1,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: hst('.portrait--lead', { start: 'left 100%' })
    }
  );

  /* ---- Sobre: portrait secondary — desliza da esquerda ---- */
  gsap.fromTo('.portrait--secondary',
    { autoAlpha: 0, x: -50 },
    {
      autoAlpha: 1, x: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.4,
      scrollTrigger: hst('.portrait--secondary')
    }
  );

  /* ---- Sobre: portrait tertiary — fade + leve queda ---- */
  gsap.fromTo('.portrait--tertiary',
    { autoAlpha: 0, y: 36 },
    {
      autoAlpha: 1, y: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.65,
      scrollTrigger: hst('.portrait--tertiary')
    }
  );

  /* ========================================================
     SOBRE — zona extra de imagens
     Técnica: imagem B/D nascem de dentro de A/C
     clip-path inicial = interseção geométrica das duas figuras
     ======================================================== */

  /* ---- A: desliza da direita ---- */
  gsap.fromTo('.about-extra-img--a',
    { clipPath: 'inset(0 100% 0 0)' },
    {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.6,
      ease: 'expo.inOut',
      scrollTrigger: hst('.about-extra-img--a', { start: 'left 100%' })
    }
  );
  gsap.fromTo('.about-extra-img--a img',
    { scale: 1.14, xPercent: 5 },
    {
      scale: 1, xPercent: 0,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: hst('.about-extra-img--a', { start: 'left 100%' })
    }
  );

  /* ---- B: nasce de dentro de A
     A ocupa: left 96vw, width 44vw → direita em 140vw
     B ocupa: left 124vw, width 28vw → 57% de B está dentro de A (esquerda)
     B ocupa: bottom 5vh, height 46vh → top em 49vh; A top+height = 77vh
              porção de B dentro de A (Y) = 49–77vh = 28vh = 61% de B
     Clip inicial: mostra apenas os 57% × 61% de B que estão dentro de A ---- */
  gsap.fromTo('.about-extra-img--b',
    { clipPath: 'inset(0% 43% 39% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.55,
      ease: 'expo.inOut',
      delay: 0.55,
      scrollTrigger: hst('.about-extra-img--a', { start: 'left 100%' })
    }
  );
  gsap.fromTo('.about-extra-img--b img',
    { scale: 1.18 },
    {
      scale: 1,
      duration: 2.4,
      ease: 'power2.out',
      delay: 0.55,
      scrollTrigger: hst('.about-extra-img--a', { start: 'left 100%' })
    }
  );

  /* ---- C: sobe do chão ---- */
  gsap.fromTo('.about-extra-img--c',
    { clipPath: 'inset(100% 0 0 0)' },
    {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.6,
      ease: 'expo.inOut',
      scrollTrigger: hst('.about-extra-img--c', { start: 'left 100%' })
    }
  );
  gsap.fromTo('.about-extra-img--c img',
    { scale: 1.14, yPercent: 6 },
    {
      scale: 1, yPercent: 0,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: hst('.about-extra-img--c', { start: 'left 100%' })
    }
  );

  /* ---- D: nasce de dentro de C
     C ocupa: left 168vw, width 40vw → direita em 208vw
     D ocupa: left 196vw, width 26vw → 46% de D está dentro de C (esquerda)
     D ocupa: bottom 8vh, height 42vh → top em 50vh; C top+height = 72vh
              porção de D dentro de C (Y) = 50–72vh = 22vh = 52% de D
     Clip inicial: mostra apenas os 46% × 52% de D que estão dentro de C ---- */
  gsap.fromTo('.about-extra-img--d',
    { clipPath: 'inset(0% 54% 48% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.55,
      ease: 'expo.inOut',
      delay: 0.55,
      scrollTrigger: hst('.about-extra-img--c', { start: 'left 100%' })
    }
  );
  gsap.fromTo('.about-extra-img--d img',
    { scale: 1.18 },
    {
      scale: 1,
      duration: 2.4,
      ease: 'power2.out',
      delay: 0.55,
      scrollTrigger: hst('.about-extra-img--c', { start: 'left 100%' })
    }
  );

  /* ---- Projetos: capa de cada projeto — clip de baixo ---- */
  document.querySelectorAll('.project-cover').forEach((cover) => {
    const entry = cover.closest('.project-entry');

    gsap.fromTo(cover,
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.4,
        ease: 'expo.inOut',
        scrollTrigger: hst(entry, { start: 'left 98%' })
      }
    );
    gsap.fromTo(cover.querySelector('img'),
      { scale: 1.12 },
      {
        scale: 1,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: hst(entry, { start: 'left 98%' })
      }
    );
  });

  /* ---- Projetos: foto detalhe — clip lateral ---- */
  document.querySelectorAll('.project-detail').forEach((detail) => {
    const entry = detail.closest('.project-entry');

    gsap.fromTo(detail,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.2,
        ease: 'expo.inOut',
        delay: 0.45,
        scrollTrigger: hst(entry, { start: 'left 88%' })
      }
    );
  });

  /* ---- Contato: imagem lateral — clip lateral ---- */
  gsap.fromTo('.contact-image-side',
    { clipPath: 'inset(0 100% 0 0)' },
    {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.5,
      ease: 'expo.inOut',
      scrollTrigger: hst('.contact-image-side', { start: 'left 94%' })
    }
  );
  gsap.fromTo('.contact-image-side img',
    { scale: 1.1, xPercent: 5 },
    {
      scale: 1, xPercent: 0,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: hst('.contact-image-side', { start: 'left 94%' })
    }
  );
}

/* ============================================================
   INIT TEXT ANIMATIONS
   Stagger, yPercent, skew — sem repetição de padrão
   ============================================================ */
function initTextAnimations() {
  if (!hTween) return;

  /* ---- Manifesto: interlúdio tipográfico ---- */
  gsap.fromTo('.interlude-label',
    { autoAlpha: 0, x: 18 },
    {
      autoAlpha: 1, x: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: hst('.manifesto-interlude', { start: 'left 92%' })
    }
  );
  gsap.fromTo('.interlude-serif',
    { autoAlpha: 0, yPercent: 28 },
    {
      autoAlpha: 1, yPercent: 0,
      duration: 1.3,
      ease: 'power3.out',
      delay: 0.1,
      scrollTrigger: hst('.manifesto-interlude', { start: 'left 88%' })
    }
  );
  gsap.fromTo('.interlude-sans',
    { autoAlpha: 0, yPercent: 22 },
    {
      autoAlpha: 1, yPercent: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.26,
      scrollTrigger: hst('.manifesto-interlude', { start: 'left 88%' })
    }
  );
  gsap.fromTo('.interlude-sub',
    { autoAlpha: 0, x: -12 },
    {
      autoAlpha: 1, x: 0,
      duration: 0.85,
      ease: 'power2.out',
      delay: 0.5,
      scrollTrigger: hst('.manifesto-interlude', { start: 'left 88%' })
    }
  );

  /* ---- Manifesto: palavra decorativa ---- */
  gsap.fromTo('.manifesto-word-decor span',
    { autoAlpha: 0, x: 80 },
    {
      autoAlpha: 0.55, x: 0,
      duration: 2.2,
      ease: 'power3.out',
      scrollTrigger: hst('.manifesto-word-decor', { start: 'left 92%' })
    }
  );


  /* ---- Sobre: statement + body com stagger ---- */
  gsap.fromTo(['.about-statement', '.about-body'],
    { autoAlpha: 0, y: 28 },
    {
      autoAlpha: 1, y: 0,
      duration: 1,
      stagger: 0.28,
      ease: 'power3.out',
      scrollTrigger: hst('.about-text-block')
    }
  );

  /* ---- Projetos: label "Projetos" ---- */
  gsap.fromTo('.projects-headline .headline-sans',
    { autoAlpha: 0, x: -20 },
    {
      autoAlpha: 1, x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: hst('.projects-headline', { start: 'left 98%' })
    }
  );

  /* ---- Projetos: título e tipo de cada entrada ---- */
  document.querySelectorAll('.project-entry').forEach((entry) => {
    gsap.fromTo(
      entry.querySelectorAll('.project-title, .project-type'),
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1, y: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: hst(entry, { start: 'left 80%' })
      }
    );
    gsap.fromTo(entry.querySelector('.project-index'),
      { autoAlpha: 0, x: -30 },
      {
        autoAlpha: 1, x: 0,
        duration: 1.4,
        ease: 'power3.out',
        delay: 0.1,
        scrollTrigger: hst(entry, { start: 'left 80%' })
      }
    );
  });

  /* ---- Contato: headline ---- */
  gsap.fromTo('.contact-headline .headline-serif',
    { autoAlpha: 0, yPercent: 20, skewY: 1.5 },
    {
      autoAlpha: 1, yPercent: 0, skewY: 0,
      duration: 1.5,
      ease: 'power4.out',
      scrollTrigger: hst('.contact-headline', { start: 'left 96%' })
    }
  );
  gsap.fromTo('.contact-headline .headline-sans',
    { autoAlpha: 0, yPercent: 15 },
    {
      autoAlpha: 1, yPercent: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2,
      scrollTrigger: hst('.contact-headline', { start: 'left 96%' })
    }
  );

  /* ---- Contato: corpo + links ---- */
  gsap.fromTo(['.contact-body p', '.contact-email', '.contact-instagram'],
    { autoAlpha: 0, y: 20 },
    {
      autoAlpha: 1, y: 0,
      duration: 0.9,
      stagger: 0.18,
      ease: 'power3.out',
      scrollTrigger: hst('.contact-details')
    }
  );

  /* ---- Contato: identidade watermark ---- */
  gsap.fromTo('.closing-vida',
    { autoAlpha: 0, yPercent: 12 },
    {
      autoAlpha: 1, yPercent: 0,
      duration: 1.6,
      ease: 'power3.out',
      delay: 0.4,
      scrollTrigger: hst('.contact-closing-identity')
    }
  );
}

/* ============================================================
   INIT PROJECT INTERACTIONS
   GSAP hover — suave, preciso, sem conflito com CSS
   ============================================================ */
function initProjectInteractions() {
  document.querySelectorAll('.project-entry').forEach((entry) => {
    const img    = entry.querySelector('.project-cover img');
    const title  = entry.querySelector('.project-title');
    const detail = entry.querySelector('.project-detail');

    /* Remove transição CSS para evitar conflito com GSAP */
    if (img) img.style.transition = 'none';

    entry.addEventListener('mouseenter', () => {
      if (img)    gsap.to(img,    { scale: 1.06, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
      if (title)  gsap.to(title,  { y: -9,       duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
      if (detail) gsap.to(detail, { x: -10, scale: 1.02, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
    });

    entry.addEventListener('mouseleave', () => {
      if (img)    gsap.to(img,    { scale: 1,  duration: 1,   ease: 'power2.inOut', overwrite: 'auto' });
      if (title)  gsap.to(title,  { y: 0,      duration: 0.6, ease: 'power2.inOut', overwrite: 'auto' });
      if (detail) gsap.to(detail, { x: 0, scale: 1, duration: 0.8, ease: 'power2.inOut', overwrite: 'auto' });
    });
  });
}

/* ============================================================
   INIT NAVIGATION
   Links do menu disparam scroll suave até o capítulo
   Posição horizontal → posição vertical (matemática linear)
   ============================================================ */
function initNavigation() {
  const wrapper = document.querySelector('#horizontal-wrapper');

  document.querySelectorAll('#nav-links a').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;

      /* Links externos — transição de saída antes de navegar */
      if (!href.startsWith('#')) {
        e.preventDefault();
        gsap.to('#horizontal-wrapper', {
          autoAlpha: 0, y: -20, duration: 0.55, ease: 'power2.inOut',
          onComplete: () => { window.location.href = href; }
        });
        return;
      }

      e.preventDefault();
      const target = document.querySelector(href);
      if (!target || !wrapper) return;

      /* scrollY = offsetLeft do capítulo no wrapper
         porque o GSAP mapeia 1:1 pixel horizontal → pixel de scroll vertical */
      const maxScroll = wrapper.scrollWidth - window.innerWidth;
      const destY     = Math.min(target.offsetLeft, maxScroll);

      window.scrollTo({ top: destY, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   INIT RESPONSIVE
   Desktop: horizontal GSAP  |  Mobile: vertical nativo
   ============================================================ */
function initResponsiveBehavior() {
  const mm = gsap.matchMedia();

  /* ---- Desktop ---- */
  mm.add('(min-width: 769px)', () => {
    initHorizontalScroll();
    initImageReveals();
    initTextAnimations();
    initNavigation();

    ScrollTrigger.refresh();

    /* Deep-link: rolar para o capítulo indicado no hash da URL */
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      const wrapper = document.querySelector('#horizontal-wrapper');
      if (target && wrapper) {
        const maxScroll = wrapper.scrollWidth - window.innerWidth;
        window.scrollTo({ top: Math.min(target.offsetLeft, maxScroll) });
      }
    }

    /* Cleanup ao abandonar breakpoint desktop */
    return () => {
      if (hTween) {
        hTween.kill();
        hTween = null;
      }
      ScrollTrigger.getAll().forEach((st) => st.kill());

      /* Restaurar overflow para mobile */
      const scroll = document.querySelector('#horizontal-scroll');
      if (scroll) scroll.style.overflow = 'visible';
    };
  });

  /* ---- Mobile ---- */
  mm.add('(max-width: 768px)', () => {
    const scroll = document.querySelector('#horizontal-scroll');
    if (scroll) {
      scroll.style.height = 'auto';
      scroll.style.overflow = 'visible';
    }

    /* Reveals simples em scroll vertical */
    const revealEls = document.querySelectorAll(
      '.project-cover, .portrait--lead, .contact-image-side'
    );
    revealEls.forEach((el) => {
      gsap.fromTo(el,
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1, y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    const textEls = document.querySelectorAll(
      '.about-statement, .contact-headline, .project-title'
    );
    textEls.forEach((el) => {
      gsap.fromTo(el,
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1, y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  });
}

/* ============================================================
   ENTRY POINT
   ============================================================ */
window.addEventListener('load', () => {
  const loaderSeen = sessionStorage.getItem('av-loader-seen');

  if (loaderSeen) {
    /* Visita de retorno — pula o loader e revela o conteúdo diretamente */
    const loader       = document.querySelector('#intro-loader');
    const identityArq  = document.querySelector('#identity-arquitetura');
    const identityVida = document.querySelector('#identity-vida');

    if (loader) loader.style.display = 'none';
    gsap.set([identityArq, identityVida], { opacity: 1 });

    /* Fade-in suave do documento (oculto pelo script inline no <head>) */
    gsap.to(document.documentElement, { opacity: 1, duration: 0.45, ease: 'power2.out' });

    initResponsiveBehavior();
    initProjectInteractions();
    initProjectTransitions();
    ScrollTrigger.refresh();
  } else {
    sessionStorage.setItem('av-loader-seen', '1');
    const loaderTl = initLoader();

    loaderTl.eventCallback('onComplete', () => {
      initResponsiveBehavior();
      initProjectInteractions();
      initProjectTransitions();
      ScrollTrigger.refresh();
    });
  }
});
