import Footer from "../components/common/Footer"
import Navbar from "../components/common/Navbar"

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
