from fastapi import FastAPI, UploadFile
from starlette.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydub import AudioSegment
import whisper

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
    return {"transcription": result["text"]}