import { useState, useRef, useEffect } from "react";
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
  // console.log(roomId);
  // console.log(currentUser);
  // console.log(connected);


  const navigate = useNavigate();
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);



  const [messages, setMessages] = useState([
    
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
//page init:
  //messages ko load karne honge
 useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessagess(roomId);
        // console.log(messages);
        setMessages(messages);
      } catch (error) {}
    }
    if (connected) {
      loadMessages();
    }
  }, []);

  //scroll down

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  //stompClient ko init karne honge
  //subscribe

  useEffect(() => {
    const connectWebSocket = () => {
      ///SockJS
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);

        toast.success("connected");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log(message);

          const newMessage = JSON.parse(message.body);

          setMessages((prev) => [...prev, newMessage]);

          //rest of the work after success receiving the message
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }

    //stomp client
  }, [roomId]);

  //send message handle

  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      console.log(input);

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

    //
  };
 function handleLogout() {
    stompClient.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  }




  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-pink-100 via-green-100 to-blue-100 font-mono">
      {/* Header */}
      <header className="fixed top-0 w-full bg-pink-200 border-b-4 border-pink-300 py-4 shadow-md flex justify-around items-center z-10">
         {/* room name container */}
        
        <div>
          <h1 className="text-lg font-bold text-pink-900">
            Room: <span> {roomId} </span>
          </h1>
        </div>
          {/* username container */}
        

        <div>
          <h1 className="text-lg font-bold text-pink-900">
            User: <span>{currentUser}</span>
          </h1>
        </div>
    {/* button: leave room */}
    <div>
        <button 
        
        onClick={handleLogout}
        className="bg-red-300 hover:bg-red-400 text-white px-4 py-2 rounded-md border-2 border-red-400 shadow-md">
          Leave Room
        </button>
        </div>
      </header>

      {/* Chat Area */}
<main
  ref={chatBoxRef}
  className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100"
>
  {messages.map((message, index) => (
    <div
      key={index}
      className={`flex items-start gap-2 ${
        message.sender === currentUser ? "justify-end" : "justify-start"
      }`}
    >
          <div
              className={`my-2 ${
                message.sender === currentUser ? "bg-green-800" : "bg-gray-800"
              } p-2 max-w-xs rounded`}
            >
              <div className="flex flex-row gap-2">
                <img
                  className="h-10 w-10"
                  src={"https://avatar.iran.liara.run/public/43"}
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold">{message.sender}</p>
                  <p>{message.content}</p>
                  <p className="text-xs text-gray-400">
                    {timeAgo(message.timeStamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
      {/* Input Area */}
      <div className="fixed bottom-4 w-full h-16">
        <div className="h-full pr-10 pl-4 gap-4 flex items-center justify-between rounded-md w-3/4 md:w-1/2 mx-auto bg-white border-4 border-pink-200 shadow-lg">
          <input
          value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            



            type="text"
            placeholder="Type your message..."
            className="w-full bg-pink-50 border-2 border-pink-200 px-5 py-2 rounded-md focus:outline-none text-gray-800 shadow-inner font-medium"
          />
          <div className="flex gap-1">
          <button className="bg-purple-300 hover:bg-purple-400 text-white flex items-center justify-center h-10 w-10 rounded-md border-2 border-purple-400 shadow-md">
            <MdAttachFile size={20} />
          </button>

          <button 
            onClick={sendMessage}
          
          className="bg-blue-300 hover:bg-blue-400 text-white flex items-center justify-center h-10 w-10 rounded-md border-2 border-blue-400 shadow-md">
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ChatPage;
