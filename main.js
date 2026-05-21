// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// ScrollReveal configuration (no progress bar)
ScrollReveal({ 
    reset: false, 
    distance: '40px', 
    duration: 800, 
    easing: 'ease-out',
    opacity: 0,
    scale: 0.95,
    mobile: true
});
ScrollReveal().reveal('.scroll-reveal', { 
    interval: 100,
    origin: 'bottom'
});
ScrollReveal().reveal('.hero-content', { origin: 'top', delay: 200 });
ScrollReveal().reveal('.hero-stats', { origin: 'bottom', delay: 400 });

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Simple newsletter form (prevent default)
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thanks! Your guide is on its way (demo).');
        newsletterForm.reset();
    });
}