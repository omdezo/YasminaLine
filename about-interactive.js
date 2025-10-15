// Interactive About Section - Card & Background Effects
class AboutInteractive {
  constructor() {
    this.section = document.querySelector('.about-section');
    this.card = document.getElementById('about-card');

    if (!this.section || !this.card) return;

    this.cardShine = this.card.querySelector('.card-shine');
    this.maxRotation = 8; // degrees

    this.init();
  }

  init() {
    // Card interactions
    this.card.addEventListener('mousemove', (e) => this.handleCardMouseMove(e));
    this.card.addEventListener('mouseleave', () => this.handleCardMouseLeave());

    // Background orb follows mouse
    this.section.addEventListener('mousemove', (e) => this.handleBackgroundMouseMove(e));
    this.section.addEventListener('mouseleave', () => this.handleBackgroundMouseLeave());
  }

  handleCardMouseMove(e) {
    const rect = this.card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -this.maxRotation;
    const rotateY = ((x - centerX) / centerX) * this.maxRotation;

    // Apply 3D rotation
    this.card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale3d(1.02, 1.02, 1.02)
    `;

    // Move shine effect
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    this.cardShine.style.background = `
      radial-gradient(
        circle at ${shineX}% ${shineY}%,
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0.1) 30%,
        transparent 60%
      )
    `;
  }

  handleCardMouseLeave() {
    // Reset card rotation smoothly
    this.card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1, 1, 1)
    `;

    // Reset shine
    this.cardShine.style.background = `
      linear-gradient(
        135deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 100%
      )
    `;
  }

  handleBackgroundMouseMove(e) {
    const rect = this.section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Move the background orb to follow mouse
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Update CSS custom properties for smooth animation
    this.section.style.setProperty('--mouse-x', `${xPercent}%`);
    this.section.style.setProperty('--mouse-y', `${yPercent}%`);

    // Move the orb
    const beforeElement = window.getComputedStyle(this.section, '::before');
    this.section.style.setProperty('--orb-x', `${x}px`);
    this.section.style.setProperty('--orb-y', `${y}px`);
  }

  handleBackgroundMouseLeave() {
    // Reset orb to center
    this.section.style.setProperty('--orb-x', '50%');
    this.section.style.setProperty('--orb-y', '50%');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AboutInteractive();
  });
} else {
  new AboutInteractive();
}

console.log('🎨 About Interactive Module Loaded!');
