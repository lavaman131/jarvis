FROM python:3.8-slim

WORKDIR /app

RUN apt-get update -y
RUN apt-get install --no-install-recommends -y ffmpeg

COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./app /app

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8080"]