import { Outlet } from "react-router-dom"
import Footer from "../components/common/Footer"
import Navbar from "../components/common/Navbar"
import { AuthModalProvider } from "../contexts/AuthModalContext"

export default function UserLayout() {
  return (
    <AuthModalProvider>
      <div className="app-user min-h-screen bg-background text-foreground">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </AuthModalProvider>
  )
}
