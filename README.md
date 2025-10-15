# YASMINA LINE - Luxury Abaya E-Commerce Website

## 🎨 Overview
A premium, modern e-commerce website for luxury abayas featuring:
- **Interactive 3D Model** in hero section
- **Smooth Product Slider** with GSAP animations
- **Fully Responsive** design
- **Arabic RTL** layout
- **Premium UI/UX** with luxury aesthetics

## ✨ Features

### 🎭 Hero Section (3D Interactive)
- Real-time 3D model rendering using Three.js
- Interactive rotation with mouse/touch controls
- Multiple view angles (Front, Side, Back)
- Auto-rotation mode
- PBR materials with realistic textures
- Smooth camera transitions
- Loading indicator

### 🎪 Products Slider
- 10 unique abaya designs
- GSAP-powered smooth animations
- Keyboard navigation (Arrow keys)
- Infinite loop carousel
- Scale transitions on active product
- Drop shadow effects

### 📱 Sections
1. **Navigation** - Fixed glassmorphism navbar
2. **Hero** - 3D interactive model showcase
3. **Products** - Animated carousel slider
4. **Features** - 4 key features grid
5. **About** - Company story and stats
6. **Contact** - Contact form with info
7. **Footer** - Links and social media

## 🛠 Technologies Used
- **Three.js** - 3D model rendering
- **GSAP** - Animation library
- **Vite** - Build tool and dev server
- **Vanilla JavaScript** - ES6 modules
- **CSS3** - Advanced animations and effects
- **Ionicons** - Icon library

## 📁 Project Structure
```
codegrid-damso-product-slider/
├── public/
│   └── products/
│       ├── abaya3D/          # 3D model and textures
│       │   ├── base.obj
│       │   ├── texture_diffuse.png
│       │   ├── texture_normal.png
│       │   ├── texture_roughness.png
│       │   └── texture_metallic.png
│       └── abaya5/           # 2D product images
│           ├── 1.png
│           ├── 2.png
│           ├── 3.png
│           ├── 4.png
│           └── 5.png
├── index.html               # Main HTML file
├── styles.css               # All styling (~3000 lines)
├── hero-3d.js              # 3D hero functionality
├── simple-slider.js        # Product slider
├── products.js             # Product data
└── package.json            # Dependencies

```

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🎨 Design Features

### Color Palette
- **Base**: #FDFBF7, #F5F1EB (Cream tones)
- **Accent**: #5C0F15, #6B1119 (Deep burgundy)
- **Gold**: #C9A961, #E5D4A8, #9B7F3D (Luxury gold)

### Typography
- **Playfair Display** - Headings
- **Bodoni Moda** - Labels and accents
- **Cormorant Garamond** - Body text

### Animations
- Fade in/out effects
- Slide transitions
- Scale transforms
- Floating elements
- Shimmer effects
- Gradient animations
- 3D rotations

## 🎯 3D Model Features
- OBJ format with PBR textures
- Diffuse, Normal, Roughness, and Metallic maps
- Real-time lighting (Ambient, Directional, Rim, Fill)
- Shadow mapping enabled
- Tone mapping for realistic look
- Anti-aliasing for smooth edges
- Auto-rotation with damping
- Responsive canvas sizing

## 📱 Responsive Breakpoints
- **Desktop**: 1400px+ (Full layout)
- **Laptop**: 1024px-1399px (Adjusted grid)
- **Tablet**: 768px-1023px (Single column)
- **Mobile**: <768px (Stacked layout)

## 🎮 User Interactions
- Drag to rotate 3D model
- Click view buttons (Front/Side/Back)
- Navigate slider with arrows or keyboard
- Smooth scroll to sections
- Hover effects on all interactive elements

## 🔧 Configuration

### Slider Settings (simple-slider.js)
```javascript
const BUFFER_SIZE = 5;        // Products buffered on each side
const spacing = 0.375;        // Spacing between products
const slideWidth = spacing * 1000;
```

### 3D Camera Settings (hero-3d.js)
```javascript
FOV: 45°
Position: (0, 1.5, 4)
Auto-rotate speed: 1
Damping factor: 0.05
```

## 📊 Performance
- Optimized 3D rendering (60 FPS)
- Lazy loading for textures
- Efficient GSAP animations
- Minified production build
- Tree-shaking enabled

## 🌐 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Credits
- Design: Custom luxury e-commerce theme
- 3D Model: Abaya 3D mesh with PBR textures
- Icons: Ionicons
- Fonts: Google Fonts

## 📄 License
Private project for YASMINA LINE

---

Built with ❤️ using modern web technologies
