/**
 * VIJAYA CLINIC - Three.js 3D Hero Visualization
 * Interactive 3D Bio-Helix / DNA Strand with glowing molecular particles & mouse parallax
 */

(function () {
  const canvasContainer = document.querySelector('.hero-canvas-container');
  const canvas = document.getElementById('three-hero-canvas');

  if (!canvas || !canvasContainer || typeof THREE === 'undefined') {
    console.warn('Three.js or hero canvas not available; using CSS fallback.');
    return;
  }

  // Graceful degradation for low-end/mobile devices
  const isMobile = window.innerWidth < 768;
  const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    canvasContainer.clientWidth / canvasContainer.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 28;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
  } catch (e) {
    console.warn('WebGL init failed:', e);
    return;
  }

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const primaryPointLight = new THREE.PointLight(0x25a18e, 2.5, 50);
  primaryPointLight.position.set(12, 12, 12);
  scene.add(primaryPointLight);

  const accentPointLight = new THREE.PointLight(0xdf7356, 2.0, 50);
  accentPointLight.position.set(-12, -10, 10);
  scene.add(accentPointLight);

  // Main 3D Container Group
  const helixGroup = new THREE.Group();
  scene.add(helixGroup);

  // Materials with medical brand aesthetics
  const primaryMaterial = new THREE.MeshStandardMaterial({
    color: 0x0d443c,
    roughness: 0.25,
    metalness: 0.35
  });

  const mintMaterial = new THREE.MeshStandardMaterial({
    color: 0x25a18e,
    roughness: 0.2,
    metalness: 0.6,
    emissive: 0x124e44,
    emissiveIntensity: 0.35
  });

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0xdf7356,
    roughness: 0.3,
    metalness: 0.4
  });

  const bondMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4a373,
    roughness: 0.5,
    transparent: true,
    opacity: 0.8
  });

  // Construct DNA Double Helix
  const numRungs = isMobile ? 26 : 38;
  const radius = 5.2;
  const height = 24;
  const turns = 2.4;

  const sphereGeo = new THREE.SphereGeometry(isMobile ? 0.45 : 0.5, 16, 16);
  const rungCylinderGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 8);

  for (let i = 0; i < numRungs; i++) {
    const progress = i / numRungs;
    const angle = progress * Math.PI * 2 * turns;
    const y = (progress - 0.5) * height;

    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;

    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;

    // Node 1 (Strand A)
    const node1 = new THREE.Mesh(sphereGeo, i % 2 === 0 ? primaryMaterial : mintMaterial);
    node1.position.set(x1, y, z1);
    helixGroup.add(node1);

    // Node 2 (Strand B)
    const node2 = new THREE.Mesh(sphereGeo, i % 2 === 0 ? accentMaterial : mintMaterial);
    node2.position.set(x2, y, z2);
    helixGroup.add(node2);

    // Connecting Bridge / Hydrogen Bond
    const bond = new THREE.Mesh(rungCylinderGeo, bondMaterial);
    bond.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
    bond.scale.set(1, radius * 2, 1);
    bond.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(x2 - x1, 0, z2 - z1).normalize()
    );
    helixGroup.add(bond);
  }

  // Floating Bio-Particle Nebula
  const particleCount = isMobile ? 80 : 180;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleScales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 32;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 32;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    particleScales[i] = Math.random() * 0.8 + 0.2;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x25a18e,
    size: 0.35,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending
  });

  const particleField = new THREE.Points(particleGeo, particleMat);
  scene.add(particleField);

  // Mouse Parallax and Tilt
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  function onMouseMove(event) {
    const rect = canvasContainer.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    mouseX = (x / rect.width) * 2;
    mouseY = -(y / rect.height) * 2;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Handle Resize
  function onResize() {
    if (!canvasContainer || !renderer) return;
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', onResize);

  // Animation Loop
  let clock = new THREE.Clock();
  let animationFrameId;

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Constant smooth rotation
    helixGroup.rotation.y = elapsedTime * 0.45;
    helixGroup.rotation.z = Math.sin(elapsedTime * 0.3) * 0.12;

    // Mouse parallax lerp
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    helixGroup.rotation.x = targetY * 0.4;
    helixGroup.position.x = targetX * 1.5;
    helixGroup.position.y = targetY * 1.0;

    // Gentle particle galaxy rotation
    particleField.rotation.y = elapsedTime * 0.08;
    particleField.rotation.x = elapsedTime * 0.04;

    renderer.render(scene, camera);
  }

  animate();

  // Cleanup handler if needed
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationFrameId);
  });
})();
