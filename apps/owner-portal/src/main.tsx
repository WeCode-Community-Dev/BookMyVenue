import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@venue404/ui'
import App from './App'
import { AuthProvider } from './lib/AuthContext'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
