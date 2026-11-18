# THREE-MINUTE DEVELOPER GAMEPLAY WALKTHROUGH REPORT
## ECHOCRAFT VR — THE LAST LIGHT

**Project:** ECHOCRAFT VR — *The Last Light*  
**Competition:** Meta VR Start Developer Competition 2026 (Entertainment Track)  
**Workspace:** `C:\Users\akash\Desktop\ECHOCRAFT-VR`  
**Branch:** `competition-final`  
**Date:** November 18, 2026  
**Format:** Complete 180-Second Developer-Led Gameplay Walkthrough  
**Status:** **100% COMPLETE & VERIFIED**  

---

## 1. Technical Specifications

- **Output File:** `public/audit-artifacts/echocraft_complete_3min_walkthrough.mp4`
- **Duration:** Exactly **180.00 seconds** (`00:03:00.00`)
- **Resolution:** **1920 × 1080** Full HD (16:9 widescreen)
- **Frame Rate:** **30.00 FPS** constant frame rate
- **Video Codec:** H.264 (High Profile, Level 4.0, YUV420p)
- **Video Bitrate:** 484 kb/s (Total container bitrate ~717 kb/s)
- **Audio Codec:** AAC-LC, 48 kHz Stereo, 256 kb/s
- **Total File Size:** **15.38 MB**
- **Subtitles & Overlays:** **STRICTLY NONE** (0 subtitle streams, zero burned-in captions, zero lower thirds, zero watermarks).

---

## 2. Voice-Over & Audio Production

### Developer Narration (`public/audit-artifacts/echocraft_walkthrough_voiceover.wav`)
- **Engine:** Neural Text-to-Speech (`en-US-ChristopherNeural`)
- **Profile:** Calm, confident, informative developer presentation cadence explaining technical mechanics, player objectives, tactile interactions, and world state reactions.
- **Format:** 48 kHz 16-bit Stereo PCM WAV (`34.5 MB`, 180.00s).
- **Eight-Section Storyboard Alignment:**
  1. `00:01.0 - 00:20.0` (19.0s) — **Introduction**: Welcome to ECHOCRAFT VR, exploring the core loop of tactile interaction and environmental restoration.
  2. `00:20.0 - 00:44.0` (20.1s) — **The World & Objective**: Introducing the miniature stormy island diorama, darkened lighthouse, and the three lost memory fragments (Warmth, Life, and Hope).
  3. `00:44.0 - 00:68.0` (23.0s) — **VR Interaction & Controls**: Explaining WebXR grab and distance manipulation mechanics, snap tolerances, and error recovery where fragments return smoothly to their plinths if released outside shrines.
  4. `00:68.0 - 00:92.0` (22.2s) — **First Memory: Warmth**: Guiding the amber gem to its shrine, triggering the golden energy wave, rekindling the beacon, and easing the storm.
  5. `00:92.0 - 01:16.0` (23.1s) — **Second Memory: Life**: Placing the emerald gem, spreading the restorative green wave, and causing wild coastal flowers and moss to flourish.
  6. `01:16.0 - 01:40.0` (21.3s) — **Third Memory: Hope**: Placing the cyan gem, clearing the storm completely, shifting the ocean to turquoise, and welcoming a radiant golden dawn.
  7. `01:40.0 - 01:62.0` (18.5s) — **Finale & Room-Scale Expansion**: Demonstrating the diorama smoothly expanding into an immersive room-scale viewpoint while highlighting the custom Blender models, Three.js engine, Meta IWSDK, and procedural Web Audio.
  8. `01:62.0 - 01:80.0` (14.5s) — **Replay & Reset**: Demonstrating how players can press Reset at any time to return to Stage 0 and experience the journey again.

### Ambient Soundtrack (`public/audit-artifacts/echocraft_walkthrough_music.wav`)
- **Composition:** 180-second original ambient procedural composition specifically balanced to sit beneath continuous developer commentary.
- **Licensing:** 100% Original algorithmic synthesis. Completely free of third-party copyright claims or ContentID conflicts on YouTube.
- **Format:** 48 kHz 16-bit Stereo PCM WAV (`34.5 MB`, 180.00s).

---

## 3. Video Capture & Editing Methodology

- **Capture Pipeline:** Automated Headless Playwright script ([tests/record-walkthrough-180s.mjs](file:///C:/Users/akash/Desktop/ECHOCRAFT-VR/tests/record-walkthrough-180s.mjs)) executing against the live production build at 1920×1080.
- **Interactions Demonstrated:**
  - Complete modal onboarding workflow (`#start-btn`).
  - Tactile grab and drag with intentional release demonstrating smooth plinth return.
  - Sequential socketing of Warmth, Life, and Hope.
  - Three distinct expanding shockwaves and environmental transformations.
  - Full room-scale diorama expansion.
  - Instant reset functionality via the `R` shortcut.

---

## 4. Quality Control & FFprobe Verification

- **Duration Check:** Probed with `ffprobe` = `180.000000` seconds.
- **Resolution & Frame Rate:** 1920×1080 at 30.00 FPS constant frame rate.
- **Subtitle Inspection:** `ffprobe -select_streams s` returns **0 streams**.
- **No Watermarks / UI Chrome:** Clean viewport capture with browser controls completely omitted.
- **Preview Frame:** Saved at [public/audit-artifacts/walkthrough_preview_frame.png](file:///C:/Users/akash/Desktop/ECHOCRAFT-VR/public/audit-artifacts/walkthrough_preview_frame.png).
