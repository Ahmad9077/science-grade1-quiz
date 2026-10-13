"""Transcribe every narration clip and compare it with its script text.

Local whisper.cpp first (free); clips that score low are re-checked with ElevenLabs
speech-to-text, which handles one-word clips much better.
Usage: python3 scripts/check-audio.py [--cloud-only id1,id2]
"""
import difflib, json, os, re, subprocess, sys, tempfile, urllib.request, uuid

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = os.path.expanduser('~/.cache/whisper-cpp/ggml-large-v3-turbo.bin')


def norm(text):
    text = re.sub('[ً-ْٰـ]', '', text)
    text = re.sub('[إأآا]', 'ا', text).replace('ى', 'ي').replace('ة', 'ه')
    text = re.sub(r'[^\w\s]', ' ', text)
    return ' '.join(text.split())


def whisper(mp3):
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, 'a.wav')
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mp3, '-ar', '16000', '-ac', '1', wav], check=True)
        out = subprocess.run(['whisper-cli', '-m', MODEL, '-l', 'ar', '-nt', '-np', '-f', wav], capture_output=True, text=True)
        return out.stdout.strip()


def scribe(mp3):
    key = next(l.split('=', 1)[1].strip() for l in open(os.path.expanduser('~/.elevenlabs.env')) if l.startswith('ELEVENLABS_API_KEY='))
    boundary = uuid.uuid4().hex
    body = (f'--{boundary}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\nscribe_v1\r\n'
            f'--{boundary}\r\nContent-Disposition: form-data; name="language_code"\r\n\r\nar\r\n'
            f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n').encode()
    body += open(mp3, 'rb').read() + f'\r\n--{boundary}--\r\n'.encode()
    req = urllib.request.Request('https://api.elevenlabs.io/v1/speech-to-text', data=body, headers={
        'xi-api-key': key, 'Content-Type': f'multipart/form-data; boundary={boundary}'})
    return json.loads(urllib.request.urlopen(req, timeout=60).read())['text']


def score(a, b):
    return difflib.SequenceMatcher(None, norm(a), norm(b)).ratio()


clips = json.load(open(os.path.join(ROOT, 'public/audio/manifest.json')))['clips']
results = []
for cid, entry in clips.items():
    mp3 = os.path.join(ROOT, 'public/audio', cid + '.mp3')
    heard = whisper(mp3)
    engine = 'whisper'
    if score(entry['text'], heard) < 0.8:
        heard = scribe(mp3)
        engine = 'scribe'
    results.append((score(entry['text'], heard), cid, entry['text'], heard, engine))

results.sort()
for s, cid, text, heard, engine in results:
    if s < 0.9:
        print(f'{s:.2f} {cid} [{engine}]\n     script: {text}\n     heard:  {heard}')
print(f'checked {len(results)} clips; {sum(1 for r in results if r[0] >= 0.9)} at 0.90 or above')
