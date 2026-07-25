import { useLocation } from "react-router-dom";
import VerifyOtpForm from "@/presentation/components/auth/VerifyOtpForm";

export default function VerifyOtp() {
    const location = useLocation();

    const email = location.state?.email;
    const role = location.state?.role;

    return <VerifyOtpForm email={email} role={role} />;
}
