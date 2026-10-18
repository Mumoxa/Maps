import React from 'react'
import ReactDOM from 'react-dom/client'
// Self-hosted variable fonts, bundled with the app (no external font requests).
import '@fontsource-variable/geist/wght.css'
import '@fontsource-variable/geist-mono/wght.css'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
