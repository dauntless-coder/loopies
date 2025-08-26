import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter} from 'react-router-dom'
import AppRoutes from './config/routes.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  
  <AppRoutes/>
  <Toaster position="top-right" /> {/* ✅ only once, outside routes */}
  </BrowserRouter>

  
  </StrictMode>,
)
