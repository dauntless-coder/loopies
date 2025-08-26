import { useState, useRef } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      content: "Hello",
      sender: "Aditi",
    },
       {
      content: "Wassup",
      sender: "Akki",
    },
       {
      content: "All good",
      sender: "Aditi",
    },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [currentUser]=useState("Aditi")


  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-pink-100 via-green-100 to-blue-100 font-mono">
      {/* Header */}
      <header className="fixed top-0 w-full bg-pink-200 border-b-4 border-pink-300 py-4 shadow-md flex justify-around items-center z-10">
        <div>
          <h1 className="text-lg font-bold text-pink-900">
            Room: <span className="font-normal">Family Room</span>
          </h1>
        </div>

        <div>
          <h1 className="text-lg font-bold text-pink-900">
            User: <span className="font-normal">Aditi Sharma</span>
          </h1>
        </div>

        <button className="bg-red-300 hover:bg-red-400 text-white px-4 py-2 rounded-md border-2 border-red-400 shadow-md">
          Leave Room
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 mt-20 mb-20 px-4 flex justify-center">
        <div className="message_container w-full md:w-3/4 lg:w-1/2 bg-white border-4 border-pink-200 rounded-lg p-4 overflow-y-auto h-[75vh] shadow-inner">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender== currentUser ?"justify-end":"justify-start"} `}>

            <div className={`my-2 p-2 max-w-xs 
    ${message.sender === currentUser ? "bg-green-400 text-white self-end rounded-2xl rounded-br-none" 
                                     : "bg-gray-400 text-black self-start rounded-2xl rounded-bl-none"}
  `} >
            <div className="flex items-start my-4">
                <img className="h-10 w-10"src={'https://avatar.iran.liara.run/public/12'} alt=""/>
              <div className="bg-blue-100 border border-blue-200 px-4 py-2 rounded-lg shadow text-gray-800 max-w-xs">
                
                
                <p className="text-sm font-semibold text-blue-800">{message.sender}</p>
                <p className="text-md">{message.content}</p>
              </div>
            </div>
            </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-4 w-full h-16">
        <div className="h-full pr-10 pl-4 gap-4 flex items-center justify-between rounded-md w-3/4 md:w-1/2 mx-auto bg-white border-4 border-pink-200 shadow-lg">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full bg-pink-50 border-2 border-pink-200 px-5 py-2 rounded-md focus:outline-none text-gray-800 shadow-inner font-medium"
          />

          <button className="bg-purple-300 hover:bg-purple-400 text-white flex items-center justify-center h-10 w-10 rounded-md border-2 border-purple-400 shadow-md">
            <MdAttachFile size={20} />
          </button>

          <button className="bg-blue-300 hover:bg-blue-400 text-white flex items-center justify-center h-10 w-10 rounded-md border-2 border-blue-400 shadow-md">
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
