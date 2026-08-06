import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./contexts/AuthContext"

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
