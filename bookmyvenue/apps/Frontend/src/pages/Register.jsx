import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import RegisterForm from "../components/auth/RegisterForm";

function Register() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <RegisterForm />
      </main>

      <Footer />
    </>
  );
}

export default Register;