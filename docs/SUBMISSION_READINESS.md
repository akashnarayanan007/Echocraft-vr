# SUBMISSION READINESS DOCUMENT

**Project:** ECHOCRAFT VR — *The Last Light*  
**Competition:** Meta VR Start Developer Competition 2026  
**Track:** Entertainment Track  
**Submission Date:** November 18, 2026  
**Active Working Branch:** `competition-final`  
**Build Classification:** **READY**  

---

## 1. Project Overview

- **Title:** ECHOCRAFT VR — The Last Light
- **Tagline:** *"Build a Memory. Step Inside Its Story."*
- **Short Description:** An atmospheric seated WebXR diorama experience built for Meta Quest headsets using Meta Immersive Web SDK (IWSDK) and Three.js. Players restore a storm-ravaged coastal lighthouse by gathering and socketing three lost memory fragments (Warmth, Life, and Hope), triggering real-time environmental transformations from dark storm to a radiant dawn that expands to encompass the player.
- **Genre:** Narrative VR Experience / Spatial Puzzle / Interactive Diorama.
- **Target Audience:** VR enthusiasts, narrative game fans, and developers exploring WebXR capabilities on Meta Quest.

---

## 2. Technical Stack & Architecture

- **Engine & Core:** Meta Immersive Web SDK (IWSDK v1.1.0), Three.js r185, EliCS v3.4.2 (Entity Component System).
- **Environment & Models:** Custom low-poly stylized GLB models (Lighthouse and Island) authored with Blender MCP integration.
- **UI Framework:** IWSDK UIKitML (`public/ui/echocraft-hud.uikitml`) for spatial panels and responsive HTML5 onboarding modal.
- **Audio Engine:** Procedural Web Audio API soundscape (pink noise storm wind, bandpass ocean surf, harmonic memory chimes).
- **Bundler & Tooling:** Vite 7, TypeScript, ESLint, Playwright for automated WebXR smoke and visual audit tests.

---

## 3. Controls & Interaction Scheme

| Input Method | Action |
| :--- | :--- |
| **Meta Quest Controllers** | Squeeze grip button to pick up fragments; release near stone shrines to snap. Point controller target ray to select UI buttons. |
| **WebXR Hand Tracking** | Pinch index finger and thumb to grab fragments; release to place in sockets. |
| **Desktop Mouse** | Click and drag on fragments to grab/socket directly; click HUD buttons. |
| **Keyboard Accessibility** | `1` = Socket Warmth, `2` = Socket Life, `3` = Socket Hope, `R` = Reset Experience, `M` = Toggle Audio Mute. |

---

## 4. Tested Platforms & Environments

- **Verified via Automated Tests:**
  - Desktop WebXR Emulation (IWER Meta Quest 3 Profile, Chrome/Chromium 126+).
  - Headless Playwright Chromium at 1920×1080 and 1366×768 resolutions.
- **Hardware Status:**
  - Emulated XR: **VERIFIED PASS**
  - Physical Quest 3 Headset: **NOT TESTED** (Ready for sideload / WebXR browser testing on device).

---

## 5. Submission Asset Checklist

- [x] Application source code on Git branch `competition-final`.
- [x] Production build passes cleanly (`dist/` directory verified).
- [x] Custom 3D assets in `public/assets/models/` (`echocraft_island.glb`, `echocraft_lighthouse.glb`).
- [x] High-resolution screenshots captured in `public/audit-artifacts/` (Storm, Three-quarter inspection, Sunrise finale, 768p responsive, and XR emulator states).
- [x] Procedural soundscape integrated with zero missing asset dependencies.
- [x] `docs/FINAL_QA_REPORT.md` complete with playthrough matrix.
- [x] `docs/SUBMISSION_READINESS.md` prepared.
- [x] License and asset credits documented (`ASSET_CREDITS.md`).

---

## 6. Known Limitations & Post-Competition Roadmap

- **Integrated GPU Frame Drops:** While targeting 72–90 FPS on Meta Quest hardware via WebGL2/WebXR, desktop software emulation on basic integrated GPUs can dip during heavy particle bursts.
- **Future Physical Polish:** Add Quest haptic pulses on grab and snap events once physically tethered.
