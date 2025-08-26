import chatIcon from "../assets/chat.png";

const JoinCreateChat = () => {


  const[detail, setDetail] = useState({
    roomId:"",
    userName:"",

  })

  function handleFormInputChange(event){
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,

  })
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-green-100 to-blue-100 font-mono">
      <div className="p-10 w-full flex flex-col gap-6 max-w-md rounded-lg border-4 border-beige-200 bg-white shadow-xl">
        {/* Icon */}
        <div>
          <img src={chatIcon} className="w-24 mx-auto drop-shadow-md" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-pink-900">
          Join Room / Create Room
        </h1>

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block font-medium mb-2 text-gray-700">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full bg-pink-50 border-2 border-pink-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-inner"
          />
        </div>

        {/* Room ID Input */}
        <div>
          <label
            htmlFor="room"
            className="block font-medium mb-2 text-gray-700"
          >
            Room ID / New Room ID
          </label>
          <input
            type="text"
            id="room"
            className="w-full bg-green-50 border-2 border-green-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button className="px-5 py-2 bg-blue-300 hover:bg-blue-400 text-white rounded-md border-2 border-blue-400 shadow-md font-semibold">
            Join Room
          </button>

          <button className="px-5 py-2 bg-orange-300 hover:bg-orange-400 text-white rounded-md border-2 border-orange-400 shadow-md font-semibold">
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
