from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydub import AudioSegment
import whisper
import openai
import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(".env")

openai.api_key = os.environ.get("OPENAI_API_KEY")

app = FastAPI()

origins = [
    "https://jarvis-kappa.vercel.app",
    "http://localhost:3000"
]

model = whisper.load_model("tiny")

@app.post("/upload")
async def upload(file: UploadFile):
    audio = AudioSegment.from_file(file.file, "ogg")
    audio.export("temp.ogg", format="ogg")
    
    # load audio and pad/trim it to fit 30 seconds
    audio = whisper.load_audio("temp.ogg")
    audio = whisper.pad_or_trim(audio)

    # make log-Mel spectrogram and move to the same device as the model
    mel = whisper.log_mel_spectrogram(audio).to(model.device)

    # decode the audio
    options = whisper.DecodingOptions(task="transcribe", language="en", fp16=False) # get rid of FP32 warning
    result = whisper.decode(model, mel, options)
    result = model.transcribe("temp.ogg")
    Path("temp.ogg").unlink(missing_ok=True)
    
    try:
        response = openai.Completion.create(
                model="text-davinci-001",
                prompt=result["text"],
                temperature=0.6,
                max_tokens=1024,
                n=1)
        
        return {"answer": ""}