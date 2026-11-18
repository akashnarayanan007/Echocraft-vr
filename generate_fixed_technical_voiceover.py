import asyncio
import os
import edge_tts

# Carefully edited script to ensure every segment fits cleanly with 2 to 3 seconds of breathing room
# Total target duration: 180.0s
TECHNICAL_SCRIPT_SEGMENTS = [
    {
        "id": "p1_intro",
        "target_start": 0.5, # 0.5 - 18.5s (end: ~18.0s)
        "text": "Welcome to ECHOCRAFT VR: The Last Light, an immersive virtual reality experience created for the Meta VR Start Developer Competition. Our goal is to combine atmospheric world design and intuitive VR interactions. The player begins on a forgotten lighthouse island surrounded by a storm."
    },
    {
        "id": "p2_concept",
        "target_start": 19.5, # 19.5 - 39.5s (end: ~39.0s)
        "text": "The central idea is simple: restore a fading world by recovering three lost memories. Warmth, Life, and Hope are magical fragments placed around the island. Each fragment belongs to a matching shrine. We designed the experience as a miniature diorama so players can interact directly with its most important objects."
    },
    {
        "id": "p3_interaction_iwsdk",
        "target_start": 41.5, # 41.5 - 64.0s (end: ~63.5s)
        "text": "ECHOCRAFT is built using Meta's Immersive Web SDK, WebXR, Three.js, and TypeScript. Using supported VR controls, players can grab, move, and release memory fragments. The game checks whether a fragment reaches its shrine before activating restoration. Incorrect placement allows the player to try again."
    },
    {
        "id": "p4_warmth",
        "target_start": 66.0, # 66.0 - 87.0s (end: ~86.5s)
        "text": "The first memory is Warmth. When the amber fragment reaches its shrine, a golden wave of energy spreads across the island. The lighthouse beacon begins to glow, bringing the first sign of recovery. We created these effects using custom Three.js geometry, animated materials, and harmonic chime audio feedback."
    },
    {
        "id": "p5_life",
        "target_start": 89.0, # 89.0 - 109.5s (end: ~108.5s)
        "text": "The second memory is Life. Its emerald fragment represents the island's natural energy. Once restored, the environment becomes vibrant and coastal vegetation recovers. We crafted the lighthouse and island as custom low-poly models in Blender, then exported optimized GLB assets for the WebXR scene."
    },
    {
        "id": "p6_hope",
        "target_start": 111.0, # 111.0 - 132.5s (end: ~131.5s)
        "text": "The final memory is Hope. Placing the cyan fragment completes the restoration sequence. The rain fades, the ocean turns turquoise, and the sky welcomes a golden sunrise. These changes are coordinated through our TypeScript gameplay systems, managing lighting, animation, and restoration."
    },
    {
        "id": "p7_audio_dev_skills",
        "target_start": 134.5, # 134.5 - 155.0s (end: ~154.0s)
        "text": "Using the Web Audio API, we created procedural wind, ocean ambience, and unique musical cues for each memory. Our workflow combined 3D modeling, interactive programming, audio design, and iterative testing using automated TypeScript checks, production builds, and Meta's XR emulator."
    },
    {
        "id": "p8_finale_comfort",
        "target_start": 157.0, # 157.0 - 169.5s (end: ~169.0s)
        "text": "With all three memories restored, the island transforms into a room-scale environment. We focused on comfortable interaction, clear visual feedback, and avoiding forced camera movement. The experience can be reset and played again at any time."
    },
    {
        "id": "p9_closing",
        "target_start": 171.0, # 171.0 - 177.5s (finishes naturally before 180s)
        "text": "ECHOCRAFT VR: The Last Light brings together immersive technology, creative design, and interactive storytelling. Thank you for watching."
    }
]

VOICE = "en-US-ChristopherNeural"
RATE = "+0%"
PITCH = "+0Hz"

OUTPUT_DIR = "public/audit-artifacts/walkthrough-vo-fixed"
os.makedirs(OUTPUT_DIR, exist_ok=True)

async def generate():
    print(f"Generating optimized technical script voiceover using {VOICE}...")
    for seg in TECHNICAL_SCRIPT_SEGMENTS:
        out_file = os.path.join(OUTPUT_DIR, f"{seg['id']}.mp3")
        comm = edge_tts.Communicate(seg["text"], VOICE, rate=RATE, pitch=PITCH)
        await comm.save(out_file)

if __name__ == "__main__":
    asyncio.run(generate())
