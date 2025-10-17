import gsap from "gsap";
import products from "./products.js";

// ========== DOM ELEMENTS ==========
const productsContainer = document.querySelector(".products");
const productName = document.querySelector(".product-name p");
const productPreview = document.querySelector(".product-preview");
const previewName = document.querySelector(".product-preview-name p");
const previewImg = document.querySelector(".product-preview-img img");
const previewTag = document.querySelector(".product-preview-tag p");
const previewUrl = document.querySelector(".product-url .btn a");
const productBanner = document.querySelector(".product-banner");
const bannerImg = document.querySelector(".product-banner img");
const controllerInner = document.querySelector(".controller-inner");
const controllerOuter = document.querySelector(".controller-outer");
const closeIconSpans = document.querySelectorAll(".close-icon span");
const prevBtn = document.querySelector(".nav-btn.prev");
const nextBtn = document.querySelector(".nav-btn.next");

// New elements
const particlesContainer = document.querySelector(".particles-container");
const wishlistCounter = document.querySelector(".wishlist-counter");
const wishlistCount = document.querySelector(".wishlist-count");
const wishlistBtn = document.querySelector(".wishlist-btn");
const progressBar = document.querySelector(".progress-bar");
const currentIndexEl = document.querySelector(".current-index");
const totalItemsEl = document.querySelector(".total-items");
const priceValue = document.querySelector(".price-value");
const ratingValue = document.querySelector(".rating-value");
const starsContainer = document.querySelector(".stars");
const productBadge = document.querySelector(".product-badge");

// ========== STATE ==========
let currentProductIndex = 0;
let slideItems = [];
let isPreviewAnimating = false;
let isPreviewOpen = false;
let wishlist = new Set();
let touchStartX = 0;
let touchEndX = 0;

const BUFFER_SIZE = 5;
const spacing = 0.375;
const slideWidth = spacing * 1000;

function addSlideItem(relativeIndex) {
  const productIndex =
    (((currentProductIndex + relativeIndex) % products.length) +
      products.length) %
    products.length;
  const product = products[productIndex];

  const li = document.createElement("li");
  li.innerHTML = `<img src="${product.img}" alt="${product.name}" />`;
  li.dataset.relativeIndex = relativeIndex;

  gsap.set(li, {
    x: relativeIndex * slideWidth,
    scale: relativeIndex === 0 ? 1.25 : 0.75,
    zIndex: relativeIndex === 0 ? 100 : 1,
  });

  productsContainer.appendChild(li);
  slideItems.push({ element: li, relativeIndex: relativeIndex });
}

function removeSlideItem(relativeIndex) {
  const itemIndex = slideItems.findIndex(
    (item) => item.relativeIndex === relativeIndex
  );
  if (itemIndex !== -1) {
    const item = slideItems[itemIndex];
    item.element.remove();
    slideItems.splice(itemIndex, 1);
  }
}

function updateSliderPosition() {
  slideItems.forEach((item) => {
    const isActive = item.relativeIndex === 0;
    gsap.to(item.element, {
      x: item.relativeIndex * slideWidth,
      scale: isActive ? 1.25 : 0.75,
      zIndex: isActive ? 100 : 1,
      duration: 0.75,
      ease: "power3.out",
    });
  });
}

function updateProductName() {
  const actualIndex =
    ((currentProductIndex % products.length) + products.length) %
    products.length;
  productName.textContent = products[actualIndex].name;
}

function updatePreviewContent() {
  const actualIndex =
    ((currentProductIndex % products.length) + products.length) %
    products.length;
  const currentProduct = products[actualIndex];

  previewName.textContent = currentProduct.name;
  previewImg.src = currentProduct.img;
  previewImg.alt = currentProduct.name;
  previewTag.textContent = currentProduct.tag;
  previewUrl.href = currentProduct.url;
  bannerImg.src = currentProduct.img;
  bannerImg.alt = currentProduct.name;

  // Update new elements
  animatePrice(currentProduct.price);
  updateRating(currentProduct.rating);
  updateBadge(currentProduct.badge);
  updateWishlistButton(actualIndex);
  updateProgressIndicator();
}

// ========== NEW FEATURES ==========

// Animated Price Counter
function animatePrice(targetPrice) {
  const currentPrice = parseInt(priceValue.textContent) || 0;
  gsap.to({ value: currentPrice }, {
    value: targetPrice,
    duration: 0.8,
    ease: "power2.out",
    onUpdate: function() {
      priceValue.textContent = Math.round(this.targets()[0].value);
    }
  });
}

// Update Rating Stars
function updateRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  starsContainer.innerHTML = '';

  for (let i = 0; i < fullStars; i++) {
    starsContainer.innerHTML += '<ion-icon name="star"></ion-icon>';
  }

  if (hasHalfStar) {
    starsContainer.innerHTML += '<ion-icon name="star-half"></ion-icon>';
  }

  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    starsContainer.innerHTML += '<ion-icon name="star-outline"></ion-icon>';
  }

  ratingValue.textContent = rating.toFixed(1);
}

// Update Badge
function updateBadge(badge) {
  if (badge) {
    productBadge.textContent = badge;
    productBadge.style.display = 'inline-block';
  } else {
    productBadge.style.display = 'none';
  }
}

// Update Progress Indicator
function updateProgressIndicator() {
  const actualIndex = ((currentProductIndex % products.length) + products.length) % products.length;
  const progress = ((actualIndex + 1) / products.length) * 100;

  currentIndexEl.textContent = actualIndex + 1;
  totalItemsEl.textContent = products.length;

  // Animate the progress bar width
  const progressBarFill = document.createElement('style');
  progressBarFill.innerHTML = `.progress-bar::after { width: ${progress}% !important; }`;

  // Remove old style if exists
  const oldStyle = document.querySelector('#progress-style');
  if (oldStyle) oldStyle.remove();

  progressBarFill.id = 'progress-style';
  document.head.appendChild(progressBarFill);
}

// Wishlist Functionality
function updateWishlistButton(productIndex) {
  if (wishlist.has(productIndex)) {
    wishlistBtn.classList.add('active');
    wishlistBtn.querySelector('ion-icon').setAttribute('name', 'heart');
  } else {
    wishlistBtn.classList.remove('active');
    wishlistBtn.querySelector('ion-icon').setAttribute('name', 'heart-outline');
  }
}

function toggleWishlist() {
  const actualIndex = ((currentProductIndex % products.length) + products.length) % products.length;

  if (wishlist.has(actualIndex)) {
    wishlist.delete(actualIndex);
  } else {
    wishlist.add(actualIndex);
  }

  updateWishlistButton(actualIndex);
  wishlistCount.textContent = wishlist.size;

  // Animate button
  wishlistBtn.classList.add('animating');
  wishlistCounter.classList.add('pulse');

  setTimeout(() => {
    wishlistBtn.classList.remove('animating');
    wishlistCounter.classList.remove('pulse');
  }, 600);
}

// Particle System
function createParticle() {
  const particle = document.createElement('div');
  particle.className = 'particle';

  const size = Math.random() * 8 + 2;
  const startX = Math.random() * window.innerWidth;
  const duration = Math.random() * 15 + 10;
  const delay = Math.random() * 5;

  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${startX}px`;
  particle.style.animationDuration = `${duration}s`;
  particle.style.animationDelay = `${delay}s`;

  particlesContainer.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, (duration + delay) * 1000);
}

function initParticles() {
  for (let i = 0; i < 20; i++) {
    createParticle();
  }

  setInterval(() => {
    createParticle();
  }, 2000);
}

// Parallax Mouse Effect
let mouseX = 0;
let mouseY = 0;

function handleMouseMove(e) {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

  slideItems.forEach((item) => {
    if (item.relativeIndex === 0) {
      const depth = 20;
      gsap.to(item.element, {
        x: item.relativeIndex * slideWidth + mouseX * depth,
        y: mouseY * depth,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  });
}

// Keyboard Navigation
function handleKeyPress(e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    if (e.key === 'ArrowRight') {
      moveNext();
    } else {
      movePrev();
    }
  }
}

// Touch Swipe Gestures
function handleTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next
      moveNext();
    } else {
      // Swipe right - prev
      movePrev();
    }
  }
}

function moveNext() {
  if (isPreviewAnimating || isPreviewOpen) return;

  currentProductIndex++;
  removeSlideItem(-BUFFER_SIZE);
  slideItems.forEach((item) => {
    item.relativeIndex--;
    item.element.dataset.relativeIndex = item.relativeIndex;
  });
  addSlideItem(BUFFER_SIZE);
  updateSliderPosition();
  updateProductName();
  updatePreviewContent();
}

function movePrev() {
  if (isPreviewAnimating || isPreviewOpen) return;

  currentProductIndex--;
  removeSlideItem(BUFFER_SIZE);
  slideItems.forEach((item) => {
    item.relativeIndex++;
    item.element.dataset.relativeIndex = item.relativeIndex;
  });
  addSlideItem(-BUFFER_SIZE);
  updateSliderPosition();
  updateProductName();
  updatePreviewContent();
}

function updateButtonStates() {
  if (isPreviewAnimating || isPreviewOpen) {
    prevBtn.classList.add("disabled");
    nextBtn.classList.add("disabled");
  } else {
    prevBtn.classList.remove("disabled");
    nextBtn.classList.remove("disabled");
  }
}

function getActiveSlide() {
  return slideItems.find((item) => item.relativeIndex === 0);
}

function animateSideItems(hide = false) {
  const activeSlide = getActiveSlide();

  slideItems.forEach((item) => {
    const absIndex = Math.abs(item.relativeIndex);
    if (absIndex === 1 || absIndex === 2) {
      gsap.to(item.element, {
        x: hide
          ? item.relativeIndex * slideWidth * 1.5
          : item.relativeIndex * slideWidth,
        opacity: hide ? 0 : 1,
        duration: 0.75,
        ease: "power3.inOut",
      });
    }
  });

  if (activeSlide) {
    gsap.to(activeSlide.element, {
      scale: hide ? 0.75 : 1.25,
      opacity: hide ? 0 : 1,
      duration: 0.75,
      ease: "power3.inOut",
    });
  }
}

function animateControllerTransition(opening = false) {
  const navEls = [".controller-label p", ".nav-btn"];

  gsap.to(navEls, {
    opacity: opening ? 0 : 1,
    duration: 0.2,
    ease: "power3.out",
    delay: opening ? 0 : 0.4,
  });

  gsap.to(controllerOuter, {
    clipPath: opening ? "circle(0% at 50% 50%)" : "circle(50% at 50% 50%)",
    duration: 0.75,
    ease: "power3.inOut",
  });

  gsap.to(controllerInner, {
    clipPath: opening ? "circle(50% at 50% 50%)" : "circle(40% at 50% 50%)",
    duration: 0.75,
    ease: "power3.inOut",
  });

  gsap.to(closeIconSpans, {
    width: opening ? "20px" : "0px",
    duration: opening ? 0.4 : 0.3,
    ease: opening ? "power3.out" : "power3.in",
    stagger: opening ? 0.1 : 0.05,
    delay: opening ? 0.2 : 0,
  });
}

function togglePreview() {
  if (isPreviewAnimating) return;

  isPreviewAnimating = true;
  updateButtonStates();

  if (!isPreviewOpen) updatePreviewContent();

  gsap.to(productPreview, {
    y: isPreviewOpen ? "100%" : "-50%",
    duration: 0.75,
    ease: "power3.inOut",
  });
  gsap.to(productBanner, {
    opacity: isPreviewOpen ? 0 : 1,
    duration: 0.4,
    delay: isPreviewOpen ? 0 : 0.25,
    ease: "power3.inOut",
  });

  animateSideItems(!isPreviewOpen);
  animateControllerTransition(!isPreviewOpen);

  setTimeout(() => {
    isPreviewAnimating = false;
    isPreviewOpen = !isPreviewOpen;
    updateButtonStates();
  }, 600);
}

function initializeSlider() {
  for (let i = -BUFFER_SIZE; i <= BUFFER_SIZE; i++) {
    addSlideItem(i);
  }
  updateSliderPosition();
  updateProductName();
  updatePreviewContent();
  updateButtonStates();

  // Initialize new features
  initParticles();
  updateProgressIndicator();
}

// ========== EVENT LISTENERS ==========

// Original listeners
prevBtn.addEventListener("click", movePrev);
nextBtn.addEventListener("click", moveNext);
controllerInner.addEventListener("click", togglePreview);

// New feature listeners
wishlistBtn.addEventListener("click", toggleWishlist);
document.addEventListener("keydown", handleKeyPress);
document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchend", handleTouchEnd);

// Wishlist counter click - could show wishlist modal in future
wishlistCounter.addEventListener("click", () => {
  if (wishlist.size > 0) {
    console.log("Wishlist items:", Array.from(wishlist).map(i => products[i].name));
    // Future: Open wishlist modal
  }
});

// Initialize
initializeSlider();

// ========== NEW SECTIONS FUNCTIONALITY ==========

// Testimonials Slider
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialDots = document.querySelectorAll('.testimonials-dots .dot');
const testimonialPrevBtn = document.querySelector('.testimonial-prev');
const testimonialNextBtn = document.querySelector('.testimonial-next');

function showTestimonial(index) {
  testimonialCards.forEach((card, i) => {
    card.classList.remove('active');
    if (i === index) {
      card.classList.add('active');
    }
  });

  testimonialDots.forEach((dot, i) => {
    dot.classList.remove('active');
    if (i === index) {
      dot.classList.add('active');
    }
  });
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
  showTestimonial(currentTestimonial);
}

function prevTestimonial() {
  currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
  showTestimonial(currentTestimonial);
}

if (testimonialNextBtn) {
  testimonialNextBtn.addEventListener('click', nextTestimonial);
}

if (testimonialPrevBtn) {
  testimonialPrevBtn.addEventListener('click', prevTestimonial);
}

if (testimonialDots) {
  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentTestimonial = index;
      showTestimonial(currentTestimonial);
    });
  });
}

// Auto-advance testimonials
setInterval(nextTestimonial, 5000);

// Stats Counter Animation
const statCounts = document.querySelectorAll('.stat-count');
let hasAnimated = false;

function animateStats() {
  if (hasAnimated) return;

  statCounts.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCount = () => {
      current += increment;
      if (current < target) {
        stat.textContent = Math.floor(current);
        requestAnimationFrame(updateCount);
      } else {
        stat.textContent = target;
      }
    };

    updateCount();
  });

  hasAnimated = true;
}

// Observer for stats section
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
      }
    });
  }, { threshold: 0.5 });

  statsObserver.observe(statsSection);
}

// Modal Functionality
const modal = document.getElementById('quickViewModal');
const modalClose = document.querySelector('.modal-close');
const productPreviewImg = document.querySelector('.product-preview-img');

function openModal() {
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (productPreviewImg) {
  productPreviewImg.addEventListener('click', openModal);
}

if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Size selection in modal
const sizeBtns = document.querySelectorAll('.size-btn');
sizeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    sizeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Cart Drawer Functionality
const cartDrawer = document.getElementById('cartDrawer');
const cartBtn = document.querySelector('.cart-btn');
const cartCloseBtn = document.querySelector('.cart-close');

function openCart() {
  if (cartDrawer) {
    cartDrawer.classList.add('active');
  }
}

function closeCart() {
  if (cartDrawer) {
    cartDrawer.classList.remove('active');
  }
}

if (cartBtn) {
  cartBtn.addEventListener('click', openCart);
}

if (cartCloseBtn) {
  cartCloseBtn.addEventListener('click', closeCart);
}

// Add to cart functionality
const addToCartBtn = document.querySelector('.add-to-cart-btn');
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', () => {
    // Add animation
    addToCartBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      addToCartBtn.style.transform = '';
    }, 200);

    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      const currentCount = parseInt(cartCount.textContent) || 0;
      cartCount.textContent = currentCount + 1;
    }

    // Close modal and show success
    setTimeout(() => {
      closeModal();
      openCart();
    }, 300);
  });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offset = 80; // Account for fixed nav
      const targetPosition = targetElement.offsetTop - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;

    // Simulate success
    const subscribeBtn = newsletterForm.querySelector('.subscribe-btn');
    const originalHTML = subscribeBtn.innerHTML;
    subscribeBtn.innerHTML = '<ion-icon name="checkmark-circle"></ion-icon><span>تم الاشتراك!</span>';
    subscribeBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';

    setTimeout(() => {
      subscribeBtn.innerHTML = originalHTML;
      subscribeBtn.style.background = '';
      newsletterForm.reset();
    }, 3000);
  });
}

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

function closeMobileMenu() {
  if (navMenu && menuToggle) {
    navMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';

    const spans = menuToggle.querySelectorAll('span');
    spans.forEach(span => {
      span.style.transform = '';
      span.style.opacity = '';
    });
  }
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');

    // Toggle body scroll
    if (menuToggle.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Animate hamburger
    const spans = menuToggle.querySelectorAll('span');
    if (menuToggle.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translateY(10px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
      spans.forEach(span => {
        span.style.transform = '';
        span.style.opacity = '';
      });
    }
  });

  // Close menu when clicking on nav links
  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

// Scroll reveal animations
const revealElements = document.querySelectorAll('.feature-card, .collection-card, .section-header');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});

// Navbar scroll effect
const mainNav = document.querySelector('.main-nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    mainNav.style.boxShadow = '0 2px 20px rgba(92, 15, 21, 0.05)';
  } else {
    mainNav.style.boxShadow = '0 5px 30px rgba(92, 15, 21, 0.15)';
  }

  lastScroll = currentScroll;
});

// Scroll indicator
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

console.log('🎨 Yasmina Line - UI Enhanced & Ready!');

// ========== MOBILE OPTIMIZATIONS ==========

// Fix for 100vh on mobile browsers (address bar issue)
function setVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);

// Prevent zoom on input focus (additional safeguard)
document.addEventListener('touchstart', function() {}, {passive: true});

// Disable pull-to-refresh on certain elements
const preventPullToRefresh = (element) => {
  let touchStartY = 0;
  element.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, {passive: true});

  element.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchDiff = touchY - touchStartY;

    if (element.scrollTop === 0 && touchDiff > 0) {
      e.preventDefault();
    }
  }, {passive: false});
};

const scrollableElements = document.querySelectorAll('.nav-menu, .contact-form, .about-section');
scrollableElements.forEach(el => preventPullToRefresh(el));

// Optimize scroll performance on mobile
let ticking = false;
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      // Your scroll-based updates here
      ticking = false;
    });
    ticking = true;
  }
}, {passive: true});

// ========== LUXURY PREMIUM FEATURES ==========

// Scroll Progress Bar
const scrollProgressBar = document.querySelector('.scroll-progress-bar');

window.addEventListener('scroll', () => {
  const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  scrollProgressBar.style.width = `${scrolled}%`;
});

// Magnetic Button Effect
const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .subscribe-btn, .add-to-cart-btn');

magneticBtns.forEach(btn => {
  btn.classList.add('magnetic-btn');

  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.4,
      ease: 'power2.out'
    });
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    });
  });
});

// 3D Tilt Effect for Cards
const tiltCards = document.querySelectorAll('.feature-card, .collection-card, .testimonial-card');

tiltCards.forEach(card => {
  card.classList.add('tilt-card');

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    gsap.to(card, {
      rotationX: rotateX,
      rotationY: rotateY,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.6,
      ease: 'power3.out'
    });
  });
});

// Parallax Effect on Hero Section
const heroImage = document.querySelector('.hero-image-wrapper');
if (heroImage) {
  heroImage.classList.add('parallax-layer');

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    gsap.to(heroImage, {
      y: scrolled * parallaxSpeed,
      duration: 0.5,
      ease: 'power1.out'
    });
  });
}

// Stagger Animation for Hero Stats
const heroStats = document.querySelectorAll('.stat-item');
if (heroStats.length > 0) {
  gsap.from(heroStats, {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
    delay: 1
  });
}

// Text Reveal Animation
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const text = heroTitle.textContent;
  heroTitle.innerHTML = '';

  text.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${index * 0.05}s`;
    heroTitle.appendChild(span);
  });

  heroTitle.classList.add('text-reveal');
}

// Floating Animation for Badges
const floatingBadges = document.querySelectorAll('.floating-badge');
floatingBadges.forEach(badge => {
  badge.classList.add('float-element');
});

// Premium Shimmer Effect on Hover
const shimmerElements = document.querySelectorAll('.collection-card, .product-preview-img');
shimmerElements.forEach(el => {
  el.classList.add('shimmer-effect');
});

// Add Luxury Glow to Premium Buttons
const luxuryButtons = document.querySelectorAll('.btn-primary, .add-to-cart-btn, .checkout-btn');
luxuryButtons.forEach(btn => {
  btn.classList.add('luxury-glow');
});

// Intersection Observer for Advanced Animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const element = entry.target;

      // Stagger children if they exist
      const children = element.querySelectorAll('.feature-card, .collection-card, .stat-box');

      if (children.length > 0) {
        gsap.from(children, {
          y: 80,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out'
        });
      } else {
        gsap.from(element, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      }

      animateOnScroll.unobserve(element);
    }
  });
}, observerOptions);

// Observe sections
const sectionsToAnimate = document.querySelectorAll('.features-section, .collections-section, .stats-section, .newsletter-section');
sectionsToAnimate.forEach(section => {
  animateOnScroll.observe(section);
});

// Enhanced Product Preview with Scale Animation
const productPreviewCard = document.querySelector('.product-preview');
if (productPreviewCard) {
  gsap.from(productPreviewCard, {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.7)',
    delay: 1.5,
    scrollTrigger: {
      trigger: productPreviewCard,
      start: 'top 80%'
    }
  });
}

// Gradient Border Animation for Premium Cards
const premiumCards = document.querySelectorAll('.product-preview, .testimonial-card');
premiumCards.forEach(card => {
  card.classList.add('gradient-border');
});

// Smooth Section Transitions
const sections = document.querySelectorAll('section');
sections.forEach((section, index) => {
  section.style.animationDelay = `${index * 0.1}s`;
});

// Add Glass Effect to Navigation on Scroll
const mainNav = document.querySelector('.main-nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    mainNav.style.background = 'rgba(253, 251, 247, 0.5)';
    mainNav.style.backdropFilter = 'blur(40px) saturate(200%)';
  } else {
    mainNav.style.background = 'rgba(253, 251, 247, 0.7)';
    mainNav.style.backdropFilter = 'blur(30px) saturate(180%)';
  }
});

// Premium Hover Effect for Product Images
const productImages = document.querySelectorAll('.products li img');
productImages.forEach(img => {
  img.addEventListener('mouseenter', function() {
    gsap.to(this, {
      scale: 1.15,
      rotation: 2,
      duration: 0.4,
      ease: 'power2.out'
    });
  });

  img.addEventListener('mouseleave', function() {
    gsap.to(this, {
      scale: 1,
      rotation: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  });
});

// Cinematic Fade-in for Hero Section
gsap.from('.hero-section', {
  opacity: 0,
  duration: 1.5,
  ease: 'power2.out',
  delay: 2.5
});

console.log('✨ Premium Luxury Features Activated!');
