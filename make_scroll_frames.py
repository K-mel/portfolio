"""
Génère une image haute qualité avec NanoBanana 2 (Gemini)
puis crée 120 frames avec Ken Burns (zoom + pan) pour l'effet scroll Apple.
"""
import requests, base64, io, sys, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from pathlib import Path
from PIL import Image

# ─── CONFIG ───
GEMINI_KEY   = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = "gemini-3.1-flash-image-preview"
FRAMES_DIR   = Path(__file__).parent / "frames"
FRAME_COUNT  = 120
OUTPUT_W     = 1280
OUTPUT_H     = 720

# ─── PROMPT IMAGE ───
PROMPT = (
    "Cinematic ultra-detailed digital cosmos: a vast dark void filled with thousands of glowing "
    "neural network nodes connected by electric filaments of light in deep electric teal and warm amber gold. "
    "Hyper-realistic floating particles forming organic data-stream patterns. "
    "Deep space background with subtle nebula clouds in midnight navy and dark violet. "
    "Microscopic circuit-like lattice structures glow faintly in the mid-ground. "
    "Foreground bokeh particles out of focus. Extreme depth of field. "
    "Photorealistic, 8K resolution, cinematic color grading, dramatic volumetric lighting. "
    "No text, no watermarks, no UI elements."
)

def log(msg):  print(f"  {msg}", flush=True)
def ok(msg):   print(f"  ✅ {msg}", flush=True)
def err(msg):  print(f"  ❌ {msg}", flush=True); sys.exit(1)

# ─── STEP 1 : GENERATE IMAGE ───
def generate_image() -> Image.Image:
    print("\n🎨 STEP 1 — Génération image NanoBanana 2 (Gemini)...")
    r = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_KEY}",
        json={
            "contents": [{"parts": [{"text": PROMPT}]}],
            "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}
        },
        timeout=90
    )
    if r.status_code != 200:
        err(f"Gemini error {r.status_code}: {r.text[:400]}")

    data = r.json()
    for part in data.get("candidates", [{}])[0].get("content", {}).get("parts", []):
        if "inlineData" in part:
            img_b64 = part["inlineData"].get("data", "")
            if img_b64:
                img = Image.open(io.BytesIO(base64.b64decode(img_b64))).convert("RGB")
                src_path = Path(__file__).parent / "source_image.jpg"
                img.save(src_path, "JPEG", quality=96)
                ok(f"Image {img.size[0]}x{img.size[1]}px → {src_path.name}")
                return img
    err("Aucune image dans la réponse Gemini")

# ─── EASE ───
def ease_in_out(t: float) -> float:
    """Cubic ease-in-out — mouvement très fluide"""
    return t * t * (3 - 2 * t)

# ─── STEP 2 : GENERATE FRAMES ───
def generate_frames(img: Image.Image):
    print(f"\n🎬 STEP 2 — Génération {FRAME_COUNT} frames ({OUTPUT_W}x{OUTPUT_H})...")
    FRAMES_DIR.mkdir(exist_ok=True)

    src_w, src_h = img.size

    # Animation: zoom in (1.0 → 1.40) + légère rotation de perspective simulée via pan
    zoom_start, zoom_end   = 1.00, 1.40
    cx_start,   cx_end     = 0.50, 0.53   # pivot horizontal (0–1)
    cy_start,   cy_end     = 0.50, 0.46   # pivot vertical   (0–1)

    saved = 0
    for i in range(FRAME_COUNT):
        t    = ease_in_out(i / max(FRAME_COUNT - 1, 1))
        zoom = zoom_start + (zoom_end - zoom_start) * t
        cx   = cx_start   + (cx_end   - cx_start)   * t
        cy   = cy_start   + (cy_end   - cy_start)   * t

        crop_w = int(src_w / zoom)
        crop_h = int(src_h / zoom)

        left = int(cx * src_w - crop_w / 2)
        top  = int(cy * src_h - crop_h / 2)
        left = max(0, min(left, src_w - crop_w))
        top  = max(0, min(top,  src_h - crop_h))

        frame = img.crop((left, top, left + crop_w, top + crop_h))
        frame = frame.resize((OUTPUT_W, OUTPUT_H), Image.LANCZOS)
        frame.save(FRAMES_DIR / f"f{i:04d}.jpg", "JPEG", quality=83, optimize=True)
        saved += 1

        if i % 30 == 0:
            log(f"Frame {i:03d}/{FRAME_COUNT}  zoom={zoom:.3f}")

    total_mb = sum(f.stat().st_size for f in FRAMES_DIR.glob("*.jpg")) / 1_048_576
    ok(f"{saved} frames sauvegardées → {FRAMES_DIR}")
    ok(f"Taille totale frames : {total_mb:.1f} MB")

# ─── MAIN ───
if __name__ == "__main__":
    print("=" * 56)
    print("  SCROLL VIDEO GENERATOR — NanoBanana 2 + Ken Burns")
    print("=" * 56)
    img = generate_image()
    generate_frames(img)
    print("\n🚀 Terminé ! Ouvre index.html dans un navigateur web")
    print("   (besoin d'un serveur local pour charger les frames)")
    print("   → python -m http.server 8080 puis ouvre localhost:8080")
