# ECHOCRAFT VR — The Last Light
> *Build a Memory. Step Inside Its Story.*

[![Play Live WebXR](https://img.shields.io/badge/PLAY%20LIVE-WebXR%20Ready-brightgreen?style=for-the-badge&logo=vercel)](https://echocraft-vr.vercel.app/)
[![Meta VR Start 2026](https://img.shields.io/badge/Meta%20VR%20Start-2026%20Entry-blue?style=for-the-badge&logo=meta)](#-experience-overview)
[![Meta IWSDK](https://img.shields.io/badge/Meta%20IWSDK-v1.1.0-orange?style=for-the-badge)](https://iwsdk.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

## 🎮 PLAY ECHOCRAFT VR

### 🔗 **[PLAY ECHOCRAFT VR (Live WebXR Experience)](https://echocraft-vr.vercel.app/)**

#### How to Play:
- **In Meta Quest Browser (VR Mode)**:
  1. Put on your Meta Quest headset (Quest 2, Quest 3, Quest 3S, or Quest Pro).
  2. Open the Meta Quest Browser and navigate to **[https://echocraft-vr.vercel.app/](https://echocraft-vr.vercel.app/)**.
  3. Click **"Step Inside the Story"** on the introductory screen.
  4. Click **"Enter VR"** to activate full immersive WebXR mode.
  5. Squeeze your controller grip or pinch your fingers to grab memory fragments, or point and click with the target ray.
- **In Desktop Browser (Fallback Mode)**:
  1. Open **[https://echocraft-vr.vercel.app/](https://echocraft-vr.vercel.app/)** in Google Chrome, Microsoft Edge, Brave, or Apple Safari.
  2. Click **"Step Inside the Story"** to begin audio and render the storm diorama.
  3. **Mouse**: Click and drag fragments, or direct-click any fragment to conduit-snap it to its shrine.
  4. **Spatial HUD**: Click the one-touch placement buttons on the floating panel.
  5. **Keyboard Shortcuts**: Press **`1`** for Warmth, **`2`** for Life, **`3`** for Hope, and **`R`** to Reset.

---

## 📖 Experience Overview

**ECHOCRAFT VR — The Last Light** is a hands-first, seated-scale immersive VR storytelling experience created for the **Meta VR Start Developer Competition 2026 (Entertainment Track)** using Meta's official **Immersive Web SDK (IWSDK v1.1.0)**, Three.js, and WebXR.

The player sits comfortably before a floating miniature island diorama known as **The Last Light**. A fierce indigo storm battering craggy cliffs shrouds the world in shadow, and the lighthouse beacon flickers faintly against the darkness. Within the player's natural reach envelope rest three glowing memory fragments:

1. 🔥 **Memory of Warmth** *(Golden Octahedron)*: Rekindles the lighthouse lantern, piercing the tempest with a sweeping 360° volumetric beam and calming the rain into mist.
2. 🌿 **Memory of Life** *(Emerald Crystal)*: Awakens coastal flora, shifting ocean color from stormy teal to tranquil sapphire and calming turbulent waves.
3. ⭐ **Memory of Hope** *(Celestial Azure Star)*: Dissolves the storm into a radiant golden sunrise and triggers the **Immersive Transition** — the miniature island seamlessly expands into a full-scale world surrounding the seated viewer, accompanied by a poetic epilogue.

---

## 🛠️ Key Technical Architecture

- **100% Native Meta IWSDK Architecture**:
  - Full Entity-Component-System (ECS) query architecture using `@iwsdk/core`.
  - Zero invented APIs; driven by declarative project authority `iwsdk.config.json` and `public/scenes/main.iwsdk.scene.json`.
  - Spatial UI crafted with `@pmndrs/uikit-horizon` and `@pmndrs/uikit-lucide`.
- **Custom Blender 4.3 Low-Poly GLB Assets**:
  - Bespoke stylized lighthouse tower with spiral catwalk, lantern housing, and weather vane (`echocraft_lighthouse.glb`).
  - Terraced craggy sea cliff base with stone foundation stairs and memory shrines (`echocraft_island.glb`).
- **Hands-First WebXR & Multi-Modal Input**:
  - Near-hand pinch and squeeze grabbing (`OneHandGrabbable`).
  - Distant controller ray targeting and trigger pull (`DistanceGrabbable`).
  - Full desktop mouse click-and-drag, direct-click conduit snaps, spatial HUD buttons, and keyboard controls (`RayInteractable`).
- **Seated Ergonomics & Comfort-First Expansion**:
  - Zero forced camera locomotion or artificial head movement.
  - Smooth diorama-to-world scaling transition centered around the viewer's seated position.
- **Zero-Dependency Procedural Audio Synthesizer**:
  - Real-time Web Audio API sound engine generating polyphonic resonant chords on memory placement, continuous dynamic rain ambience, and triumphant sunrise harmonics — 100% offline with zero external audio downloads.

---

## 🕹️ Controls

### WebXR (Meta Quest 2, 3, 3S, Pro)
- **Grab Fragments**: Squeeze controller grip button or pinch fingers in direct hand tracking.
- **Ray Interaction**: Point target ray at fragments or spatial HUD buttons and pull the trigger.
- **Seated Reset**: Press the reset button on the floating HUD or trigger the reset hotkey to relive the experience.

### Desktop Browser (Chrome / Edge / Safari / Brave)
- **Click & Drag**: Pick up and freely drag memory fragments toward their pedestals.
- **Direct Click**: Click any unsocketed fragment to smoothly glide it into its matching socket.
- **HUD Buttons**: Click `Place Warmth`, `Place Life`, and `Place Hope` on the floating diorama panel.
- **Keyboard Shortcuts**:
  - `1`: Socket Memory of Warmth
  - `2`: Socket Memory of Life
  - `3`: Socket Memory of Hope
  - `R`: Reset Experience to the initial storm

---

## 💻 Developer Quick Start

### Prerequisites
- **Node.js**: `>= 20.19.0` (Verified on Node v22 & v24)
- **Package Manager**: `npm`

### Local Setup

```bash
# Clone the repository
git clone https://github.com/akashnarayanan007/echocraft-vr.git
cd echocraft-vr

# Install dependencies
npm install

# Start IWSDK development server with IWER XR Emulation
npm run dev

# Or run Vite runtime directly
npm run dev:runtime
```

Open `https://localhost:8081/` in your browser and accept the local self-signed development certificate.

### Quality Assurance & Validation Suite

```bash
# Typecheck TypeScript codebase
npm run typecheck

# Lint source files
npm run lint

# Production build verification
npm run build

# Automated Playwright WebGL smoke test
npm run test:smoke

# Automated end-to-end visual quality gate audit
node tests/visual-audit.mjs
```

---

## 🔬 Development & Testing Disclosure

In strict adherence to competition guidelines and developer transparency:
- **Development & Verification**: Developed, iterated, and tested via the official **Meta IWSDK CLI**, **Three.js rendering engine**, and the **IWER Desktop XR Emulator**.
- **Hardware Disclosure**: No physical Quest hardware testing is claimed. All interactions, spatial layouts, controller poses, hand-pinch gestures, and rendering performance were verified through the IWSDK browser testing suite and Playwright automated visual quality audits.

---

## 📁 Repository Structure

```
├── docs/                        # Architecture, QA audits, and release documentation
│   ├── FINAL_QA_REPORT.md       # Master Production 04 verification results
│   ├── WALKTHROUGH_AUDIO_REPAIR_REPORT.md # Audio engineering and EBU R128 loudness analysis
│   └── PRODUCTION_05_RELEASE_REPORT.md    # Release candidate validation
├── public/
│   ├── assets/models/           # Blender 4.3 custom GLB models (lighthouse, island)
│   ├── scenes/                  # Declarative IWSDK scene JSON manifests
│   └── ui/                      # Spatial UIKitML UI panels
├── src/
│   ├── scene-assets/            # Procedural 3D scene asset definitions
│   ├── echocraft-systems.ts     # Core ECS systems (Lighting, Weather, Transitions, Audio)
│   ├── echocraft-audio.ts       # Procedural Web Audio API soundscape synthesizer
│   ├── assets.ts                # Shared runtime & editor asset catalog
│   ├── components.ts            # ECS component declarations
│   └── index.ts                 # World instantiation & system registration
└── tests/                       # Automated Playwright smoke tests & visual audit suite
```

---

## 📄 License & Credits

- Source code licensed under the [MIT License](LICENSE).
- All custom 3D models and procedural shaders created specifically for ECHOCRAFT VR.
- For third-party library licenses, see [ASSET_CREDITS.md](ASSET_CREDITS.md).
