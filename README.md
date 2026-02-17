# FAB Life Counter

A **Progressive Web App (PWA)** designed for **Flesh and Blood** and other trading card games. Built with a focus on speed, aesthetics, and physical playability.

**🌐 Live Demo:** [https://fab-lifecounter.fly.dev/](https://fab-lifecounter.fly.dev/)

---

## 📱 Progressive Web App (PWA)

This application is a full PWA, meaning it can be installed on your device and used just like a native app.

### How to Install

#### **On iPhone / iPad (iOS)**

1. Open the [Live Demo](https://fab-lifecounter.fly.dev/) in **Safari**.
2. Tap the **Share** button (square with an up arrow).
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add** in the top right corner.

#### **On Android (Chrome)**

1. Open the [Live Demo](https://fab-lifecounter.fly.dev/) in **Chrome**.
2. Tap the **three dots** in the top right corner.
3. Tap **"Install app"** or **"Add to Home screen"**.

#### **On Desktop (Chrome/Edge)**

1. Open the [Live Demo](https://fab-lifecounter.fly.dev/) in your browser.
2. Click the **Install** icon in the address bar (usually on the right side).

---

## ✨ Features

- **Mirrored UI**: Designed for two players sitting across from each other. The top zone is rotated 180° for effortless reading.
- **Visual Delta Indicators**: Shows exactly how much life was gained or lost (e.g., `-5`, `+3`) so players don't have to track changes in their heads.
- **Smart History**: Automatically groups rapid point changes into single events, keeping your game log clean and readable.
- **Dynamic Themes**: Generates vibrant, distinct HSL colors for each player every session to ensure perfect visual contrast.
- **PWA Ready**: Install it to your home screen for a full-screen, native-app experience. Works offline once cached.
- **Screen Wake Lock**: Automatically prevents your device from sleeping during long matches.
- **Premium Aesthetics**: Features a modern glassmorphism design, smooth animations, and ultra-bold typography for maximum legibility.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/muunleit-projects/fab_lifecounter.git
   cd fab_lifecounter
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🐳 Docker Deployment

The project includes a multi-stage `Dockerfile` for easy deployment using Nginx:

```bash
docker build -t fab-lifecounter .
docker run -p 8080:80 fab-lifecounter
```

## 🛠 Tech Stack

- **Vite**: Ultra-fast frontend tooling.
- **Vanilla JavaScript**: Lightweight and high-performance.
- **Vanilla CSS**: Custom design system with glassmorphism and HSL color logic.
- **Service Workers**: Offline support and asset caching.
- **Wake Lock API**: Persistent screen activation.

## 📝 License

This project is licensed under the MIT License.

---

Built for players, by players. ⚔️
