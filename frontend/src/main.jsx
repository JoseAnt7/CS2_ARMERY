import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import { applyColorTheme, getStoredColorTheme } from './utils/applyColorTheme'
import App from './App.jsx'

applyColorTheme(getStoredColorTheme())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
