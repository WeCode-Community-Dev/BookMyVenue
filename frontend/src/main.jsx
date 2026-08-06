import React from "react"
import ReactDOM from "react-dom/client"
import { GoogleOAuthProvider } from "@react-oauth/google"
import "@fontsource-variable/plus-jakarta-sans"
import "@fontsource-variable/fraunces/standard.css"
import App from "./App.jsx"
import "./lib/axios.js"
import "./index.css"

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

const root = document.getElementById("root")

function Root() {
  if (!googleClientId) {
    console.warn("VITE_GOOGLE_CLIENT_ID is not set. Google sign-in will not work.")
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <App />
    </GoogleOAuthProvider>
  )
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
