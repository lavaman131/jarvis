# necessary imports
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import Dict
from dotenv import load_dotenv
# add any other imports you need here: (suggestions: pydub, ffmpeg, librosa, torchaudio, whisper, wav2vec, fairseq, etc.)


# TODO: add your code here
# create a .env file in the root directory and add it to your environment variables:
load_dotenv(".env")

# use this code snippet to get the API key from the .env file:
os.environ.get("API_KEY")
##########################


###########BOILERPLATE CODE############
app = FastAPI()
origins = [
    "https://jarvis-kappa.vercel.app",
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)
###BOILERPLATE CODE ENDS HERE##########


# TODO: add your code here
@app.post("/upload")
async def upload(file: UploadFile) -> Dict[str, str]:
    """
    An endpoint to upload an audio file and get a response from OpenAI
    or any other large language model (LLM) API.

    Args:
        file (UploadFile): The audio file to process in OGG format.

    Returns:
        response (Dict[str, str]): The response from an OpenAI (or other LLM API call). 
    """
    # load the audio file here (suggestions: pydub library, ffmpeg, etc.)
    
    # preprocess the audio file here (suggestions: librosa, torchaudio, etc.)
    
    # decode the audio into text here using a pretrained model (suggestions: whisper, wav2vec, fairseq, etc.)
    
    # create a prompt for OpenAI here (suggestions: use the decoded text from the previous step)
    # you can use the following prompt as a starting point:
    try:
        response = "The response to the API call to OPENAI or other LLM API"
        return {"answer": response}
    
    except:
        return {"answer": "Something went wrong. Try again later."}