import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import LoginForm from "../components/auth/LoginForm";

function Login() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <LoginForm />
      </main>

      <Footer />
    </>
  );
}

export default Login;