import os
import subprocess
from generate_voiceover import SEGMENTS

def assemble_voiceover():
    inputs = []
    filter_complex = []
    
    # 85 seconds silent base audio track (48kHz stereo)
    filter_complex.append("aevalsrc=0:d=85:s=48000:c=stereo[base]")
    
    current_mix = "[base]"
    
    for i, seg in enumerate(SEGMENTS):
        file_path = f"public/audit-artifacts/voiceover-parts/{seg['id']}.mp3"
        inputs.extend(["-i", file_path])
        
        # Calculate delay in milliseconds
        delay_ms = int(seg["start"] * 1000)
        
        # input index is i + 1 because input 0 is not used here; 
        # actually all inputs are numbered 0, 1, 2...
        filter_complex.append(f"[{i}:a]adelay={delay_ms}|{delay_ms},volume=1.0[delayed_{i}]")
        next_mix = f"[mix_{i}]" if i < len(SEGMENTS) - 1 else "[vo_out]"
        filter_complex.append(f"{current_mix}[delayed_{i}]amix=inputs=2:duration=first:dropout_transition=0{next_mix}")
        current_mix = next_mix

    cmd = [
        "ffmpeg", "-y",
        *inputs,
        "-filter_complex", ";".join(filter_complex),
        "-map", "[vo_out]",
        "-t", "85",
        "-c:a", "pcm_s16le",
        "public/audit-artifacts/echocraft_voiceover.wav"
    ]
    
    print("Running voiceover assembly command...")
    subprocess.run(cmd, check=True)
    print("Exported public/audit-artifacts/echocraft_voiceover.wav successfully.")

if __name__ == "__main__":
    assemble_voiceover()
