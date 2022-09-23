import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import io from "socket.io-client";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";
import './Chat.css'
let socket;

function Chat() {
  // const [name, setName] = useState("");
  // const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState('');
  const { search } = useLocation();

  const { name, room } = useMemo(() => {
    const name = new URLSearchParams(search).get("name");
    const room = new URLSearchParams(search).get("room");
    return {
      name: name,
      room: room,
    };
  });

  useEffect(() => {
    socket = io.connect("https://realtime-backend-app.herokuapp.com/");
    const data = {
      name: name,
      room: room,
    };
    socket.emit("join", data, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }, []);
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
    socket.on('roomData',({users})=>{
      setUsers(users)
    })
  }, []);
  
  //function for sending message
  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => {
        setMessage("");
      });
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;
