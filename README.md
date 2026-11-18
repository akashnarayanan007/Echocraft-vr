# ECHOCRAFT VR — The Last Light
> *Build a Memory. Step Inside Its Story.*

**Competition**: Meta VR Start Developer Competition 2026  
**Track**: Entertainment | **Division**: New Experience  
**SDK**: Meta Immersive Web SDK (IWSDK) v1.1.0, Three.js, TypeScript, Vite, WebXR  

---

## Experience Overview

**ECHOCRAFT VR** is a hands-first, seated-scale immersive storytelling experience built with Meta's official Immersive Web SDK (IWSDK).

The player sits before a floating, storm-battered miniature island diorama known as **The Last Light**. A fierce indigo rainstorm shrouds the craggy cliffs, and the lighthouse lantern flickers weakly against the darkness. Within comfortable arm's reach rest three glowing memory fragments:

1. **Memory of Warmth** (Golden Octahedron): Rekindles the lighthouse lantern, piercing the gloom with a sweeping volumetric beacon and reducing the tempest.
2. **Memory of Life** (Emerald Crystal): Awakens dormant nature, causing vibrant moss, coastal grass, and blooming wildflowers to flourish across the terraces.
3. **Memory of Hope** (Celestial Azure Star): Clears the skies into a radiant sunrise and triggers the **Immersive Transition** — the miniature island seamlessly expands into a full-scale world surrounding the seated player, concluding with a poetic epilogue.

---

## Features & Technical Highlights

- **100% Native Meta IWSDK Architecture**:
  - Entity-Component-System (ECS) query architecture via `@iwsdk/core`.
  - Zero invented APIs; uses standard declarative `iwsdk.config.json` and `main.iwsdk.scene.json`.
  - Native spatial UI powered by `@pmndrs/uikit-horizon` and `@pmndrs/uikit-lucide`.
- **Seated-First Ergonomics**:
  - Designed for stationary comfort without requiring roomscale walking.
  - All fragments and sockets are positioned comfortably within the natural seated reach envelope.
- **Hands-First WebXR & Multi-Modal Input**:
  - Near hand pinch & squeeze grabbing (`OneHandGrabbable`).
  - Distant ray targeting & trigger grabbing (`DistanceGrabbable`).
  - Full desktop mouse, ray pointer, and keyboard testing support (`RayInteractable`).
- **Smooth, Comfort-Safe Expansion**:
  - The diorama smoothly scales and repositions around the seated viewer, preserving vestibular comfort with zero forced camera translation.
- **Zero-Dependency Procedural Synthesizer**:
  - Real-time Web Audio API procedural sound engine generating resonant chord chimes for each fragment placement, rain ambience, and triumphant sunrise harmonics — 100% offline with no external audio file downloads.

---

## Instructions for Judges & Developers

### Prerequisites
- **Node.js**: `>= 20.19.0` (Verified on Node v24.21.0)
- **Modern Web Browser**: Chrome, Edge, or Meta Quest Browser with WebXR enabled

### Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start the IWSDK dev server with IWER XR Emulation
npm run dev

# Or start headless AI-mode server:
npx @iwsdk/cli dev up --ai-mode agent --headless
```

The application will launch at `https://localhost:8081/`.

### Desktop XR Emulation & Testing
If you do not have a physical Meta Quest headset connected, you can experience and test the full experience using IWSDK's built-in **IWER Desktop XR Emulator**:

1. Open `https://localhost:8081/` in your desktop Chrome/Edge browser.
2. Accept the local development certificate.
3. On desktop, you can interact immediately using:
   - **Click & Drag**: Pick up and move memory fragments.
   - **Direct Click**: Click any unsocketed fragment to smoothly conduit-snap it into its matching socket.
   - **HUD One-Click Buttons**: Click `Place Warmth`, `Place Life`, and `Place Hope` on the spatial panel.
   - **Keyboard Shortcuts**:
     - Press `1`: Place Memory of Warmth
     - Press `2`: Place Memory of Life
     - Press `3`: Place Memory of Hope
     - Press `R`: Reset / Relive Experience
4. Click **Enter XR** to activate IWER emulation mode:
   - Use `W/A/S/D` to navigate the emulator viewpoint.
   - Hold `Right Mouse Button` to look around.
   - Use `Shift` / `Space` to move controllers.
   - Click to squeeze / pinch / ray-select.

### Production Build & Type Checking

```bash
# Run TypeScript validation
npm run typecheck

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Development & Testing Methodology

In strict accordance with the competition constraints, **ECHOCRAFT VR** was developed, iterated, and verified entirely through desktop WebXR emulation (IWER) and the official IWSDK CLI tools. No physical Quest headset was required or falsely claimed.

- **Verified CLI Status**: `npx @iwsdk/cli dev status`
- **Verified Type Safety**: `npm run typecheck` passes with zero errors.
- **Verified Production Bundling**: `npm run build` generates clean minified assets with tree-shaken UI and MSDF typography.
- **Verified Offline Operation**: All 3D assets and audio soundscapes are generated procedurally with zero external cloud dependencies.

---

## License & Credits

See [ASSET_CREDITS.md](file:///c:/Users/akash/Desktop/ECHOCRAFT-VR/ASSET_CREDITS.md) for full licensing details.
All custom code and procedural assets are licensed under the MIT License.
