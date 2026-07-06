import {
  EyeIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  LockIcon,
} from "../icons/icons";
import Field from "./Field";

function AccountFieldsSection({
  fields,
  errors,
  onChange,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isDisabled,
}) {
  return (
    <>
      <Field label="Full Name" error={errors.name}>
        <UserIcon className="w-4 h-4" />
        <input
          name="name"
          type="text"
          placeholder="Enter your full name"
          value={fields.name}
          onChange={onChange}
          autoComplete="name"
          disabled={isDisabled}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
        />
      </Field>

      <Field label="Email Address" error={errors.email}>
        <MailIcon className="w-4 h-4" />
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          value={fields.email}
          onChange={onChange}
          autoComplete="email"
          disabled={isDisabled}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
        />
      </Field>

      <Field label="Phone Number" error={errors.phone}>
        <PhoneIcon className="w-4 h-4" />
        <input
          name="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={fields.phone}
          onChange={onChange}
          autoComplete="tel"
          disabled={isDisabled}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
        />
      </Field>

      <Field label="Password" error={errors.password}>
        <LockIcon className="w-4 h-4" />
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a password"
          value={fields.password}
          onChange={onChange}
          autoComplete="new-password"
          disabled={isDisabled}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="text-gray-400 hover:text-gray-600 transition"
          tabIndex={-1}
        >
          <EyeIcon open={showPassword} />
        </button>
      </Field>

      <Field label="Confirm Password" error={errors.confirmPassword}>
        <LockIcon className="w-4 h-4" />
        <input
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your password"
          value={fields.confirmPassword}
          onChange={onChange}
          autoComplete="new-password"
          disabled={isDisabled}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((v) => !v)}
          className="text-gray-400 hover:text-gray-600 transition"
          tabIndex={-1}
        >
          <EyeIcon open={showConfirmPassword} />
        </button>
      </Field>
    </>
  );
}

export default AccountFieldsSection;