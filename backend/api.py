from fastapi import FastAPI, UploadFile
from starlette.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydub import AudioSegment
import whisper
import os
import openai
import dotenv
config = dotenv.dotenv_values(".env")
openai.api_key = config["OPENAI_API_KEY"]

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    
    response = openai.Completion.create(
            model="text-davinci-003",
            prompt=result["text"],
            temperature=0.6,
            max_tokens=1024,
            n=1)
    return {"answer": response["choices"][0]["text"].replace("\n\n", "")}