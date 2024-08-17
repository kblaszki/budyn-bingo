import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io({
  auth: {
    serverOffset: 0,
  },
});

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("chat message", (msg, id) => {
      setChat(prevChat => [...prevChat,  { id, content: msg }]);
      socket.auth.serverOffset = id;
    });

    return () => {
      socket.off("chat message");
    };
  }, [chat]);

  const sendMessage = () => {
    socket.emit("chat message", message);
    setMessage("");
  };

  return (
    <div className="App">
      <h1>Budyn Bingo App</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onEnter={sendMessage}
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        {chat.map(({ id, content }) => (
          <p key={id}>{content}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
