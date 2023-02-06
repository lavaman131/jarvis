from fastapi import FastAPI, UploadFile
from starlette.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydub import AudioSegment

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
    
@app.post("/upload")
async def upload(file: UploadFile):
    song = AudioSegment.from_file(file.file, "ogg")
    
    # song.export("test.ogg", format="ogg")
    return {"message": "File received"}