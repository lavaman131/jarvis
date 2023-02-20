import Head from "next/head";
import Image from "next/image";
// import { Inter } from "@next/font/google";
// import styles from "@/styles/Home.module.css";
// import { headers } from "next.config";

const API_URL = "https://jarvis-inference-odgkx4s5jq-uk.a.run.app/upload";
// const API_URL = "http://localhost:8080/upload"

const toggleRecording = () => {
  const record_btn = document.querySelector(".record-btn");
  const jarvis_img = document.querySelector(".jarvis-img");
  const aura = document.querySelector(".aura");
  aura.classList.toggle("active");
  jarvis_img.classList.toggle("active");
  record_btn.classList.toggle("active");
  if (record_btn.classList.contains("active")) {
    record((blob) => {
      sendData(blob, (text) => {
        document.getElementById("record-btn").disabled = false;
        // record_btn.classList.add("cursor-wait");
        // console.log(text);
        if ("speechSynthesis" in window) {
          // Speech Synthesis supported 🎉
          var msg = new SpeechSynthesisUtterance();
          // console.log(text["answer"]);
          msg.text = text["answer"];
          msg.rate = 0.8;
          window.speechSynthesis.speak(msg);
          msg.addEventListener("start", (event) => {
            aura.classList.add("speaking");
          });
          msg.addEventListener("end", (event) => {
            aura.classList.remove("speaking");
            document.getElementById("record-btn").disabled = false;
          });
        } else {
          // Speech Synthesis Not Supported 😣
          alert("Sorry, your browser doesn't support text to speech!");
        }
      });
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
        // close all tracks so recording icon disappears
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      });

      mediaRecorder.onstop = (e) => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        callback(blob);
      };
    })
    .catch((error) => console.error(error));
}

async function sendData(blob, callback) {
  let formData = new FormData();
  formData.append(
    "file",
    new File([blob], "audio.ogg", {
      type: "audio/ogg",
    })
  );

  const requestOptions = {
    headers: {
      "Access-Control-Allow-Origin": [
        "http://localhost:3000",
        "https://jarvis-kappa.vercel.app",
      ],
      "Access-Control-Allow-Headers": "*",
    },
    method: "POST",
    body: formData,
    redirect: "follow",
    mode: "cors",
  };

  fetch(API_URL, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log("Success");
      callback(data);
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

      <div className="flex flex-col gap-6 items-center justify-center h-screen bg-slate-900">
        <div className="relative w-1/2 lg:w-1/3">
          <div className="aura absolute inset-0 rounded-full"></div>
          <Image
            src={`/jarvis.png`}
            width={500}
            height={500}
            alt="virtual assistant"
            className="jarvis-img relative"
          />
        </div>
        <button
          onClick={toggleRecording}
          id="record-btn"
          className="record-btn font-exo font-bold inline-flex items-center text-slate-800 text-2xl md:text-3xl lg:text-4xl bg-teal px-4 py-2 rounded-lg transition delay-100 duration-150 ease-in-out hover:scale-110 disabled:scale-100 disabled:cursor-wait"
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
        <div className="flex flex-row gap-2">
          <span className="text-md md:text-lg lg:text-xl italic">
            The &quot;all-knowing&quot; AI assistant.
          </span>
          <span className="text-md md:text-lg lg:text-xl">🔮</span>
        </div>
      </div>
    </>
  );
}
