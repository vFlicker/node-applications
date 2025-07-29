import { useEffect, useState } from "react";

import useAudioRecorder from "./useAudioRecorder";
import useSocket from "./useSocket";

// IMPORTANT: To ensure proper functionality and microphone access, please follow these steps:
// 1. Access the site using 'localhost' instead of the local IP address.
// 2. When prompted, grant microphone permissions to the site to enable audio recording.
// Failure to do so may result in issues with audio capture and transcription.
// NOTE: Don't use createPortal()

function App() {
  const { initialize, configureStream, incomingAudio, disconnect, socket } =
    useSocket();
  const [temporaryText, setTemporaryText] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    socket.addEventListener("partial", (textPart) => {
      setTemporaryText((prev) => `${prev} ${textPart}`);
    });
  }, []);

  useEffect(() => {
    socket.addEventListener("final", (finalText) => {
      if (finalText !== "") {
        setText((prevText) => `${prevText} ${finalText}`);
        setTemporaryText("");
      }
    });
  }, []);

  useEffect(() => {
    // Note: must connect to server on page load but don't start transcriber
    initialize();
  }, []);

  const { startRecording, stopRecording, isRecording } = useAudioRecorder({
    dataCb: (data) => {
      incomingAudio(data);
    },
  });

  const onStartRecordingPress = async () => {
    // start recorder and transcriber (send configure-stream)
    const simpleRate = await startRecording();
    configureStream(simpleRate);
  };

  const onStopRecordingPress = async () => {
    stopRecording();
    disconnect();
  };

  const value = `${text} ${temporaryText}`;

  // ... add more functions
  return (
    <div>
      <h1>Speechify Voice Notes</h1>
      <p>Record or type something in the textbox.</p>

      <div>
        <textarea value={value}></textarea>
        <div>
          <button
            onClick={isRecording ? onStopRecordingPress : onStartRecordingPress}
          >
            {isRecording ? "Stop recording" : "Start Recording"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
