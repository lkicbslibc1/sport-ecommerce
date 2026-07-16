import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './homepage.jsx'
import Dashboard from './admin/dashboard.jsx'
import Products from './admin/Products.jsx'
import { AlertProvider } from './contexts/AlertContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AlertProvider>
      <HomePage />
    </AlertProvider>
  </StrictMode>,
)
