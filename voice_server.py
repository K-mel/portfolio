"""
Voice server — Gemini 2.5 Flash Native Audio
GET /api/voice → retourne WAV de la présentation IA
Port : 8081
"""
import asyncio, io, wave, sys, os
from flask import Flask, send_file, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types

GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")

SCRIPT = (
    "Bonjour. "
    "Je suis l'assistant IA de Camel Benmoussa. "
    "Et si je vous disais... que tout ce que vous voyez ici a été conçu pour transformer votre façon de travailler ? "
    "Des applications qui pensent. Des systèmes qui automatisent. Des solutions qui grandissent avec vous. "
    "Camel ne livre pas du code — il livre des résultats. "
    "Alors... par où voulez-vous commencer ?"
)

app = Flask(__name__)
CORS(app)
client = genai.Client(api_key=GEMINI_KEY)
_cache: bytes | None = None

async def _generate() -> bytes:
    config = types.LiveConnectConfig(
        response_modalities=[types.Modality.AUDIO],
        system_instruction=(
            "Tu es un assistant IA charismatique et passionné. "
            "Lis ce texte avec émotion : voix posée et grave au début, "
            "montée en puissance sur les capacités, chaleur sincère sur la conclusion. "
            "Fais de vraies pauses après chaque point. Parle lentement, avec conviction."
        ),
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Orus")
            )
        )
    )
    chunks = []
    async with client.aio.live.connect(
        model="gemini-2.5-flash-native-audio-latest", config=config
    ) as session:
        await session.send_client_content(
            turns=types.Content(parts=[types.Part(text=SCRIPT)], role="user"),
            turn_complete=True
        )
        async for response in session.receive():
            if response.data:
                chunks.append(response.data)
    return b"".join(chunks)

def _to_wav(pcm: bytes) -> io.BytesIO:
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(24000)
        wf.writeframes(pcm)
    buf.seek(0)
    return buf

@app.route("/api/voice")
def voice():
    global _cache
    try:
        if _cache is None:
            print("  Génération Gemini Native Audio...", flush=True)
            pcm = asyncio.run(_generate())
            _cache = pcm
            print(f"  Audio prêt : {len(pcm)//1024}KB (~{len(pcm)//48000}s)", flush=True)
        return send_file(_to_wav(_cache), mimetype="audio/wav", download_name="presentation.wav")
    except Exception as e:
        print(f"  ERREUR: {e}", flush=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/voice/reload")
def reload_voice():
    global _cache
    _cache = None
    return jsonify({"ok": "cache vidé — prochaine requête régénère l'audio"})

if __name__ == "__main__":
    print("=" * 50)
    print("  VOICE SERVER — Gemini 2.5 Flash Native Audio")
    print("  http://localhost:8081/api/voice")
    print("=" * 50)
    app.run(port=8081, debug=False, threaded=False)
