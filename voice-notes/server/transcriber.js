import EventEmitter from "events";
import { LiveTranscriptionEvents, createClient } from "@deepgram/sdk";

const TranscriberEvents = {
  Ready: "ready",
  Final: "final",
  Partial: "partial",
  Error: "error",
};

class Transcriber extends EventEmitter {
  #deepgram = null;
  #connection = null;
  #keepAlive = null;

  constructor(apiKey) {
    super();
    this.#deepgram = createClient(apiKey);
  }

  startTranscriptionStream(sampleRate) {
    this.#connection = this.#deepgram.listen.live({
      model: "nova-2",
      punctuate: true,
      language: "en",
      interim_results: true,
      diarize: false,
      smart_format: true,
      endpointing: 0,
      encoding: "linear16",
      sample_rate: sampleRate,
    });

    if (this.#keepAlive) clearInterval(this.#keepAlive);
    this.#keepAlive = setInterval(() => {
      console.log("deepgram: keepalive");
      this.#connection.keepAlive();
    }, 10 * 1000);

    this.#connection.on(LiveTranscriptionEvents.Open, () => {
      this.emit(TranscriberEvents.Ready);

      this.#connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const transcript = data.channel.alternatives[0].transcript;

        if (data.speech_final) this.emit(TranscriberEvents.Final, transcript);
        else this.emit(TranscriberEvents.Partial, transcript);
      });

      this.#connection.on(LiveTranscriptionEvents.Close, () => {
        console.log("deepgram: disconnected");
        clearInterval(this.#keepAlive);
        this.#connection.finish();
      });

      this.#connection.on(LiveTranscriptionEvents.Error, (err) => {
        console.log("deepgram: error received");
        this.emit(TranscriberEvents.Error, err);
      });
    });
  }

  endTranscriptionStream() {
    if (this.#connection) {
      this.#connection.finish();
      this.#connection.removeAllListeners();
      this.#keepAlive = null;
      this.#connection = null;
    }
  }

  // NOTE: deepgram must be ready before sending audio payload or it will close the connection
  send(payload) {
    const readyState = this.#connection.getReadyState();
    if (readyState === 1) {
      this.#connection.send(payload);
    }
  }

  // ... feel free to add more functions
}

export default Transcriber;
export { TranscriberEvents };
