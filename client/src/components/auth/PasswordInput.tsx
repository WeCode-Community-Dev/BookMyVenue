import { useState, useRef, useEffect } from 'react';
import { Field, ErrorMessage } from 'formik';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import {
  HiOutlineInformationCircle as HiOutlineInfo,
  HiOutlineCheckCircle as HiOutlineCheck,
} from 'react-icons/hi';
import { Link } from 'react-router';

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  showForgotPassword?: boolean;
  withHint?: boolean;
  value?: string;
}

export function PasswordInput({
  id,
  name,
  label,
  placeholder = 'Enter password',
  disabled = false,
  showForgotPassword = false,
  withHint = false,
  value = '',
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!withHint) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (hintRef.current && !hintRef.current.contains(event.target as Node)) {
        setShowPasswordHint(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [withHint]);

  useEffect(() => {
    if (!withHint) return;
    if (showPasswordHint) {
      const timer = setTimeout(() => {
        setShowPasswordHint(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showPasswordHint, withHint]);

  return (
    <div className="relative">
      <div ref={withHint ? hintRef : null} className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>

        {showForgotPassword && (
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] hover:underline"
          >
            Forgot Password?
          </Link>
        )}

        {withHint && (
          <button
            type="button"
            onClick={() => setShowPasswordHint(!showPasswordHint)}
            className="flex items-center gap-1.5 opacity-50 transition hover:opacity-100 focus:outline-none"
          >
            <HiOutlineInfo size={16} className="text-[var(--text-secondary)]" />
            <span className="text-xs text-[var(--text-secondary)]">Password requirements</span>
          </button>
        )}

        {withHint && (
          <div
            className={`absolute right-0 top-[calc(100%+0.5rem)] z-20 w-max max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--bg-grey)] bg-[var(--bg-primary)] p-4 shadow-xl transition-all duration-200 ${
              showPasswordHint
                ? 'translate-y-0 opacity-100 visible'
                : '-translate-y-2 opacity-0 invisible'
            }`}
          >
            <h4 className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
              Password Requirements
            </h4>
            <ul className="space-y-2 text-sm">
              <li
                className={`flex items-center gap-1.5 ${value.length >= 8 ? 'text-[var(--bg-green)]' : 'text-[var(--text-secondary)]'}`}
              >
                {value.length >= 8 ? (
                  <HiOutlineCheck className="text-[var(--bg-green)]" size={16} />
                ) : (
                  <span className="w-4 text-center">•</span>
                )}
                <span>Minimum 8 characters</span>
              </li>
              <li
                className={`flex items-center gap-1.5 ${/[A-Z]/.test(value) ? 'text-[var(--bg-green)]' : 'text-[var(--text-secondary)]'}`}
              >
                {/[A-Z]/.test(value) ? (
                  <HiOutlineCheck className="text-[var(--bg-green)]" size={16} />
                ) : (
                  <span className="w-4 text-center">•</span>
                )}
                <span>One uppercase letter</span>
              </li>
              <li
                className={`flex items-center gap-1.5 ${/[a-z]/.test(value) ? 'text-[var(--bg-green)]' : 'text-[var(--text-secondary)]'}`}
              >
                {/[a-z]/.test(value) ? (
                  <HiOutlineCheck className="text-[var(--bg-green)]" size={16} />
                ) : (
                  <span className="w-4 text-center">•</span>
                )}
                <span>One lowercase letter</span>
              </li>
              <li
                className={`flex items-center gap-1.5 ${/[0-9]/.test(value) ? 'text-[var(--bg-green)]' : 'text-[var(--text-secondary)]'}`}
              >
                {/[0-9]/.test(value) ? (
                  <HiOutlineCheck className="text-[var(--bg-green)]" size={16} />
                ) : (
                  <span className="w-4 text-center">•</span>
                )}
                <span>One number</span>
              </li>
              <li
                className={`flex items-center gap-1.5 ${/[^A-Za-z0-9]/.test(value) ? 'text-[var(--bg-green)]' : 'text-[var(--text-secondary)]'}`}
              >
                {/[^A-Za-z0-9]/.test(value) ? (
                  <HiOutlineCheck className="text-[var(--bg-green)]" size={16} />
                ) : (
                  <span className="w-4 text-center">•</span>
                )}
                <span>One special character</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="group flex h-14 items-center rounded-2xl border border-[var(--bg-grey)] bg-[var(--bg-tertiary)] px-4 transition-all duration-200 focus-within:border-[var(--text-primary)] focus-within:ring-4 focus-within:ring-[var(--bg-grey)]">
        <HiOutlineLockClosed className="mr-3 text-xl text-[var(--text-secondary)] transition-colors group-focus-within:text-[var(--text-primary)]" />

        <Field
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          disabled={disabled}
          className="h-full w-full bg-transparent text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
        >
          {showPassword ? <HiOutlineEyeSlash size={22} /> : <HiOutlineEye size={22} />}
        </button>
      </div>

      <ErrorMessage
        name={name}
        component="p"
        className="mt-2 text-sm text-red-500 dark:text-red-400"
      />
    </div>
  );
}
