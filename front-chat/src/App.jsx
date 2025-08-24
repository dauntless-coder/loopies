import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'   // 👈 import toast
import './App.css'
import JoinCreateChat from './components/JoinCreateChat'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
    

   <JoinCreateChat/>

      {/* 👇 this is required for toasts to show */}
      <Toaster position="top-right" />
    </div>
  )
}

export default App
