// Three.js 3D scene – rotating abstract forest core
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Group of low-poly trees
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

    // Floating particles (leaves)
    const particleCount = 400;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i*3] = (Math.random() - 0.5) * 12;
        particlePositions[i*3+1] = Math.random() * 5;
        particlePositions[i*3+2] = (Math.random() - 0.5) * 8 - 2;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xa5d6a5, size: 0.05 });
    const particles = new THREE.Points(particlesGeometry, particleMat);
    scene.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(2, 5, 3);
    scene.add(dirLight);
    const backLight = new THREE.PointLight(0x4caf50, 0.3);
    backLight.position.set(-1, 1, -2);
    scene.add(backLight);

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.005;
        treeGroup.rotation.y = time * 0.3;
        particles.rotation.y = time * 0.1;
        particles.rotation.x = Math.sin(time * 0.2) * 0.1;
        camera.lookAt(0, 1, 0);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}