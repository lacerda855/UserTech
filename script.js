"use strict";
/* =========================================================
   USERTECHEVOLUTION — LANDING PAGE SCRIPTS (TypeScript)
   Compile com: tsc  (usa o tsconfig.json ao lado deste arquivo)
   Saída: script.js — é esse arquivo que o index.html carrega.
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const inits = [
        setYear, initHeaderScroll, initMobileNav, initSmoothScroll, initScrollReveal,
        initCounters, initNeuralNetwork, initContactForm, initCursorGlow, initCursorDot,
        initTypedTerminal, initTiltCards, initPortfolioFilters, initProjectModal,
        initMagneticButtons, initPricingToggle, initPlanSelection, initFlipCardsTouch,
        initLogoRipple, initScrollProgress, initScrollSpy, initHeroParallax,
        initNavIndicator, initDemoPreview, initConfetti
    ];
    // Cada init roda isolado: se um quebrar, os demais continuam normalmente.
    inits.forEach(fn => {
        try {
            fn();
        }
        catch (err) {
            console.error(`[UserTechEvolution] Falha ao iniciar ${fn.name}:`, err);
        }
    });
});
/* ---------- Footer year ---------- */
function setYear() {
    const el = document.getElementById('year');
    if (el)
        el.textContent = String(new Date().getFullYear());
}
/* ---------- Header shadow / blur on scroll ---------- */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header)
        return;
    const toggle = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
}
/* ---------- Mobile nav toggle ---------- */
function initMobileNav() {
    const btn = document.getElementById('navToggle');
    const nav = document.getElementById('nav');
    if (!btn || !nav)
        return;
    const closeNav = () => {
        nav.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
    };
    btn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open'))
            closeNav();
    });
}
/* ---------- Smooth scroll for anchor links ---------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (!id || id.length < 2)
                return;
            const target = document.querySelector(id);
            if (!target)
                return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}
/* ---------- Scroll reveal via IntersectionObserver ---------- */
function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length)
        return;
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('is-visible'));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                setTimeout(() => el.classList.add('is-visible'), (i % 4) * 90);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    items.forEach(el => observer.observe(el));
}
/* ---------- Animated counters ---------- */
function initCounters() {
    const counters = document.querySelectorAll('.stat__number');
    if (!counters.length)
        return;
    const animate = (el) => {
        var _a;
        const target = parseInt((_a = el.dataset.target) !== null && _a !== void 0 ? _a : '0', 10) || 0;
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const start = performance.now();
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);
            el.textContent = value + suffix;
            if (progress < 1)
                requestAnimationFrame(step);
            else
                el.textContent = target + suffix;
        };
        requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) {
        counters.forEach(animate);
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });
    counters.forEach(el => observer.observe(el));
}
/* ---------- Rede neural: cobre a página INTEIRA (fixa), reativa ao mouse ---------- */
function initNeuralNetwork() {
    const canvas = document.getElementById('neuralCanvas');
    if (!canvas)
        return;
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width, height, nodes, nodeCount;
    const COLORS = ['#3E7BFA', '#8B5CF6', '#00E5FF'];
    const LINK_DIST = 150;
    const MOUSE_RADIUS = 150;
    const mouse = { x: -9999, y: -9999, active: false };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    }, { passive: true });
    window.addEventListener('mouseleave', () => { mouse.active = false; });
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        nodeCount = Math.max(36, Math.floor((width * height) / 26000));
        createNodes();
    }
    function createNodes() {
        nodes = Array.from({ length: nodeCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.6 + 1,
            color: COLORS[Math.floor(Math.random() * COLORS.length)]
        }));
    }
    function draw() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINK_DIST) {
                    ctx.strokeStyle = `rgba(110, 155, 255, ${0.14 * (1 - dist / LINK_DIST)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
        nodes.forEach(n => {
            ctx.beginPath();
            ctx.fillStyle = n.color;
            ctx.shadowColor = n.color;
            ctx.shadowBlur = 6;
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            if (!prefersReducedMotion) {
                if (mouse.active) {
                    const dx = mouse.x - n.x;
                    const dy = mouse.y - n.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MOUSE_RADIUS) {
                        const force = (1 - dist / MOUSE_RADIUS) * 0.03;
                        n.vx += dx * force * 0.02;
                        n.vy += dy * force * 0.02;
                    }
                }
                n.vx *= 0.985;
                n.vy *= 0.985;
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > width)
                    n.vx *= -1;
                if (n.y < 0 || n.y > height)
                    n.vy *= -1;
            }
        });
    }
    function loop() {
        draw();
        if (!prefersReducedMotion)
            requestAnimationFrame(loop);
    }
    resize();
    window.addEventListener('resize', debounce(resize, 200));
    if (prefersReducedMotion)
        draw();
    else
        requestAnimationFrame(loop);
}
/* ---------- Debounce genérico e tipado ---------- */
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
/* ---------- Contact form (front-end validation + feedback) ---------- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form || !status)
        return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = form.elements.namedItem('name');
        const emailInput = form.elements.namedItem('email');
        const messageInput = form.elements.namedItem('message');
        if (!nameInput || !emailInput || !messageInput)
            return;
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name || !email || !message) {
            status.textContent = 'Preencha nome, e-mail e mensagem para continuar.';
            status.style.color = '#ff6b81';
            return;
        }
        if (!emailPattern.test(email)) {
            status.textContent = 'Informe um e-mail válido.';
            status.style.color = '#ff6b81';
            return;
        }
        // TODO: conectar a um backend real, webhook ou serviço de e-mail/CRM.
        status.style.color = '#00E5FF';
        status.textContent = `Obrigado, ${name.split(' ')[0]}! Recebemos sua mensagem e retornaremos em breve.`;
        form.reset();
    });
}
/* ---------- Cursor spotlight (brilho ambiente que segue o mouse) ---------- */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.matchMedia('(hover: none)').matches)
        return;
    window.addEventListener('mousemove', (e) => {
        glow.classList.add('is-active');
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }, { passive: true });
    document.addEventListener('mouseleave', () => glow.classList.remove('is-active'));
}
/* ---------- Cursor duplo: ponto sólido que cresce sobre elementos clicáveis ---------- */
function initCursorDot() {
    const dot = document.getElementById('cursorDot');
    if (!dot || window.matchMedia('(hover: none)').matches)
        return;
    window.addEventListener('mousemove', (e) => {
        dot.classList.add('is-active');
        dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }, { passive: true });
    document.addEventListener('mouseleave', () => dot.classList.remove('is-active'));
    const interactiveSelector = 'a, button, .tilt, .filter-btn, .switch, input, select, textarea';
    document.querySelectorAll(interactiveSelector).forEach(el => {
        el.addEventListener('mouseenter', () => dot.classList.add('is-hovering'));
        el.addEventListener('mouseleave', () => dot.classList.remove('is-hovering'));
    });
}
/* ---------- Typed terminal line in the Hero (sparks curiosity) ---------- */
function initTypedTerminal() {
    const el = document.getElementById('typedText');
    if (!el)
        return;
    const phrases = [
        'analisando processos manuais...',
        'automatizando fluxos repetitivos...',
        'integrando modelos de IA ao seu negócio...',
        'reduzindo custo operacional em tempo real...',
        'escalando sistemas sob demanda...'
    ];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        el.textContent = phrases[0];
        return;
    }
    let phraseIndex = 0, charIndex = 0, deleting = false;
    function tick() {
        const current = phrases[phraseIndex];
        if (!deleting) {
            charIndex++;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
                deleting = true;
                setTimeout(tick, 1600);
                return;
            }
        }
        else {
            charIndex--;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }
        setTimeout(tick, deleting ? 28 : 45);
    }
    tick();
}
/* ---------- 3D tilt effect on service, project & plan cards ---------- */
function initTiltCards() {
    const cards = document.querySelectorAll('.tilt');
    if (!cards.length || window.matchMedia('(hover: none)').matches)
        return;
    const MAX_TILT = 7;
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateY = (x - 0.5) * MAX_TILT * 2;
            const rotateX = (0.5 - y) * MAX_TILT * 2;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}
/* ---------- Portfolio category filters ---------- */
function initPortfolioFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('#portfolioGrid .project-card');
    if (!buttons.length || !cards.length)
        return;
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
            btn.classList.add('is-active');
            btn.setAttribute('aria-selected', 'true');
            const filter = btn.dataset.filter;
            cards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('is-hidden', !match);
            });
        });
    });
}
const PROJECTS = {
    logistica: {
        category: 'Web & Sistemas',
        title: 'Plataforma de Gestão Logística',
        image: 'https://picsum.photos/seed/utd-logistica/900/600',
        challenge: 'A operação dependia de planilhas manuais para roteirizar entregas, gerando atrasos e falta de visibilidade em tempo real.',
        solution: 'Construímos um sistema web com roteirização automática, rastreamento em tempo real e dashboard operacional integrado à frota.',
        result: '↓ 34% no tempo médio de entrega',
        tags: ['React', 'Node.js', 'PostgreSQL', 'Google Maps API']
    },
    financeiro: {
        category: 'Automação',
        title: 'Automação Financeira Multi-ERP',
        image: 'https://picsum.photos/seed/utd-financeiro/900/600',
        challenge: 'O time financeiro conciliava manualmente pagamentos entre 4 sistemas diferentes, levando dias e gerando erros.',
        solution: 'Desenvolvemos robôs de automação (RPA) que conciliam lançamentos automaticamente entre os ERPs via APIs e filas de processamento.',
        result: '↓ 80% no tempo de conciliação',
        tags: ['Python', 'RPA', 'APIs REST', 'Filas assíncronas']
    },
    atendimento: {
        category: 'Inteligência Artificial',
        title: 'Assistente de Atendimento com IA',
        image: 'https://picsum.photos/seed/utd-atendimento/900/600',
        challenge: 'O suporte ao cliente tinha fila alta e tempo de resposta acima da meta em horários de pico.',
        solution: 'Criamos um assistente com LLM integrado ao CRM, capaz de responder dúvidas frequentes e escalar casos complexos para humanos.',
        result: '↓ 60% no tempo médio de resposta',
        tags: ['LLM', 'Next.js', 'Vector DB', 'CRM API']
    },
    mobile: {
        category: 'Web & Sistemas',
        title: 'App Mobile de Gestão de Equipes',
        image: 'https://picsum.photos/seed/utd-mobile/900/600',
        challenge: 'Times de campo registravam ponto e escalas em papel, dificultando o controle e gerando retrabalho administrativo.',
        solution: 'Lançamos um aplicativo híbrido com ponto geolocalizado, escalas dinâmicas e comunicação direta com a equipe em campo.',
        result: '+ 2.400 registros/mês automatizados',
        tags: ['React Native', 'Firebase', 'Geolocalização']
    },
    recomendacao: {
        category: 'Inteligência Artificial',
        title: 'Motor de Recomendação Preditiva',
        image: 'https://picsum.photos/seed/utd-recomendacao/900/600',
        challenge: 'O e-commerce B2B não conseguia sugerir produtos relevantes, perdendo oportunidades de cross-sell.',
        solution: 'Implementamos um modelo de machine learning que analisa histórico de compras e recomenda produtos em tempo real.',
        result: '+ 22% em ticket médio',
        tags: ['Python', 'Machine Learning', 'AWS', 'ETL']
    },
    onboarding: {
        category: 'Automação',
        title: 'Portal de Onboarding Corporativo',
        image: 'https://picsum.photos/seed/utd-onboarding/900/600',
        challenge: 'O processo de admissão envolvia dezenas de e-mails manuais e documentos soltos entre RH, TI e gestores.',
        solution: 'Construímos um portal com fluxo automatizado de aprovações, geração de documentos e provisionamento de acessos.',
        result: '↓ 70% no tempo de admissão',
        tags: ['Vue.js', 'Django', 'Assinatura digital']
    }
};
function initProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal)
        return;
    const openTriggers = document.querySelectorAll('.js-open-modal');
    const closeTriggers = modal.querySelectorAll('[data-close-modal]');
    const els = {
        image: document.getElementById('modalImage'),
        category: document.getElementById('modalCategory'),
        title: document.getElementById('modalTitle'),
        challenge: document.getElementById('modalChallenge'),
        solution: document.getElementById('modalSolution'),
        result: document.getElementById('modalResult'),
        tags: document.getElementById('modalTags')
    };
    function openModal(key) {
        if (!key)
            return;
        const data = PROJECTS[key];
        if (!data || !els.image || !els.category || !els.title || !els.challenge || !els.solution || !els.result || !els.tags)
            return;
        els.image.src = data.image;
        els.image.alt = data.title;
        els.category.textContent = data.category;
        els.title.textContent = data.title;
        els.challenge.textContent = data.challenge;
        els.solution.textContent = data.solution;
        els.result.textContent = data.result;
        els.tags.innerHTML = data.tags.map(t => `<span class="tag">${t}</span>`).join('');
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }
    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }
    openTriggers.forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.dataset.project));
    });
    closeTriggers.forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open'))
            closeModal();
    });
}
/* ---------- Toggle de planos: À vista / Parcelado em até 3x ---------- */
function initPricingToggle() {
    const toggle = document.getElementById('pricingSwitch');
    if (!toggle)
        return;
    const amounts = document.querySelectorAll('.price-card__amount[data-cash]');
    const periods = document.querySelectorAll('.price-card__period');
    const labels = document.querySelectorAll('.pricing__toggle-label');
    toggle.addEventListener('click', () => {
        const isInstallment = toggle.getAttribute('aria-checked') === 'true';
        const next = !isInstallment;
        toggle.setAttribute('aria-checked', String(next));
        labels.forEach(label => {
            const isInstallmentLabel = label.dataset.periodLabel === 'installment';
            label.classList.toggle('is-active', next ? isInstallmentLabel : !isInstallmentLabel);
        });
        amounts.forEach(el => {
            el.style.opacity = '0';
            setTimeout(() => {
                var _a, _b;
                el.textContent = next ? ((_a = el.dataset.installment) !== null && _a !== void 0 ? _a : '') : ((_b = el.dataset.cash) !== null && _b !== void 0 ? _b : '');
                el.style.opacity = '1';
            }, 150);
        });
        periods.forEach(el => {
            // Ignora o card Enterprise, cujo período não segue esse padrão
            const valueBox = el.closest('.price-card__value');
            if (!valueBox || !valueBox.querySelector('.price-card__amount[data-cash]'))
                return;
            el.style.opacity = '0';
            setTimeout(() => {
                el.textContent = next ? 'em até 3x' : 'à vista';
                el.style.opacity = '1';
            }, 150);
        });
    });
}
/* ---------- Seleção de plano: rola até o contato e pré-preenche a mensagem ---------- */
function initPlanSelection() {
    const buttons = document.querySelectorAll('.js-select-plan');
    const message = document.getElementById('message');
    const service = document.getElementById('service');
    if (!buttons.length)
        return;
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.dataset.plan;
            const target = document.querySelector('#contato');
            if (target)
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (message && !message.value) {
                message.value = `Olá! Tenho interesse no plano ${plan} e gostaria de mais informações.`;
            }
            if (service) {
                service.value = plan === 'Enterprise' ? 'other' : 'web';
            }
            setTimeout(() => message && message.focus(), 500);
        });
    });
}
/* ---------- AI flip cards: tap-to-flip em telas touch ---------- */
function initFlipCardsTouch() {
    if (!window.matchMedia('(hover: none)').matches)
        return;
    document.querySelectorAll('.ai-flip').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.ai-flip.is-flipped').forEach(other => {
                if (other !== card)
                    other.classList.remove('is-flipped');
            });
            card.classList.toggle('is-flipped');
        });
    });
}
/* ---------- Ripple ao clicar na logo (pulso SVG a partir do núcleo) ---------- */
function initLogoRipple() {
    const logoLink = document.getElementById('logoLink');
    const svg = logoLink === null || logoLink === void 0 ? void 0 : logoLink.querySelector('.logo-svg');
    if (!logoLink || !svg)
        return;
    const SVG_NS = 'http://www.w3.org/2000/svg';
    logoLink.addEventListener('click', () => {
        const ripple = document.createElementNS(SVG_NS, 'circle');
        ripple.setAttribute('cx', '20');
        ripple.setAttribute('cy', '20');
        ripple.setAttribute('r', '4.4');
        ripple.setAttribute('fill', 'none');
        ripple.setAttribute('stroke', '#00E5FF');
        ripple.setAttribute('stroke-width', '1.2');
        ripple.classList.add('logo-ripple');
        svg.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    });
}
/* ---------- Efeito magnético nos botões principais ---------- */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn--primary, .btn--ghost');
    if (!buttons.length || window.matchMedia('(hover: none)').matches)
        return;
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
}
/* ---------- Barra de progresso de rolagem ---------- */
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar)
        return;
    const update = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = pct + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
}
/* ---------- Scrollspy: destaca no menu a seção atual ---------- */
function initScrollSpy() {
    const sections = document.querySelectorAll('main section[id]');
    const links = document.querySelectorAll('.nav__link');
    if (!sections.length || !links.length || !('IntersectionObserver' in window))
        return;
    const linkBySectionId = new Map();
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#'))
            linkBySectionId.set(href.slice(1), link);
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const link = linkBySectionId.get(entry.target.id);
            if (!link || !entry.isIntersecting)
                return;
            links.forEach(l => l.classList.remove('is-active'));
            link.classList.add('is-active');
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
}
/* ---------- Indicador deslizante do menu (segue o link em hover) ---------- */
function initNavIndicator() {
    const nav = document.getElementById('nav');
    const list = document.getElementById('navList');
    const indicator = document.getElementById('navIndicator');
    if (!nav || !list || !indicator)
        return;
    const links = list.querySelectorAll('.nav__link');
    const moveTo = (el) => {
        const listRect = list.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        indicator.style.width = `${rect.width}px`;
        indicator.style.transform = `translateX(${rect.left - listRect.left}px)`;
    };
    links.forEach(link => {
        link.addEventListener('mouseenter', () => moveTo(link));
    });
    nav.addEventListener('mouseleave', () => {
        const active = list.querySelector('.nav__link.is-active');
        if (active)
            moveTo(active);
        else
            indicator.style.width = '0';
    });
}
/* ---------- Demo interativa: mini landing page animada dentro de um mockup de navegador ---------- */
function initDemoPreview() {
    const typedEl = document.getElementById('demoTyped');
    const cta = document.getElementById('demoCta');
    const tooltip = document.getElementById('demoTooltip');
    const canvas = document.getElementById('demoCanvas');
    const statNumbers = document.querySelectorAll('.demo-stat__number');
    // Texto digitado dentro do preview
    if (typedEl) {
        const phrases = [
            'Sua Empresa, Online e Vendendo.',
            'Rápido. Bonito. Funcional.',
            'Feito para converter visitas em clientes.'
        ];
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            typedEl.textContent = phrases[0];
        }
        else {
            let phraseIndex = 0, charIndex = 0, deleting = false;
            const tick = () => {
                const current = phrases[phraseIndex];
                if (!deleting) {
                    charIndex++;
                    typedEl.textContent = current.slice(0, charIndex);
                    if (charIndex === current.length) {
                        deleting = true;
                        setTimeout(tick, 1800);
                        return;
                    }
                }
                else {
                    charIndex--;
                    typedEl.textContent = current.slice(0, charIndex);
                    if (charIndex === 0) {
                        deleting = false;
                        phraseIndex = (phraseIndex + 1) % phrases.length;
                    }
                }
                setTimeout(tick, deleting ? 30 : 55);
            };
            tick();
        }
    }
    // Contadores da mini demo (dispara quando o mockup entra na tela)
    if (statNumbers.length && 'IntersectionObserver' in window) {
        const animate = (el) => {
            var _a;
            const target = parseInt((_a = el.dataset.target) !== null && _a !== void 0 ? _a : '0', 10) || 0;
            const duration = 1200;
            const start = performance.now();
            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                el.textContent = String(Math.floor((1 - Math.pow(1 - progress, 3)) * target));
                if (progress < 1)
                    requestAnimationFrame(step);
                else
                    el.textContent = String(target);
            };
            requestAnimationFrame(step);
        };
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        statNumbers.forEach(el => obs.observe(el));
    }
    // Botão de teste: ripple + tooltip "é assim que seus clientes vão clicar"
    if (cta && tooltip) {
        let tooltipShown = false;
        cta.addEventListener('click', (e) => {
            const rect = cta.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'demo-cta__ripple';
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            cta.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
            if (!tooltipShown) {
                tooltip.classList.add('is-visible');
                tooltipShown = true;
                setTimeout(() => tooltip.classList.remove('is-visible'), 2600);
            }
        });
    }
    // Mini rede de partículas dentro do mockup (mais leve que a de fundo)
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const screen = canvas.closest('.browser-mock__screen');
        if (ctx && screen) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            let width, height, nodes;
            const COLORS = ['#3E7BFA', '#8B5CF6', '#00E5FF'];
            const resize = () => {
                width = canvas.width = screen.offsetWidth;
                height = canvas.height = screen.offsetHeight;
                const count = Math.max(16, Math.floor((width * height) / 22000));
                nodes = Array.from({ length: count }, () => ({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.25,
                    vy: (Math.random() - 0.5) * 0.25,
                    r: Math.random() * 1.4 + 1,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)]
                }));
            };
            const draw = () => {
                ctx.clearRect(0, 0, width, height);
                nodes.forEach(n => {
                    ctx.beginPath();
                    ctx.fillStyle = n.color;
                    ctx.globalAlpha = 0.6;
                    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    if (!prefersReducedMotion) {
                        n.x += n.vx;
                        n.y += n.vy;
                        if (n.x < 0 || n.x > width)
                            n.vx *= -1;
                        if (n.y < 0 || n.y > height)
                            n.vy *= -1;
                    }
                });
            };
            const loop = () => { draw(); if (!prefersReducedMotion)
                requestAnimationFrame(loop); };
            resize();
            window.addEventListener('resize', debounce(resize, 250));
            if (prefersReducedMotion)
                draw();
            else
                requestAnimationFrame(loop);
        }
    }
}
/* ---------- Confete: recompensa visual ao enviar o formulário de contato ---------- */
function initConfetti() {
    const container = document.getElementById('confettiContainer');
    const form = document.getElementById('contactForm');
    if (!container || !form)
        return;
    const COLORS = ['#3E7BFA', '#8B5CF6', '#00E5FF', '#6E9BFF'];
    function burst() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
            return;
        for (let i = 0; i < 60; i++) {
            const piece = document.createElement('span');
            piece.className = 'confetti-piece';
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            const duration = 2.2 + Math.random() * 1.4;
            piece.style.animationDuration = `${duration}s`;
            piece.style.animationDelay = `${Math.random() * 0.3}s`;
            container.appendChild(piece);
            setTimeout(() => piece.remove(), (duration + 0.3) * 1000);
        }
    }
    // Observa o texto de status: se virar sucesso (cor ciano), dispara o confete.
    const status = document.getElementById('formStatus');
    if (!status)
        return;
    const observer = new MutationObserver(() => {
        var _a;
        if (status.style.color === 'rgb(0, 229, 255)' && ((_a = status.textContent) === null || _a === void 0 ? void 0 : _a.trim())) {
            burst();
        }
    });
    observer.observe(status, { attributes: true, attributeFilter: ['style'], childList: true });
}
/* ---------- Parallax sutil nos brilhos do Hero, ligado à rolagem ---------- */
function initHeroParallax() {
    const glows = document.querySelectorAll('.hero__glow');
    if (!glows.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        return;
    const update = () => {
        const y = window.scrollY;
        glows.forEach((glow, i) => {
            const speed = i === 0 ? 0.15 : 0.22;
            glow.style.transform = `translateY(${y * speed}px)`;
        });
    };
    window.addEventListener('scroll', update, { passive: true });
}
