import asyncio
import os
import edge_tts

# Storyboard Segments (Exact timings matching the 85s visual arc)
SEGMENTS = [
    {
        "id": "act1_1",
        "text": "Once, a single light guided every soul home.",
        "start": 1.5,
    },
    {
        "id": "act1_2",
        "text": "But even the brightest light can fade.",
        "start": 5.8,
    },
    {
        "id": "act1_5_1",
        "text": "On a forgotten island, three memories are all that remain.",
        "start": 11.0,
    },
    {
        "id": "act1_5_2",
        "text": "Warmth. Life. And Hope.",
        "start": 17.5,
    },
    {
        "id": "act2_1",
        "text": "Restore Warmth...",
        "start": 23.5,
    },
    {
        "id": "act2_2",
        "text": "...and the darkness begins to surrender.",
        "start": 28.5,
    },
    {
        "id": "act3_1",
        "text": "Awaken Life...",
        "start": 38.0,
    },
    {
        "id": "act3_2",
        "text": "...and watch a forgotten world breathe again.",
        "start": 43.5,
    },
    {
        "id": "act4_1",
        "text": "And when Hope returns...",
        "start": 51.5,
    },
    {
        "id": "act4_2",
        "text": "...the storm finally breaks.",
        "start": 57.5,
    },
    {
        "id": "act5_1",
        "text": "Three memories. One forgotten world.",
        "start": 65.0,
    },
    {
        "id": "act5_2",
        "text": "And one last chance to bring the light home.",
        "start": 71.0,
    },
    {
        "id": "act6_1",
        "text": "ECHOCRAFT VR. The Last Light.",
        "start": 78.5,
    }
]

VOICE = "en-US-ChristopherNeural" # Warm, mature, cinematic storytelling narrator
RATE = "-4%" # Slightly measured, deliberate cinematic cadence
PITCH = "-2Hz"

OUTPUT_DIR = "public/audit-artifacts/voiceover-parts"
os.makedirs(OUTPUT_DIR, exist_ok=True)

async def generate():
    print(f"Generating voiceover segments using {VOICE}...")
    for seg in SEGMENTS:
        out_file = os.path.join(OUTPUT_DIR, f"{seg['id']}.mp3")
        comm = edge_tts.Communicate(seg["text"], VOICE, rate=RATE, pitch=PITCH)
        await comm.save(out_file)
        print(f"Generated {seg['id']}: '{seg['text']}' -> {out_file}")

if __name__ == "__main__":
    asyncio.run(generate())
