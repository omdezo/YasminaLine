import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class Hero3D {
  constructor() {
    this.canvas = document.getElementById('hero-canvas');
    this.loadingElement = document.querySelector('.model-loading');
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.model = null;
    this.lights = [];

    this.init();
  }

  init() {
    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent background

    // Setup camera
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.5, 4);
    this.camera.lookAt(0, 0, 0);

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Setup controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.minPolarAngle = Math.PI / 4;
    this.controls.maxPolarAngle = Math.PI / 1.5;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1;

    // Setup lights
    this.setupLights();

    // Load model
    this.loadModel();

    // Setup view buttons
    this.setupViewButtons();

    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());

    // Start animation
    this.animate();
  }

  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    this.scene.add(mainLight);

    // Fill light from left
    const fillLight = new THREE.DirectionalLight(0xc9a961, 0.5);
    fillLight.position.set(-5, 5, 3);
    this.scene.add(fillLight);

    // Rim light from back
    const rimLight = new THREE.DirectionalLight(0xe5d4a8, 0.4);
    rimLight.position.set(0, 3, -5);
    this.scene.add(rimLight);

    // Soft bottom light
    const bottomLight = new THREE.HemisphereLight(0xfdfbf7, 0xc9a961, 0.4);
    this.scene.add(bottomLight);
  }

  async loadModel() {
    const loader = new OBJLoader();
    const textureLoader = new THREE.TextureLoader();

    try {
      // Load textures
      const diffuseTexture = await textureLoader.loadAsync('/products/abaya3D/texture_diffuse.png');
      const normalTexture = await textureLoader.loadAsync('/products/abaya3D/texture_normal.png');
      const roughnessTexture = await textureLoader.loadAsync('/products/abaya3D/texture_roughness.png');
      const metallicTexture = await textureLoader.loadAsync('/products/abaya3D/texture_metallic.png');

      diffuseTexture.colorSpace = THREE.SRGBColorSpace;

      // Load OBJ model
      const obj = await loader.loadAsync('/products/abaya3D/base.obj');

      // Create material with textures
      const material = new THREE.MeshStandardMaterial({
        map: diffuseTexture,
        normalMap: normalTexture,
        roughnessMap: roughnessTexture,
        metalnessMap: metallicTexture,
        metalness: 0.3,
        roughness: 0.7,
        side: THREE.DoubleSide
      });

      // Apply material to all meshes
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Center and scale the model
      const box = new THREE.Box3().setFromObject(obj);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.5 / maxDim;
      obj.scale.multiplyScalar(scale);

      obj.position.x = -center.x * scale;
      obj.position.y = -center.y * scale;
      obj.position.z = -center.z * scale;

      this.model = obj;
      this.scene.add(obj);

      // Hide loading
      this.loadingElement.classList.add('hidden');

      console.log('3D Model loaded successfully!');
    } catch (error) {
      console.error('Error loading 3D model:', error);
      this.loadingElement.querySelector('span').textContent = 'خطأ في التحميل';
    }
  }

  setupViewButtons() {
    const buttons = document.querySelectorAll('.view-btn');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const view = button.dataset.view;
        this.changeView(view);
      });
    });
  }

  changeView(view) {
    const positions = {
      front: { x: 0, y: 1.5, z: 4 },
      side: { x: 4, y: 1.5, z: 0 },
      back: { x: 0, y: 1.5, z: -4 }
    };

    const targetPos = positions[view];

    // Animate camera position
    const startPos = this.camera.position.clone();
    const duration = 1000;
    const startTime = Date.now();

    const animateCamera = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      this.camera.position.x = startPos.x + (targetPos.x - startPos.x) * easeProgress;
      this.camera.position.y = startPos.y + (targetPos.y - startPos.y) * easeProgress;
      this.camera.position.z = startPos.z + (targetPos.z - startPos.z) * easeProgress;

      this.camera.lookAt(0, 0, 0);

      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };

    animateCamera();
  }

  onWindowResize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Update controls
    this.controls.update();

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Hero3D();
  });
} else {
  new Hero3D();
}

console.log('🎨 Hero 3D Module Loaded!');
