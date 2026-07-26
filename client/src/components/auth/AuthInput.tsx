import { Field, ErrorMessage } from 'formik';
import type { ReactNode } from 'react';

interface AuthInputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  icon: ReactNode;
  disabled?: boolean;
}

export function AuthInput({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  icon,
  disabled = false,
}: AuthInputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </label>

      <div className="group flex h-14 items-center rounded-2xl border border-[var(--bg-grey)] bg-[var(--bg-tertiary)] px-4 transition-all duration-200 focus-within:border-[var(--text-primary)] focus-within:ring-4 focus-within:ring-[var(--bg-grey)]">
        <div className="mr-3 text-xl text-[var(--text-secondary)] transition-colors group-focus-within:text-[var(--text-primary)]">
          {icon}
        </div>

        <Field
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className="h-full w-full bg-transparent text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]"
        />
      </div>

      <ErrorMessage
        name={name}
        component="p"
        className="mt-2 text-sm text-red-500 dark:text-red-400"
      />
    </div>
  );
}
