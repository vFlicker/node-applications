import Transcriber, { TranscriberEvents } from "./transcriber.js";

const DEEPGRAM_API_KEY = "5a91a6b3c0274d019236ddf1c899213c65ae5a56";

/**
 * Events to subscribe to:
 * + connection: Triggered when a client connects to the server.
 * + configure-stream: Requires an object with a 'sampleRate' property.
 * - incoming-audio: Requires audio data as the parameter.
 * - stop-stream: Triggered when the client requests to stop the transcription stream.
 * - disconnect: Triggered when a client disconnects from the server.
 *
 *
 * Events to emit:
 * - transcriber-ready: Emitted when the transcriber is ready.
 * - final: Emits the final transcription result (string).
 * - partial: Emits the partial transcription result (string).
 * - error: Emitted when an error occurs.
 */
const initializeWebSocket = (io) => {
  io.on("connection", (socket) => {
    let transcriber = null;

    console.log(`a client (${socket.id}) connected to the server`);

    socket.on("configure-stream", ({ simpleRate }) => {
      transcriber = new Transcriber(DEEPGRAM_API_KEY);

      transcriber.on(TranscriberEvents.Ready, () => {
        socket.emit("transcriber-ready");
      });

      transcriber.on(TranscriberEvents.Final, (text) => {
        socket.emit("final", text);
      });

      transcriber.on(TranscriberEvents.Partial, (text) => {
        socket.emit("partial", text);
      });

      transcriber.on(TranscriberEvents.Error, (err) => {
        socket.emit("error", err);
      });

      transcriber.startTranscriptionStream(simpleRate);
    });

    socket.on("incoming-audio", ({ data }) => {
      if (transcriber) {
        transcriber.send(data);
      }
    });

    socket.on("stop-stream", () => {
      console.log("stop stream triggered");

      if (transcriber) {
        transcriber.endTranscriptionStream();
        transcriber = null;
      }
    });

    socket.on("disconnect", () => {
      console.log(`a client (${socket.id}) disconnected`);

      if (transcriber) {
        transcriber.endTranscriptionStream();
        transcriber = null;
      }
    });
  });

  return io;
};

export default initializeWebSocket;
