// Ensure GSAP and ScrollTrigger are registered
gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initHeroAnimations();
    initScrollAnimations();
    initMagneticEffect();
    initMarquee();
    initProjectReveal();
    initPhotoReveal();
    initDynamicThumbnails();
});

// Auto-generate thumbnails based on Card Hrefs API Call
function initDynamicThumbnails() {
    const projectCards = document.querySelectorAll('a.project-card');
    
    projectCards.forEach(card => {
        const url = card.getAttribute('href');
        // Only trigger if URL is a valid http link instead of placeholder '#'
        if (url && url.startsWith('http')) {
            card.setAttribute('target', '_blank');
            const img = card.querySelector('.img-container img');
            // Ensure we don't overwrite manual thumbnail uploads
            if (img && (!img.getAttribute('src') || img.getAttribute('src') === "")) {
                // Generates a robust visual screenshot thumbnail automatically based purely on the link provided
                img.src = `https://image.thum.io/get/width/1200/crop/800/${url}`;
            }
        } else {
            // No real link — prevent navigation and remove pointer cursor hint
            card.addEventListener('click', (e) => e.preventDefault());
            card.style.cursor = 'default';
        }
    });
}

// Photo Reveal Interactive Mask (Fragmented Rectangles)
function initPhotoReveal() {
    const container = document.getElementById('photo-reveal-container');
    const maskImgs = document.querySelectorAll('.photo-reveal-mask');
    
    if (!container || maskImgs.length === 0) return;
    
    let mouse = { x: 0, y: 0 };
    let isHovering = false;
    let rafId = null;
    
    const fragments = [];
    maskImgs.forEach((_, i) => {
        fragments.push({
            w: Math.random() * 30 + 30,
            h: Math.random() * 40 + 30,
            ox: (Math.random() - 0.5) * 80,
            oy: (Math.random() - 0.5) * 80,
            // Cap max trailing duration at 0.3s to prevent lag-induced conflicts
            d: Math.min(0.05 + (i * 0.03), 0.3)
        });
    });
    
    container.addEventListener('mouseenter', () => {
        isHovering = true;
        if (!rafId) rafId = requestAnimationFrame(update);
    });
    
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    container.addEventListener('mouseleave', () => {
        isHovering = false;
        cancelAnimationFrame(rafId);
        rafId = null;
        
        // Kill all active tweens and collapse fragments back
        maskImgs.forEach((mask) => {
            gsap.to(mask, {
                clipPath: 'inset(50%)',
                duration: 0.35,
                ease: 'power3.out',
                overwrite: true
            });
        });
    });
    
    function update() {
        if (!isHovering) return;
        
        const rect = container.getBoundingClientRect();
        
        maskImgs.forEach((mask, index) => {
            if (index >= fragments.length) return;
            const frag = fragments[index];
            
            const x = mouse.x + frag.ox;
            const y = mouse.y + frag.oy;
            
            // Clamp so fragments stay fully within container bounds
            const top    = Math.max(0, Math.min(y - frag.h / 2, rect.height));
            const bottom = Math.max(0, Math.min(rect.height - (y + frag.h / 2), rect.height));
            const left   = Math.max(0, Math.min(x - frag.w / 2, rect.width));
            const right  = Math.max(0, Math.min(rect.width - (x + frag.w / 2), rect.width));
            
            gsap.to(mask, {
                clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px)`,
                duration: frag.d,
                ease: 'power2.out',
                overwrite: true
            });
        });
        
        rafId = requestAnimationFrame(update);
    }
}

// 1.5 Project Reveal UI
function initProjectReveal() {
    const btn = document.getElementById('see-more-btn');
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        const list = document.getElementById('extra-projects-list');
        if (list) {
            list.classList.remove('hidden');
            list.style.display = 'flex';
            gsap.fromTo(list.children, 
                { opacity: 0, y: 30 }, 
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
            );
        }
        btn.parentElement.classList.add('hidden');
        ScrollTrigger.refresh();
    });
}

// 1. Cursor Logic
function initCursor() {
    const cursors = [
        document.getElementById('cursor-1'),
        document.getElementById('cursor-2'),
        document.getElementById('cursor-3'),
        document.getElementById('cursor-4')
    ];

    // Initial cursor position
    gsap.set(cursors, { x: window.innerWidth / 2, y: window.innerHeight / 2 });

    document.addEventListener('mousemove', (e) => {
        // Ensure centering relative to cursor size is handled by css transform
        gsap.to(cursors[0], {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
        
        // Trail stagger logic
        gsap.to(cursors.slice(1), {
            x: e.clientX,
            y: e.clientY,
            duration: 0.4,
            stagger: 0.05,
            ease: "power3.out"
        });
    });

    // Hover state for interactive elements
    const targets = document.querySelectorAll('a, button, .project-card, .magnetic');
    targets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            gsap.to(cursors[0], { scale: 2.5, backgroundColor: '#ffffff', duration: 0.3 });
        });
        target.addEventListener('mouseleave', () => {
            gsap.to(cursors[0], { scale: 1, backgroundColor: 'var(--accent)', duration: 0.3 });
        });
    });
}

// 2. Hero Animations
function initHeroAnimations() {
    const tl = gsap.timeline();

    tl.to('.hero-line', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out'
    })
        .to('.hero-text', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.8')
        .to('.hero-border', {
            width: '100%',
            duration: 1.5,
            ease: 'expo.inOut'
        }, '-=1');
}

// 3. Scroll Trigger Animations
function initScrollAnimations() {
    // Reveal text on scroll
    gsap.utils.toArray('.reveal-on-scroll').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Project card parallax
    gsap.utils.toArray('.project-card').forEach(card => {
        const speed = parseFloat(card.getAttribute('data-parallax')) || 0.1;
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            y: (i, target) => -window.innerHeight * speed,
            ease: 'none'
        });
    });

    // Footer title reveal
    gsap.from('.footer-title', {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out'
    });

    // Grid lines reveal
    gsap.from('.grid-col', {
        height: 0,
        duration: 2,
        stagger: 0.2,
        ease: 'power4.inOut'
    });

    // Reveal Full Width Img Parallax
    gsap.from('.reveal-img', {
        scrollTrigger: {
            trigger: '.reveal-img',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        scale: 1.15,
        ease: 'none'
    });

    // Sticky Stack Interaction removed for 4-col layout
    // Project Card Parallax removed for stable grid flow
}

// 4. Magnetic Effect
function initMagneticEffect() {
    const magnetics = document.querySelectorAll('.magnetic');

    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const bound = this.getBoundingClientRect();
            const x = e.clientX - bound.left - bound.width / 2;
            const y = e.clientY - bound.top - bound.height / 2;

            gsap.to(this, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.6,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', function () {
            gsap.to(this, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

// Handle window resize for animations
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// 5. Infinite Marquee
function initMarquee() {
    const tracks = document.querySelectorAll('.marquee');
    if (tracks.length === 0) return;
    
    gsap.to(tracks, {
        xPercent: -100,
        repeat: -1,
        duration: 35,
        ease: "linear"
    });
}


