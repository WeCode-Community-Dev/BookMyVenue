import { Lock, Eye, EyeOff } from "lucide-react";
import { InputWithIcon } from "./InputWithIcon.jsx";

// Password input built on InputWithIcon: fixed Lock icon plus a show/hide toggle.
// The toggle is controlled by the parent (`show` + `onToggle`) so multiple
// password fields can share one visibility state.
export function PasswordField({ show, onToggle, ...props }) {
    return (
        <InputWithIcon
            icon={Lock}
            type={show ? "text" : "password"}
            rightSlot={
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            }
            {...props}
        />
    );
}