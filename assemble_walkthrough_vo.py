import os
import subprocess
from generate_walkthrough_voiceover import WALKTHROUGH_SEGMENTS

def assemble_walkthrough_vo():
    inputs = []
    filter_complex = []
    
    # 180.0 seconds silent base audio track (48kHz stereo)
    filter_complex.append("aevalsrc=0:d=180:s=48000:c=stereo[base]")
    
    current_mix = "[base]"
    
    for i, seg in enumerate(WALKTHROUGH_SEGMENTS):
        file_path = f"public/audit-artifacts/walkthrough-vo-parts/{seg['id']}.mp3"
        inputs.extend(["-i", file_path])
        
        delay_ms = int(seg["target_start"] * 1000)
        
        filter_complex.append(f"[{i}:a]adelay={delay_ms}|{delay_ms},volume=1.0[delayed_{i}]")
        next_mix = f"[mix_{i}]" if i < len(WALKTHROUGH_SEGMENTS) - 1 else "[vo_out]"
        filter_complex.append(f"{current_mix}[delayed_{i}]amix=inputs=2:duration=first:dropout_transition=0{next_mix}")
        current_mix = next_mix

    cmd = [
        "ffmpeg", "-y",
        *inputs,
        "-filter_complex", ";".join(filter_complex),
        "-map", "[vo_out]",
        "-t", "180",
        "-c:a", "pcm_s16le",
        "public/audit-artifacts/echocraft_walkthrough_voiceover.wav"
    ]
    
    print("Running 180s walkthrough voiceover assembly command...")
    subprocess.run(cmd, check=True)
    print("Exported public/audit-artifacts/echocraft_walkthrough_voiceover.wav successfully.")

if __name__ == "__main__":
    assemble_walkthrough_vo()
