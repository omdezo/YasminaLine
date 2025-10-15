import gsap from "gsap";
import products from "./products.js";

// DOM Elements
const productsContainer = document.querySelector(".products");
const prevBtn = document.querySelector(".nav-btn.prev");
const nextBtn = document.querySelector(".nav-btn.next");

// State
let currentProductIndex = 0;
let slideItems = [];

const BUFFER_SIZE = 5;
const spacing = 0.375;
const slideWidth = spacing * 1000;

console.log('Slider initializing...', products.length, 'products');

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
    opacity: 1
  });

  productsContainer.appendChild(li);
  slideItems.push({ element: li, relativeIndex: relativeIndex });

  console.log('Added slide:', product.name, 'at index', relativeIndex);
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

function moveNext() {
  console.log('Moving to next product');
  currentProductIndex++;
  removeSlideItem(-BUFFER_SIZE);
  slideItems.forEach((item) => {
    item.relativeIndex--;
    item.element.dataset.relativeIndex = item.relativeIndex;
  });
  addSlideItem(BUFFER_SIZE);
  updateSliderPosition();
}

function movePrev() {
  console.log('Moving to previous product');
  currentProductIndex--;
  removeSlideItem(BUFFER_SIZE);
  slideItems.forEach((item) => {
    item.relativeIndex++;
    item.element.dataset.relativeIndex = item.relativeIndex;
  });
  addSlideItem(-BUFFER_SIZE);
  updateSliderPosition();
}

function initializeSlider() {
  console.log('Initializing slider with', products.length, 'products');
  for (let i = -BUFFER_SIZE; i <= BUFFER_SIZE; i++) {
    addSlideItem(i);
  }
  updateSliderPosition();
  console.log('Slider initialized!');
}

// Event Listeners
prevBtn.addEventListener("click", movePrev);
nextBtn.addEventListener("click", moveNext);

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    if (e.key === 'ArrowRight') {
      moveNext();
    } else {
      movePrev();
    }
  }
});

// Initialize
initializeSlider();

console.log('🎨 Simple Slider Ready!');
