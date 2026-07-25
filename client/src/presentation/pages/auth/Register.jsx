// import Header from '@/presentation/components/common/Header'
// import Footer from '@/presentation/components/common/Footer'
import RegisterForm from '@/presentation/components/auth/RegisterForm'
import AuthBanner from '@/presentation/components/auth/AuthBanner'

export default function Register() {
    return (
        <>
            {/* <Header /> */}
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2">
                    <RegisterForm />
                    <AuthBanner />
                </div>
            </main>
            {/* <Footer /> */}
        </>
    )
}
