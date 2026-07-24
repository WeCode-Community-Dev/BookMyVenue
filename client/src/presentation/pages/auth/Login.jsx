import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";
import LoginForm from "@/presentation/components/auth/LoginForm";
import AuthBanner from "@/presentation/components/auth/AuthBanner";

export default function Login() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2">
          <LoginForm />
          <AuthBanner />
        </div>
      </main>

      <Footer />
    </>
  );
}