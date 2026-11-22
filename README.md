# For Shreeya — Birthday Experience (26 November 2026)

A handcrafted, interactive birthday website featuring dynamic celestial animations, audio orchestration, revealable photo cards, and animated illustration choreography.

---

## 📁 Project Structure

```text
├── art/                        # Vector illustration assets
│   ├── birthday-cake.svg
│   ├── good-day.svg
│   ├── good-food.svg
│   └── memories.svg
├── css/
│   └── style.css               # Clean, modular, responsive styling & animations
├── js/
│   └── main.js                 # Application logic, audio choreography & motion math
├── music/
│   ├── birthday-background.mp3 # Atmospheric background instrumental
│   └── o-mere-dil-ke-chain.mp3 # Birthday melody for the secret letter
├── photos/
│   ├── shreeya-1.webp          # Postcard photo
│   ├── shreeya-2.webp          # Wish 01 photo
│   ├── shreeya-3.webp          # Wish 02 photo
│   └── shreeya-4.webp          # Wish 03 photo
├── index.html                  # Accessible, semantic HTML5 structure
├── README.md                   # Project documentation
└── README.txt                  # Original developer notes
```

---

## 🚀 Running Locally

To run the project locally with standard browser audio support:

```bash
# Using Python 3's built-in HTTP server
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000) in any modern web browser.

---

## 🎨 Features & Architecture

1. **Touch-to-Start Audio Unlocking (`js/main.js` & `css/style.css`)**
   - Complies with iOS Safari and Android Chrome autoplay restrictions via a modal gesture.
   - Automatically pauses background music when scrolling into the final delivery section or when viewing the secret letter.
   - Gracefully manages tab switching via the Page Visibility API (`visibilitychange`).

2. **Moon Orbit Animation**
   - Parametric elliptical path computed in real time with `requestAnimationFrame`.
   - Z-index dynamic depth sorting so the ticket orbits behind the moon during the back arc.
   - Full support for `prefers-reduced-motion`.

3. **Interactive Photo Reveal Cards**
   - Dual-layer presentation: blurred atmospheric background + full vertical contained foreground.
   - Hover preview on desktop (`@media (hover: hover)`), tap-to-toggle on mobile (`is-peeked` class) with accessible `aria-pressed` states.

4. **Bear Delivery & Secret Note**
   - Scroll-triggered SVG walking animation with alternating leg and arm strides.
   - Floating heart particle trail generated on arrival.
   - Tap the envelope seal to open the letter and trigger the secret message modal with an audio-reactive dancing mini-bear.
