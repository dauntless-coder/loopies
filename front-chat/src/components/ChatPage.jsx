import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser, navigate]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  // Load previous messages
  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessagess(roomId);
        setMessages(messages);
      } catch (error) {}
    }
    if (connected) {
      loadMessages();
    }
  }, [connected, roomId]);

  // Auto-scroll
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // WebSocket setup
  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected to chat");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }
  }, [connected, roomId]);

  // Send message
  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
  };

  // Logout
  function handleLogout() {
    if (stompClient) {
      stompClient.disconnect();
    }
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  }

  return (
    <div className="bg-gradient-to-b from-pink-50 to-blue-50 min-h-screen">
      {/* Header */}
      <header className="fixed w-full bg-white border-b shadow-sm py-4 flex justify-between px-10 items-center">
        <h1 className="text-lg font-semibold text-gray-800">
          Room: <span className="text-blue-500">{roomId}</span>
        </h1>
        <h1 className="text-lg font-semibold text-gray-800">
          User: <span className="text-pink-500">{currentUser}</span>
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-full transition"
        >
          Leave Room
        </button>
      </header>

      {/* Chat Box */}
      <main
        ref={chatBoxRef}
        className="pt-20 pb-28 px-6 w-full sm:w-2/3 mx-auto h-screen overflow-auto"
      >
        {messages.map((message, index) => {
          const isSender = message.sender === currentUser;
          return (
            <div
              key={index}
              className={`flex my-3 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start gap-2 max-w-md ${
                  isSender ? "flex-row-reverse text-right" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <img
                  className="h-10 w-10 rounded-full shadow-sm"
                  src={
                    isSender
                      ? "https://avatar.iran.liara.run/public/43" // sender avatar
                      : "https://avatar.iran.liara.run/public/20" // receiver avatar
                  }
                  alt="avatar"
                />

                {/* Message Bubble */}
                <div
                  className={`p-3 rounded-2xl shadow-sm ${
                    isSender
                      ? "bg-green-200 text-gray-800"
                      : "bg-white border text-gray-800"
                  }`}
                >
                  <p className="font-semibold text-sm text-gray-700">
                    {message.sender}
                  </p>
                  <p className="text-base">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {timeAgo(message.timeStamp)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Input Box */}
      <div className="fixed bottom-4 w-full">
        <div className="bg-white border shadow-md h-14 px-4 flex items-center gap-3 w-11/12 sm:w-2/3 mx-auto rounded-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            type="text"
            placeholder="Type your message..."
            className="w-full px-4 py-2 rounded-full focus:outline-none bg-gray-100"
          />
          <button className="bg-purple-400 hover:bg-purple-500 text-white h-10 w-10 flex justify-center items-center rounded-full transition">
            <MdAttachFile size={20} />
          </button>
          <button
            onClick={sendMessage}
            className="bg-green-400 hover:bg-green-500 text-white h-10 w-10 flex justify-center items-center rounded-full transition"
          >
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
