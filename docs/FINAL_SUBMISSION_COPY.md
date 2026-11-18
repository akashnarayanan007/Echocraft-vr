# ECHOCRAFT VR — THE LAST LIGHT
## OFFICIAL COMPETITION SUBMISSION COPY

**Competition:** Meta VR Start Developer Competition 2026  
**Track:** Entertainment Track  
**Division:** Net New Experience  
**Platform:** Meta Quest (WebXR) / Desktop XR Emulation  
**Tech Stack:** Meta Immersive Web SDK (IWSDK v1.1.0), Three.js r185, EliCS v3.4.2, TypeScript, Vite, Web Audio API  
**Tagline:** *Build a Memory. Step Inside Its Story.*  

---

### 1. Short Description (Pitch)
**ECHOCRAFT VR: The Last Light** is a seated hands-first WebXR narrative diorama built with the official Meta Immersive Web SDK (IWSDK). Players sit before a storm-swept miniature island and restore a fading lighthouse by returning three lost memory fragments—Warmth, Life, and Hope—to ancient stone shrines. Placing each fragment triggers real-time environmental transformations, calming the tempest until the world erupts into a radiant dawn that seamlessly expands into a room-scale immersive viewpoint surrounding the player.

---

### 2. Full Project Description
In an ocean of forgotten stories, the beacon of **The Last Light** is going dark. 

Built from the ground up using Meta's Immersive Web SDK (IWSDK), ECHOCRAFT VR reimagines VR storytelling by combining the intimate tactile charm of a physical tabletop diorama with the cinematic wonder of full room-scale presence. 

The player is seated directly in front of a floating, storm-battered coastal island. As rain pours into the dark sea and volumetric fog swirls around rugged sea crags, the lighthouse beam rotates dimly. Resting on the player's tactile altar plinths are three glowing, handcrafted memory fragments:
1. **Memory of Warmth** (Amber Embers): Awakens the dormant lantern room. A golden shockwave pierces the gale, the beacon beam brightens and sweeps across the water, and the rain slows to a gentle drizzle.
2. **Memory of Life** (Emerald Motes): Re-energizes the earth. Lush green coastal moss blankets the cliff sides, and wildflowers burst into bloom along the stone pathways.
3. **Memory of Hope** (Celestial Azure Star): Banishes the storm completely. The skies clear into a breathtaking peach and gold sunrise, the ocean shifts to tropical turquoise, and the diorama gracefully expands to surround the seated viewer in a monument of light.

With zero cloud dependencies or external audio assets, the entire experience runs on native WebXR standards, procedural audio synthesis, and high-performance glTF models crafted specifically for this project.

---

### 3. Core Gameplay & Technical Features

- **Hands-First WebXR & Multi-Modal Input:**
  - Full native hand tracking support (pinch to grab, release to socket) powered by IWSDK's `OneHandGrabbable`.
  - Controller squeeze grab with proximity snap guidance and distance ray targeting (`DistanceGrabbable`).
  - Seamless desktop fallback (mouse drag-and-drop, interactive spatial UIKitML buttons, and keyboard accessibility keys `1`, `2`, `3`, `R`, `M`).
- **Seated Ergonomic Design:**
  - Engineered specifically for comfortable seated play. All interactive fragments and sockets reside strictly within natural forearm reach (0.4m–0.7m radius).
  - Smooth expansion transition moves the world around the viewer with zero forced camera motion, guaranteeing vestibular comfort.
- **Procedural Web Audio Soundscape:**
  - Real-time procedural audio synthesis using the Web Audio API. 
  - Dynamic pink noise ocean wind, bandpass surf swells, resonant 110 Hz lighthouse hum, and signature harmonic chimes for each memory placement.
  - Automatically transitions from storm fury to calm dawn waves as the world is healed.
- **Stylized Blender 3D Art Pipeline:**
  - Custom low-poly stylized island and lighthouse models authored and refined via direct Blender MCP tooling.
  - PBR materials, custom gradient sky domes, and atmospheric additive rain particle systems.

---

### 4. How to Test & Review

#### Option A: Immersive WebXR on Meta Quest 3
1. Open the **Meta Quest Browser** on your headset.
2. Navigate to the verified HTTPS hosting link:  
   *(Placeholder for live deployment URL or local preview)*
3. Click the on-screen **"Step Inside the Story"** button, then select **"Enter XR"** on the spatial HUD panel.
4. Reach out with your hands (pinch) or controllers (grip) to pick up the three memory gems and place them into their stone shrines.

#### Option B: Desktop WebXR Emulation (IWER)
1. Open the project URL in Google Chrome or Microsoft Edge on any desktop or laptop.
2. Accept the audio prompt by clicking **"Step Inside the Story"**.
3. Use mouse click & drag or press **`1`**, **`2`**, and **`3`** on your keyboard to restore the world.
4. Press **`R`** at any time to relive the transformation, or **`M`** to toggle audio.

---

### 5. Platform Testing & Compliance Disclosure
- **WebXR Compatibility:** Developed strictly in compliance with W3C WebXR Device API standards and Meta Horizon Developer Content Guidelines.
- **Testing Verification:** Validated via automated Playwright test suites (`tests/smoke.test.mjs`, `tests/visual-audit.mjs`), clean TypeScript validation (`tsc --noEmit`), and Meta IWSDK desktop browser emulation (IWER Meta Quest 3 profile).
- **Physical Hardware Note:** Testing on physical Meta Quest hardware is scheduled via standard sideload/developer browser testing; all demonstrated XR features are fully functional within the official Meta IWSDK emulator runtime.

---

### 6. Submission Links & Assets Checklist

- [x] **Project Repository:** `https://github.com/akashnarayanan007/echocraft-vr.git` (Branch: `competition-final`, Tag: `v1.0.0-rc1`)
- [x] **Demonstration Video:** `public/audit-artifacts/echocraft_gameplay_demo.mp4` (Full 1080p, 58s unedited gameplay walkthrough)
- [x] **High-Resolution Presentation Screenshots:**
  - `public/audit-artifacts/01_initial_storm_1080p.png`
  - `public/audit-artifacts/02_close_three_quarter_1080p.png`
  - `public/audit-artifacts/03_restored_sunrise_finale_1080p.png`
  - `public/audit-artifacts/04_restored_finale_768p.png`
  - `public/audit-artifacts/xr_emulator_stage1_warmth.png`
  - `public/audit-artifacts/xr_emulator_stage2_life.png`
  - `public/audit-artifacts/xr_emulator_stage3_sunrise_expansion.png`
- [x] **Documentation:** `docs/FINAL_QA_REPORT.md` and `docs/SUBMISSION_READINESS.md`
