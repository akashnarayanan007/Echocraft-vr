import os
import subprocess
from generate_fixed_technical_voiceover import TECHNICAL_SCRIPT_SEGMENTS

# Adjust starts to prevent any overlap and ensure p9 finishes before 180.0s:
TIMING_OFFSETS = {
    "p1_intro": 0.4,             # 0.4 - 19.86s
    "p2_concept": 20.2,          # 20.2 - 41.82s
    "p3_interaction_iwsdk": 42.2,# 42.2 - 65.53s
    "p4_warmth": 66.2,           # 66.2 - 88.14s
    "p5_life": 88.8,             # 88.8 - 109.68s
    "p6_hope": 110.5,            # 110.5 - 131.04s
    "p7_audio_dev_skills": 132.0,# 132.0 - 152.54s
    "p8_finale_comfort": 153.5,  # 153.5 - 169.87s
    "p9_closing": 170.2          # 170.2 - 179.20s (Ends cleanly before 180s)
}

def assemble_single_amix():
    inputs = []
    delays = []
    
    for i, seg in enumerate(TECHNICAL_SCRIPT_SEGMENTS):
        seg_id = seg["id"]
        start_sec = TIMING_OFFSETS[seg_id]
        delay_ms = int(start_sec * 1000)
        file_path = f"public/audit-artifacts/walkthrough-vo-fixed/{seg_id}.mp3"
        inputs.extend(["-i", file_path])
        # Use silenceremove on each clip to strip any encoder delay, then pad
        delays.append(f"[{i}:a]silenceremove=start_periods=1:start_duration=0:start_threshold=-60dB,adelay={delay_ms}|{delay_ms}[d{i}]")
    
    # Mix all 9 inputs together directly with normalize=0 to maintain 100% consistent amplitude
    delayed_streams = "".join(f"[d{i}]" for i in range(len(TECHNICAL_SCRIPT_SEGMENTS)))
    n_inputs = len(TECHNICAL_SCRIPT_SEGMENTS)
    
    filter_complex = ";".join([
        *delays,
        f"{delayed_streams}amix=inputs={n_inputs}:normalize=0:dropout_transition=0[raw_vo]",
        # Apply gentle high-pass filter (80Hz), speech clarity presence EQ (3kHz +2dB), light compression, and true peak limit
        "[raw_vo]highpass=f=80,equalizer=f=3000:t=q:w=1.5:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=100,loudnorm=I=-16:TP=-1.5:LRA=7[vo_master]"
    ])
    
    cmd = [
        "ffmpeg", "-y",
        *inputs,
        "-filter_complex", filter_complex,
        "-map", "[vo_master]",
        "-t", "180",
        "-c:a", "pcm_s16le",
        "public/audit-artifacts/echocraft_walkthrough_voiceover_FIXED.wav"
    ]
    
    print("Assembling fixed master voiceover track...")
    subprocess.run(cmd, check=True)
    print("Successfully exported public/audit-artifacts/echocraft_walkthrough_voiceover_FIXED.wav")

if __name__ == "__main__":
    assemble_single_amix()
