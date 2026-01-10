# Sudoku App

> **A production-ready, cross-platform mobile application built to demonstrate advanced React Native & Expo capabilities.**

This project is a full-stack implementation of a Sudoku game that runs seamlessly on **iOS**, **Android**, and the **Web**. It showcases how to solve complex cross-platform challenges—like authentication and hardware integration—while maintaining a single codebase.

---

## Engineering Highlights

### 1. Universal Authentication (The "Hard Stuff")
One of the biggest challenges in React Native is implementing enterprise-grade authentication (Microsoft/Azure AD B2C) that works everywhere.
- **Problem**: MSAL libraries rely on browser-specific APIs (`window.crypto`, `window.open`) that don't exist in React Native.
- **Solution**: Built a custom **Polyfill Layer** (`src/shared/polyfills.ts`) that:
  - Bridges `window.open` to the **Native Safari/Chrome Custom Tabs** (`WebBrowser.openAuthSessionAsync`).
  - Implements a secure, platform-adaptive `crypto` interface.
  - Dynamically switches implementations based on the environment (`Platform.OS`), ensuring the web version uses native browser APIs while iOS/Android use the bridge.

### 2. "Native First" User Experience
Most cross-platform apps feel like web pages wrapped in a container. This app was optimized to feel truly native:
- **Haptic Feedback**: Integrated `expo-haptics` to provide tactile responses (vibrations) for interactions, with fallbacks for the web.
- **Native Modals**: Replaced web-style overlays with OS-native Modal components for performant, hardware-accelerated transitions (slide/fade).
- **Responsive Design**: Custom styled-components that adapt layouts for diverse screen sizes, from mobile phones to desktop browsers.

### 3. Serverless Backend & Database
- **Backend**: A custom Node.js/Express API handling game logic and validation.
- **Database**: **Azure Cosmos DB** (NoSQL) for storing puzzles and a global leaderboard.
- **Infrastructure**: Automated CI/CD pipelines deploying the web version to **Azure Static Web Apps**.

---

## Tech Stack

<div align="center">

| **Frontend** | **Backend** | **Infrastructure** |
| :--- | :--- | :--- |
| ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) | ![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white) |
| **Expo SDK 50+** | **Express.js** | **Cosmos DB** |
| **TypeScript** | **REST API** | **GitHub Actions** |
| **Styled Components** | **MSAL Auth** | **Vercel / Azure Web Apps** |

</div>

---

## How to Run It

Recruiters and engineers can run this locally to test the cross-platform capabilities.

### Prerequisites
- Node.js 18+
- npm

### 1. Setup & Install
```bash
git clone https://github.com/Youcef-DZ/SudokuApp.git
cd SudokuApp
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root:
```env
# Ask me for these keys if you want to run the full DB integration!
COSMOS_ENDPOINT=YOUR_ENDPOINT
COSMOS_KEY=YOUR_KEY
```
*(Note: The app runs in "Offline Mode" without these, using local state for basic gameplay.)*

### 3. Start the "Everything" Server
Run a single command to start the Backend API and the Expo Bundler:
```bash
npm run dev
```

### 4. Open the App
- **Web**: Press `w` in the terminal (opens `http://localhost:8081`).
- **iOS**: Press `i` (requires Xcode Simulator).
- **Android**: Press `a` (requires Android Studio).

---

## Quality & Testing
The project maintains high code quality standards enforced by automated scripts:

- **Unit Tests**: comprehensive Jest coverage for game logic and hooks.
  ```bash
  npm test
  ```
- **Type Safety**: Strict TypeScript configuration.
  ```bash
  npm run type-check
  ```
- **Validation**: A `validate` script runs before every commit.

---

## Project Structure

```
src/
├── components/   # Reusable UI (Buttons, Modals, Header)
├── game/         # Core Game Logic (Sudoku Engine)
├── data/         # API Layer & Cosmos DB Connectors
├── shared/       # Utilities, Theme, & The Polyfills
└── ...
```

---

### Known Edge Cases (Troubleshooting)
- **Android Emulator**: If you see network errors, it's because Android uses `10.0.2.2` to reach localhost. The app automatically handles this switch!
- **Auth**: If login fails on the simulator, run `git clean -ffdx` to clear the native browser cache (WARNING: this deletes all untracked files).

---
