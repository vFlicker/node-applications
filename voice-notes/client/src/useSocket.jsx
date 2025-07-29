import io from "socket.io-client";

const serverURL = "http://localhost:8080";

const subscriptions = ["final", "partial", "transcriber-ready", "error"];

const socket = io(serverURL, { autoConnect: false });

// feel free to pass in any props
const useSocket = () => {
  // ... free to add any state or variables

  const initialize = () => {
    console.log("initialize");
    socket.connect();
  };

  const configureStream = (simpleRate) => {
    console.log("configureStream");
    socket.emit("configure-stream", { simpleRate });
  };

  const incomingAudio = (data) => {
    console.log("incomingAudio");
    socket.emit("incoming-audio", { data });
  };

  const disconnect = () => {
    socket.emit("stop-stream");
  };

  // ... free to add more functions
  return { socket, initialize, configureStream, incomingAudio, disconnect };
};

export default useSocket;
