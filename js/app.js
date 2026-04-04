// Ensure GSAP and ScrollTrigger are registered
gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initHeroAnimations();
    initScrollAnimations();
    initMagneticEffect();
    initMarquee();
    initHeroCanvas();
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
    
    // Dynamically program properties for up to 25 fragments for trailing setup
    const fragments = [];
    maskImgs.forEach((_, i) => {
        fragments.push({
            w: Math.random() * 30 + 30,      // tightly cropped random widths
            h: Math.random() * 40 + 30,      // tightly cropped random heights
            ox: (Math.random() - 0.5) * 80,  // closely packed grouping offset
            oy: (Math.random() - 0.5) * 80,
            // Increasing GSAP duration heavily trails the highest indexes, staggering the cluster
            d: 0.05 + (i * 0.04) 
        });
    });
    
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const baseX = e.clientX - rect.left;
        const baseY = e.clientY - rect.top;
        
        maskImgs.forEach((mask, index) => {
            if (index >= fragments.length) return;
            const frag = fragments[index];
            
            // Apply offsets directly to base coordinates to form the cluster
            const x = baseX + frag.ox;
            const y = baseY + frag.oy;
            
            // Calculate pixel insets natively bound to the container
            const top = Math.max(0, y - frag.h / 2);
            const bottom = Math.max(0, rect.height - (y + frag.h / 2));
            const left = Math.max(0, x - frag.w / 2);
            const right = Math.max(0, rect.width - (x + frag.w / 2));
            
            gsap.to(mask, {
                clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px)`,
                scale: 1, 
                duration: frag.d,
                ease: "power2.out"
            });
        });
    });
    
    container.addEventListener('mouseleave', () => {
        maskImgs.forEach((mask) => {
            gsap.to(mask, {
                clipPath: "inset(50%)",
                scale: 1.05,
                duration: 0.4,
                ease: "power3.out"
            });
        });
    });
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

// 6. Interactive Hero Canvas
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    const spacing = 45; // Space between grid dots
    
    let mouse = { x: -1000, y: -1000 };
    
    function resize() {
        const parent = canvas.parentElement;
        width = parent.offsetWidth;
        height = parent.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }
    
    function initParticles() {
        particles = [];
        const cols = Math.floor(width / spacing);
        const rows = Math.floor(height / spacing);
        
        // Center the grid
        const offsetX = (width - cols * spacing) / 2;
        const offsetY = (height - rows * spacing) / 2;
        
        for (let i = 0; i <= cols; i++) {
            for (let j = 0; j <= rows; j++) {
                particles.push({
                    x: offsetX + i * spacing,
                    y: offsetY + j * spacing,
                    baseX: offsetX + i * spacing,
                    baseY: offsetY + j * spacing,
                    vx: 0,
                    vy: 0,
                    alpha: 0,
                    size: Math.random() * 6 + 2 // Vary sizes
                });
            }
        }
    }
    
    window.addEventListener('resize', resize);
    
    const parent = canvas.parentElement;
    parent.addEventListener('mousemove', (e) => {
        const rect = parent.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    parent.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            const dx = mouse.x - p.baseX;
            const dy = mouse.y - p.baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            const maxDist = 250; // slightly wider than original 200
            
            if (dist < maxDist) {
                const force = (maxDist - dist) / maxDist;
                const angle = Math.atan2(dy, dx);
                
                // Simple radial distortion wave
                const targetX = p.baseX - Math.cos(angle) * force * 50;
                const targetY = p.baseY - Math.sin(angle) * force * 50;
                
                p.vx += (targetX - p.x) * 0.2;
                p.vy += (targetY - p.y) * 0.2;
                
                p.alpha = force * 0.8;
            } else {
                p.vx += (p.baseX - p.x) * 0.1;
                p.vy += (p.baseY - p.y) * 0.1;
                p.alpha *= 0.9;
            }
            
            p.vx *= 0.8;
            p.vy *= 0.8;
            
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.alpha > 0.02) {
                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
                ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    resize();
    animate();
}
