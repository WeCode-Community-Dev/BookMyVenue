import ForgotPasswordForm from '@/presentation/components/auth/ForgotPasswordForm'
import { ROLES } from "@/constants/Roles";
export default function ForgotPassword() {
    return <ForgotPasswordForm  role={ROLES.USER}/>
}
