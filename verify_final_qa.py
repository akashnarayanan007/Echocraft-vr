import subprocess
import json

def probe(file):
    cmd = ['ffprobe', '-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', file]
    out = subprocess.check_output(cmd)
    return json.loads(out)

mp4_path = 'public/audit-artifacts/echocraft_complete_3min_walkthrough_AUDIO_FIXED.mp4'
data = probe(mp4_path)
print('=== PROBE RESULT FOR FIXED MP4 ===')
print('Duration:', data['format']['duration'])
print('Size (MB):', round(int(data['format']['size']) / (1024*1024), 2))
print('Bitrate (kbps):', round(int(data['format']['bit_rate']) / 1000, 1))
sub_count = 0
for idx, s in enumerate(data['streams']):
    ctype = s.get('codec_type')
    cname = s.get('codec_name')
    if ctype == 'video':
        print(f"Video Stream {idx}: {cname}, {s.get('width')}x{s.get('height')}, {s.get('r_frame_rate')} fps, {s.get('nb_frames')} frames")
    elif ctype == 'audio':
        print(f"Audio Stream {idx}: {cname}, {s.get('sample_rate')} Hz, {s.get('channels')} channels, {s.get('bit_rate')} bps")
    elif ctype == 'subtitle':
        sub_count += 1
print(f"Subtitle streams: {sub_count}")

# Check loudness at intervals across the video
timestamps = [0, 5, 15, 30, 45, 60, 90, 120, 150, 175]
print('\n=== LOUDNESS SAMPLING (5-second windows) ===')
for t in timestamps:
    cmd = [
        'ffmpeg', '-ss', str(t), '-t', '5', '-i', mp4_path,
        '-af', 'ebur128=framelog=verbose', '-f', 'null', '-'
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    for line in res.stderr.splitlines():
        if 'I:' in line and 'LUFS' in line:
            print(f"At {t:3d}s - {t+5:3d}s -> {line.strip()}")
            break
