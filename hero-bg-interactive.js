// Elegant Flowing Fabric Background Effect - Enhanced
class HeroBackground {
  constructor() {
    this.canvas = document.getElementById('hero-bg-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.mouse = { x: 0, y: 0, isActive: false };
    this.waves = [];
    this.floatingOrbs = [];
    this.lightRays = [];
    this.time = 0;

    this.init();
  }

  init() {
    this.resizeCanvas();
    this.createWaves();
    this.createFloatingOrbs();
    this.createLightRays();
    this.setupEventListeners();
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  createWaves() {
    this.waves = [
      {
        amplitude: 40,
        frequency: 0.002,
        speed: 0.015,
        offset: 0,
        color1: 'rgba(201, 169, 97, 0.06)',
        color2: 'rgba(201, 169, 97, 0.01)',
        yPosition: 0.25
      },
      {
        amplitude: 60,
        frequency: 0.0015,
        speed: 0.01,
        offset: Math.PI,
        color1: 'rgba(155, 127, 61, 0.08)',
        color2: 'rgba(155, 127, 61, 0.01)',
        yPosition: 0.45
      },
      {
        amplitude: 35,
        frequency: 0.0025,
        speed: 0.02,
        offset: Math.PI / 2,
        color1: 'rgba(229, 212, 168, 0.05)',
        color2: 'rgba(229, 212, 168, 0.01)',
        yPosition: 0.65
      },
      {
        amplitude: 50,
        frequency: 0.003,
        speed: 0.012,
        offset: Math.PI * 1.5,
        color1: 'rgba(201, 169, 97, 0.04)',
        color2: 'rgba(201, 169, 97, 0)',
        yPosition: 0.85
      }
    ];
  }

  createShimmer() {
    this.shimmerParticles = [];
    const count = 25;
    for (let i = 0; i < count; i++) {
      this.shimmerParticles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }

  createFloatingOrbs() {
    this.floatingOrbs = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      this.floatingOrbs.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 60 + 40,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.03 + 0.01,
        pulseSpeed: Math.random() * 0.01 + 0.005
      });
    }
  }

  createLightRays() {
    this.lightRays = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      this.lightRays.push({
        x: Math.random() * this.canvas.width,
        y: -100,
        width: Math.random() * 100 + 50,
        height: Math.random() * 300 + 200,
        angle: Math.random() * 30 - 15,
        speed: Math.random() * 0.1 + 0.05,
        opacity: Math.random() * 0.02 + 0.01
      });
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createWaves();
      this.createFloatingOrbs();
      this.createLightRays();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.isActive = true;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.isActive = false;
    });
  }

  drawLightRays() {
    for (let ray of this.lightRays) {
      this.ctx.save();
      this.ctx.translate(ray.x, ray.y);
      this.ctx.rotate((ray.angle * Math.PI) / 180);

      const gradient = this.ctx.createLinearGradient(0, 0, 0, ray.height);
      gradient.addColorStop(0, `rgba(229, 212, 168, ${ray.opacity})`);
      gradient.addColorStop(0.5, `rgba(201, 169, 97, ${ray.opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(201, 169, 97, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(-ray.width / 2, 0, ray.width, ray.height);

      this.ctx.restore();

      // Update position
      ray.y += ray.speed;
      if (ray.y > this.canvas.height + 100) {
        ray.y = -ray.height;
        ray.x = Math.random() * this.canvas.width;
      }
    }
  }

  drawFloatingOrbs() {
    for (let orb of this.floatingOrbs) {
      const pulseOpacity = Math.sin(this.time * orb.pulseSpeed) * 0.02 + orb.opacity;

      const gradient = this.ctx.createRadialGradient(
        orb.x, orb.y, 0,
        orb.x, orb.y, orb.radius
      );
      gradient.addColorStop(0, `rgba(229, 212, 168, ${pulseOpacity * 1.5})`);
      gradient.addColorStop(0.4, `rgba(201, 169, 97, ${pulseOpacity})`);
      gradient.addColorStop(1, 'rgba(201, 169, 97, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Update position
      orb.x += orb.speedX;
      orb.y += orb.speedY;

      // Wrap around edges
      if (orb.x < -orb.radius) orb.x = this.canvas.width + orb.radius;
      if (orb.x > this.canvas.width + orb.radius) orb.x = -orb.radius;
      if (orb.y < -orb.radius) orb.y = this.canvas.height + orb.radius;
      if (orb.y > this.canvas.height + orb.radius) orb.y = -orb.radius;
    }
  }

  drawWave(wave) {
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height);

    const baseY = this.canvas.height * wave.yPosition;

    for (let x = 0; x <= this.canvas.width; x += 4) {
      let y = baseY + Math.sin(x * wave.frequency + wave.offset) * wave.amplitude;

      // Secondary wave for more organic movement
      y += Math.sin(x * wave.frequency * 1.5 + wave.offset * 0.7) * (wave.amplitude * 0.3);

      // Mouse influence
      if (this.mouse.isActive) {
        const dx = x - this.mouse.x;
        const dy = y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 250) {
          const influence = (1 - distance / 250) * 40;
          y += influence * Math.sin(this.time * 0.05);
        }
      }

      this.ctx.lineTo(x, y);
    }

    this.ctx.lineTo(this.canvas.width, this.canvas.height);
    this.ctx.closePath();

    // Enhanced gradient fill
    const gradient = this.ctx.createLinearGradient(0, baseY - wave.amplitude, 0, this.canvas.height);
    gradient.addColorStop(0, wave.color1);
    gradient.addColorStop(0.6, wave.color2);
    gradient.addColorStop(1, 'rgba(201, 169, 97, 0)');

    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    wave.offset += wave.speed;
  }

  drawShimmer() {
    for (let particle of this.shimmerParticles) {
      // Update pulse with twinkle effect
      particle.twinkle += particle.pulseSpeed;
      particle.opacity = Math.abs(Math.sin(particle.twinkle)) * 0.6 + 0.2;

      // Mouse glow effect
      let glowBoost = 0;
      let sizeBoost = 1;
      if (this.mouse.isActive) {
        const dx = particle.x - this.mouse.x;
        const dy = particle.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 180) {
          glowBoost = (1 - distance / 180) * 0.5;
          sizeBoost = 1 + (1 - distance / 180) * 0.8;
        }
      }

      const finalOpacity = Math.min(particle.opacity + glowBoost, 1);
      const finalSize = particle.size * sizeBoost;

      // Draw shimmer particle with enhanced glow
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, finalSize * 5
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity * 0.8})`);
      gradient.addColorStop(0.2, `rgba(229, 212, 168, ${finalOpacity * 0.6})`);
      gradient.addColorStop(0.5, `rgba(201, 169, 97, ${finalOpacity * 0.3})`);
      gradient.addColorStop(1, 'rgba(201, 169, 97, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, finalSize * 5, 0, Math.PI * 2);
      this.ctx.fill();

      // Add star sparkle effect for brightest particles
      if (finalOpacity > 0.7) {
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${finalOpacity * 0.3})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(particle.x - finalSize * 2, particle.y);
        this.ctx.lineTo(particle.x + finalSize * 2, particle.y);
        this.ctx.moveTo(particle.x, particle.y - finalSize * 2);
        this.ctx.lineTo(particle.x, particle.y + finalSize * 2);
        this.ctx.stroke();
      }

      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
    }
  }

  drawMouseGlow() {
    if (!this.mouse.isActive) return;

    // Main glow
    const gradient = this.ctx.createRadialGradient(
      this.mouse.x, this.mouse.y, 0,
      this.mouse.x, this.mouse.y, 200
    );
    gradient.addColorStop(0, 'rgba(229, 212, 168, 0.12)');
    gradient.addColorStop(0.3, 'rgba(201, 169, 97, 0.06)');
    gradient.addColorStop(0.6, 'rgba(201, 169, 97, 0.02)');
    gradient.addColorStop(1, 'rgba(201, 169, 97, 0)');

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(this.mouse.x, this.mouse.y, 200, 0, Math.PI * 2);
    this.ctx.fill();

    // Pulsing ring effect
    const pulseRadius = 80 + Math.sin(this.time * 0.05) * 15;
    this.ctx.strokeStyle = `rgba(201, 169, 97, ${0.15 + Math.sin(this.time * 0.05) * 0.05})`;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.mouse.x, this.mouse.y, pulseRadius, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw light rays (subtle depth)
    this.drawLightRays();

    // Draw floating orbs (ambient glow)
    this.drawFloatingOrbs();

    // Draw flowing waves
    for (let wave of this.waves) {
      this.drawWave(wave);
    }

    // Draw mouse glow
    this.drawMouseGlow();

    this.time += 1;

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new HeroBackground();
  });
} else {
  new HeroBackground();
}

console.log('🎨 Interactive Hero Background Loaded!');
