import os
import subprocess
from generate_fixed_technical_voiceover import TECHNICAL_SCRIPT_SEGMENTS

d = 'public/audit-artifacts/walkthrough-vo-fixed'

print("--- Timeline Check ---")
for seg in TECHNICAL_SCRIPT_SEGMENTS:
    p = os.path.join(d, seg['id'] + '.mp3')
    out = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', p]).decode().strip()
    dur = float(out)
    start = seg['target_start']
    end = start + dur
    print(f"{seg['id']:22} | start: {start:5.1f}s | duration: {dur:5.2f}s | end: {end:5.2f}s")
