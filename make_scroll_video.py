"""
Génère une vidéo 8s avec Hailuo via PiAPI
puis extrait les frames pour l'effet scroll Apple du portfolio.
"""
import sys, io, requests, time, subprocess, os
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PIAPI_KEY  = os.getenv("PIAPI_KEY", "")
OUT_VIDEO  = Path(__file__).parent / "scroll_video.mp4"
FRAMES_DIR = Path(__file__).parent / "frames"
FPS        = 24

# Prompt cinématique pour l'effet scroll — mouvement lent et hypnotique
PROMPT = (
    "Extremely slow cinematic camera push-in through a vast dark cosmic void. "
    "Thousands of glowing electric teal nodes float in deep space, connected by thin luminous "
    "filaments of light that pulse gently. Digital particles drift like a nebula. "
    "Warm amber golden nodes pulse rhythmically in the distance. "
    "The camera glides forward smoothly through infinite layers of depth, "
    "bokeh stars blur in the background. "
    "Ultra-slow hypnotic motion. Deep space atmosphere. Ethereal sci-fi. "
    "No people, no text, no UI elements. Cinematic 4K."
)

def log(m): print(f"  {m}", flush=True)
def ok(m):  print(f"  OK {m}", flush=True)
def err(m): print(f"  ERR {m}", flush=True); sys.exit(1)

headers = {"X-API-Key": PIAPI_KEY, "Content-Type": "application/json"}

# ─── STEP 1 : LANCER LA GENERATION ───
print("\n" + "="*56)
print("  VIDEO GENERATOR — Hailuo via PiAPI")
print("="*56)
print(f"\nSTEP 1 — Lancement generation video (8s)...")

r = requests.post(
    "https://api.piapi.ai/api/v1/task",
    headers=headers,
    json={
        "model": "hailuo",
        "task_type": "video_generation",
        "input": {
            "prompt": PROMPT,
            "model": "t2v-01-director",
            "duration": 8
        }
    },
    timeout=30
)

if r.status_code != 200:
    err(f"PiAPI error {r.status_code}: {r.text[:300]}")

task_id = r.json().get("data", {}).get("task_id")
if not task_id:
    err(f"Pas de task_id: {r.text[:200]}")

log(f"Task ID: {task_id}")

# ─── STEP 2 : POLL JUSQU'A COMPLETION ───
print(f"\nSTEP 2 — En attente de la video...")
video_url = None

for attempt in range(60):
    time.sleep(10)
    sr = requests.get(f"https://api.piapi.ai/api/v1/task/{task_id}", headers=headers, timeout=15)
    if sr.status_code != 200:
        continue
    data = sr.json().get("data", {})
    status = data.get("status", "")

    if status == "completed":
        out = data.get("output", {})
        video_url = (
            out.get("video_url") or
            out.get("video") or
            ((out.get("videos") or [{}])[0]).get("url", "")
        )
        if video_url:
            ok(f"Video prete ! ({attempt*10}s)")
            break
        else:
            err(f"Status completed mais pas d'URL: {str(out)[:200]}")

    elif status in ["failed", "error"]:
        err(f"Generation echouee: {data.get('error', str(data)[:200])}")

    elif attempt % 3 == 0:
        log(f"... {status} ({attempt*10}s ecoulees)")

if not video_url:
    err("Timeout - video non generee en 10 minutes")

# ─── STEP 3 : TELECHARGER LA VIDEO ───
print(f"\nSTEP 3 — Telechargement video...")
video_data = requests.get(video_url, timeout=120).content
OUT_VIDEO.write_bytes(video_data)
ok(f"Video sauvegardee : {len(video_data)//1024} KB -> {OUT_VIDEO.name}")

# ─── STEP 4 : EXTRAIRE LES FRAMES ───
print(f"\nSTEP 4 — Extraction frames avec FFmpeg ({FPS}fps)...")
FRAMES_DIR.mkdir(exist_ok=True)

# Supprimer les anciennes frames
for f in FRAMES_DIR.glob("f*.jpg"):
    f.unlink()

cmd = [
    "ffmpeg", "-y",
    "-i", str(OUT_VIDEO),
    "-vf", f"fps={FPS},scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720",
    "-q:v", "3",
    str(FRAMES_DIR / "f%04d.jpg")
]

result = subprocess.run(cmd, capture_output=True, text=True)
if result.returncode != 0:
    err(f"FFmpeg: {result.stderr[-300:]}")

frame_list = sorted(FRAMES_DIR.glob("f*.jpg"))
n = len(frame_list)
size_mb = sum(f.stat().st_size for f in frame_list) / 1_048_576
ok(f"{n} frames extraites -> {FRAMES_DIR}")
ok(f"Taille totale: {size_mb:.1f} MB")

# Mettre à jour le nombre de frames dans index.html
html_path = Path(__file__).parent / "index.html"
html = html_path.read_text(encoding='utf-8')
html = html.replace("const FRAME_COUNT = 120;", f"const FRAME_COUNT = {n};")
html_path.write_text(html, encoding='utf-8')
ok(f"index.html mis a jour: FRAME_COUNT = {n}")

print(f"\nTERMINE ! Lance: python -m http.server 8080")
print(f"Puis ouvre: http://localhost:8080")
