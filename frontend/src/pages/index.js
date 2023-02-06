import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { headers } from "next.config";

const API_URL = "http://localhost:8000/upload";

const toggleRecording = (event) => {
  event.currentTarget.classList.toggle("active");
  document.querySelector(".jarvis-img").classList.toggle("active");
  document.querySelector(".aura").classList.toggle("active");
  if (event.currentTarget.classList.contains("active")) {
    record((blob) => {
      sendData(blob);
    });
  }
};

function record(callback) {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      let chunks = [];

      mediaRecorder.start();

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      const record_btn = document.querySelector(".record-btn");
      record_btn.addEventListener("click", () => {
        mediaRecorder.stop();
      });

      mediaRecorder.onstop = (e) => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        callback(blob);
      };
    })
    .catch((error) => console.error(error));
}

async function sendData(blob) {
  const formData = new FormData();
  formData.append(
    "file",
    new File([blob], "audio.ogg", {
      type: "audio/ogg",
    })
  );

  fetch(API_URL, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Jarvis</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div className="grid grid-rows-1 h-screen bg-slate-900">
        <div className="flex flex-col gap-12 items-center justify-center">
          <div className="relative w-1/2 lg:w-1/3">
            <div className="aura absolute inset-0 rounded-full"></div>
            <img
              src="/jarvis.png"
              alt="virtual assistant"
              className="jarvis-img relative"
            ></img>
          </div>
          <button
            onClick={toggleRecording}
            className="record-btn font-exo font-bold inline-flex items-center text-slate-800 text-2xl md:text-3xl lg:text-4xl bg-teal px-4 py-2 rounded-lg transition delay-100 duration-150 ease-in-out hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 lg:w-8 lg:h-8 inline-block mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
              />
            </svg>
            Ask Jarvis
          </button>
        </div>
      </div>
    </>
  );
}
