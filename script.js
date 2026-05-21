// PAGE NAVIGATION (SPA)
const pages = {
    home: document.getElementById('page-home'),
    'how-it-works': document.getElementById('page-how-it-works'),
    shop: document.getElementById('page-shop'),
    science: document.getElementById('page-science'),
    impact: document.getElementById('page-impact')
};

const navLinks = document.querySelectorAll('[data-page]');
const footerLinks = document.querySelectorAll('footer a[data-page]');

function showPage(pageId) {
    Object.values(pages).forEach(page => page.classList.remove('active'));
    pages[pageId].classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('data-page') === pageId) link.classList.add('active');
        else link.classList.remove('active');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.ScrollReveal) ScrollReveal().sync();
    // Re-trigger progress bar animations on science page
    if (pageId === 'science') animateProgressBars();
    if (pageId === 'impact') drawMap();
}

navLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); showPage(link.getAttribute('data-page')); }));
footerLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); showPage(link.getAttribute('data-page')); }));

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');
if (hamburger) {
    hamburger.addEventListener('click', () => navLinksContainer.classList.toggle('active'));
    document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => navLinksContainer.classList.remove('active')));
}

// Newsletter
document.getElementById('newsletter-form')?.addEventListener('submit', (e) => { e.preventDefault(); alert('Thanks! Your guide is on its way (demo).'); e.target.reset(); });

// CO₂ calculator
document.getElementById('calc-btn')?.addEventListener('click', () => {
    let sqft = document.getElementById('sqft').value;
    let co2 = (sqft / 100) * 290;
    document.getElementById('calc-result').innerText = `~ ${Math.round(co2)} lbs CO₂ per year`;
});

// Progress bars animation (on scroll)
function animateProgressBars() {
    document.querySelectorAll('.progress-fill').forEach(bar => {
        const width = bar.parentElement.previousElementSibling?.innerText.includes('10x') ? '90%' : 
                      bar.parentElement.previousElementSibling?.innerText.includes('30x') ? '96%' : '70%';
        bar.style.width = width;
    });
}
// Trigger when science page becomes active
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.closest('#page-science')) animateProgressBars();
    });
}, { threshold: 0.5 });
document.querySelectorAll('.progress-fill').forEach(el => observer.observe(el));

// Back to top button
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) backBtn.style.display = 'block';
    else backBtn.style.display = 'none';
});
backBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Custom cursor
const cursor = document.querySelector('.cursor');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
}

// Product filter
const sizeFilter = document.getElementById('sizeFilter');
if (sizeFilter) {
    sizeFilter.addEventListener('change', () => {
        const selected = sizeFilter.value;
        document.querySelectorAll('.product-full-card').forEach(card => {
            if (selected === 'all' || card.dataset.size === selected) card.style.display = 'grid';
            else card.style.display = 'none';
        });
    });
}

// Accordion FAQ
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('active');
    });
});

// Before/After Slider
const slider = document.getElementById('sliderHandle');
const afterDiv = document.querySelector('.comparison-after');
if (slider && afterDiv) {
    slider.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const onMouseMove = (moveEvent) => {
            const rect = slider.parentElement.getBoundingClientRect();
            let newWidth = ((moveEvent.clientX - rect.left) / rect.width) * 100;
            newWidth = Math.min(100, Math.max(0, newWidth));
            afterDiv.style.width = newWidth + '%';
            slider.style.left = newWidth + '%';
        };
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

// Swiper testimonial
if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonial-swiper', {
        loop: true,
        autoplay: { delay: 4000 },
        pagination: { el: '.swiper-pagination', clickable: true }
    });
}

// Simulated map on Impact page
function drawMap() {
    const canvas = document.getElementById('mapCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w; canvas.height = h;
    ctx.fillStyle = '#d9e8d5';
    ctx.fillRect(0, 0, w, h);
    const cities = [[150,120,'Portland'],[300,200,'Austin'],[450,150,'Denver'],[600,180,'Boston'],[700,250,'Atlanta']];
    cities.forEach(c => {
        ctx.beginPath();
        ctx.arc(c[0], c[1], 8, 0, 2*Math.PI);
        ctx.fillStyle = '#2E5C3E';
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '12px Inter';
        ctx.fillText(c[2], c[0]-20, c[1]-10);
    });
}
window.addEventListener('resize', () => drawMap());

// Counter animation on scroll (Impact page)
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(document.getElementById('forests-count'), 12000, 12487, 2000);
            animateCounter(document.getElementById('co2-count'), 800, 892, 1500);
            animateCounter(document.getElementById('water-count'), 8000000, 8320000, 2000);
            animateCounter(document.getElementById('pollinators-count'), 1200000, 1241887, 2000);
            counterObserver.disconnect();
        }
    });
}, { threshold: 0.5 });
const countersSection = document.querySelector('.live-counters');
if (countersSection) counterObserver.observe(countersSection);

function animateCounter(element, start, end, duration) {
    if (!element) return;
    let range = end - start;
    let stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    let timer = setInterval(() => {
        current += (range > 0 ? 1 : -1);
        element.innerText = current.toLocaleString();
        if (current == end) clearInterval(timer);
    }, stepTime);
}

// ScrollReveal
if (typeof ScrollReveal !== 'undefined') {
    ScrollReveal({ reset: false, distance: '40px', duration: 800, easing: 'ease-out', opacity: 0, scale: 0.95 });
    ScrollReveal().reveal('.scroll-reveal', { interval: 100, origin: 'bottom' });
    ScrollReveal().reveal('.hero-content', { origin: 'top', delay: 200 });
    ScrollReveal().reveal('.hero-stats', { origin: 'bottom', delay: 400 });
}

// 3D Scene (Three.js) - same as before but with extra floating leaves
const canvas3d = document.getElementById('bg-canvas');
if (canvas3d && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas3d, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    const treeGroup = new THREE.Group();
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x4caf50 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B5A2B });
    for (let i = 0; i < 60; i++) {
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.6), trunkMat);
        trunk.position.y = 0.3;
        const foliage1 = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.8, 6), treeMat);
        foliage1.position.y = 0.7;
        const foliage2 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 6), treeMat);
        foliage2.position.y = 1.1;
        tree.add(trunk, foliage1, foliage2);
        const radius = 3;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius * (Math.random() * 1.2);
        const z = Math.sin(angle) * radius * (Math.random() * 1.2);
        tree.position.set(x, 0, z);
        tree.rotation.y = Math.random() * Math.PI;
        tree.scale.setScalar(0.7 + Math.random() * 0.6);
        treeGroup.add(tree);
    }
    scene.add(treeGroup);
    const particleCount = 600;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i*3] = (Math.random() - 0.5) * 15;
        particlePositions[i*3+1] = Math.random() * 6;
        particlePositions[i*3+2] = (Math.random() - 0.5) * 10 - 2;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xa5d6a5, size: 0.06 });
    const particles = new THREE.Points(particlesGeometry, particleMat);
    scene.add(particles);
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(2, 5, 3);
    scene.add(dirLight);
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.005;
        treeGroup.rotation.y = time * 0.3;
        particles.rotation.y = time * 0.1;
        particles.rotation.x = Math.sin(time * 0.2) * 0.1;
        renderer.render(scene, camera);
    }
    animate();
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}