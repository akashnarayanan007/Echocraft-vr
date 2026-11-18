import asyncio
import os
import edge_tts

# Condensed script to fit comfortably into the 180s storyboard windows with ample breathing room
WALKTHROUGH_SEGMENTS = [
    {
        "id": "sec1_intro",
        "target_start": 1.0, # 1.0 - 18.0
        "text": "Welcome to ECHOCRAFT VR: The Last Light, an immersive WebXR experience designed around exploration and environmental restoration. In this experience, players discover a storm-swept lighthouse island whose light has faded, and whose world can only be restored by recovering three magical memories."
    },
    {
        "id": "sec2_world_objective",
        "target_start": 20.0, # 20.0 - 42.0
        "text": "The journey begins in a miniature island environment surrounded by a dark ocean. At the center stands an abandoned lighthouse. Resting nearby are three glowing memory fragments: Warmth, Life, and Hope. Our goal is to restore these memories by placing each fragment into its matching stone shrine."
    },
    {
        "id": "sec3_vr_controls",
        "target_start": 44.0, # 44.0 - 66.0
        "text": "ECHOCRAFT is built around direct tactile interaction. Supported WebXR controls allow players to reach toward a memory fragment, grab it, and guide it through space. When brought to the matching shrine, the game snaps the fragment into place and triggers its restoration effect. If released outside, it gently returns to its pedestal to try again."
    },
    {
        "id": "sec4_warmth",
        "target_start": 68.0, # 68.0 - 90.0
        "text": "Our first memory is Warmth, represented by this glowing amber gem. As we guide it to its shrine, it locks into place. A golden shockwave spreads outward from the lighthouse, marking our first milestone. The beacon rekindles, sweeping light across the water, and the storm begins to ease with immediate harmonic audio feedback."
    },
    {
        "id": "sec5_life",
        "target_start": 92.0, # 92.0 - 114.0
        "text": "The second memory is Life. This emerald fragment embodies the island's sleeping nature. Upon placement into its shrine, another restorative wave pulses across the crags. Wild coastal flowers open and vibrant moss blankets the stone terraces. Rather than just collecting items, the player directly revitalizes the living world."
    },
    {
        "id": "sec6_hope",
        "target_start": 116.0, # 116.0 - 138.0
        "text": "The final memory is Hope, shining with radiant cyan energy. Placing it completes the shrine triad and initiates the final transformation. The tempest breaks completely. Rain dissolves into mist, the ocean turns turquoise, and the sky welcomes a brilliant dawn. The lighthouse is fully awakened."
    },
    {
        "id": "sec7_finale_tech",
        "target_start": 140.0, # 140.0 - 160.0
        "text": "With the memories restored, the miniature environment expands into an immersive room-scale scene. ECHOCRAFT combines custom Blender models, Three.js rendering, Meta's Immersive Web SDK, and procedural Web Audio synthesis to deliver a seated, comfortable VR experience."
    },
    {
        "id": "sec8_replay_close",
        "target_start": 162.0, # 162.0 - 176.0
        "text": "Players can reset at any time to experience the restoration anew. ECHOCRAFT VR: The Last Light is a poetic journey about bringing light back to a forgotten world. Thank you for watching this complete gameplay walkthrough."
    }
]

VOICE = "en-US-ChristopherNeural"
RATE = "+0%" # Clear, natural developer narration cadence
PITCH = "+0Hz"

OUTPUT_DIR = "public/audit-artifacts/walkthrough-vo-parts"
os.makedirs(OUTPUT_DIR, exist_ok=True)

async def generate():
    print(f"Generating timed developer walkthrough voiceover using {VOICE}...")
    for seg in WALKTHROUGH_SEGMENTS:
        out_file = os.path.join(OUTPUT_DIR, f"{seg['id']}.mp3")
        comm = edge_tts.Communicate(seg["text"], VOICE, rate=RATE, pitch=PITCH)
        await comm.save(out_file)

if __name__ == "__main__":
    asyncio.run(generate())
