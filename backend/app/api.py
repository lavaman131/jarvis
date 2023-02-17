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
    "jarvis-kappa.vercel.app",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

model = whisper.load_model("tiny")
    
@app.get("/")
async def main():
    return {"message": "Hello World"}

@app.post("/upload")
async def upload(file: UploadFile):
    if not openai.api_key:
        return {"answer": "Something went wrong. Try again."}
    
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
    
    if result["text"] == "":
        return {"answer": "I'm not sure I understand."}
    
    response = openai.Completion.create(
            model="text-davinci-001",
            prompt=result["text"],
            temperature=0.6,
            max_tokens=1024,
            n=1)
    
    return {"answer": response["choices"][0]["text"].replace("\n\n", "")}