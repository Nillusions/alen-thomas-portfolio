/* 
    Theme Controller (Interactive Swatch Mode)
*/

document.addEventListener('DOMContentLoaded', () => {
    const themeOpenBtn = document.getElementById('theme-open-btn');
    const themeCloseBtn = document.getElementById('theme-close-btn');
    const themeOverlay = document.getElementById('theme-overlay');
    const resetBtn = document.getElementById('theme-reset-btn');

    const bgSwatches = document.querySelectorAll('.bg-swatch');
    const accentSwatches = document.querySelectorAll('.accent-swatch');

    // Open Modal
    if (themeOpenBtn && themeOverlay) {
        themeOpenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            themeOverlay.classList.add('active');
        });
    }

    // Close Modal
    if (themeCloseBtn && themeOverlay) {
        themeCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            themeOverlay.classList.remove('active');
        });
    }
    
    // Close Modal on Background Click
    if (themeOverlay) {
        themeOverlay.addEventListener('click', (e) => {
            if (e.target === themeOverlay) {
                themeOverlay.classList.remove('active');
            }
        });
    }

    // Handle Background Selection
    bgSwatches.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const bg = btn.getAttribute('data-bg');
            const bgAlt = btn.getAttribute('data-bgalt');
            const text = btn.getAttribute('data-text');
            const grid = btn.getAttribute('data-grid');
            
            document.documentElement.style.setProperty('--bg', bg);
            document.documentElement.style.setProperty('--bg-alt', bgAlt);
            document.documentElement.style.setProperty('--text', text);
            document.documentElement.style.setProperty('--grid-color', grid);
        });
    });

    // Handle Accent Selection
    accentSwatches.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const accent = btn.getAttribute('data-accent');
            
            document.documentElement.style.setProperty('--accent', accent);
            
            // Update the overlay Reset button color so the modal matches the live accent
            if(resetBtn) resetBtn.style.color = accent;
        });
    });

    // Handle Reset
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Clear inline styles to revert back to native :root definitions
            document.documentElement.style.removeProperty('--bg');
            document.documentElement.style.removeProperty('--bg-alt');
            document.documentElement.style.removeProperty('--text');
            document.documentElement.style.removeProperty('--grid-color');
            document.documentElement.style.removeProperty('--accent');
            resetBtn.style.color = '';

            themeOverlay.classList.remove('active');
        });
    }
});
