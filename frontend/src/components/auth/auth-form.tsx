"use client";

import type { FormHTMLAttributes, ReactNode } from "react";

type AuthFormProps = FormHTMLAttributes<HTMLFormElement> & {
  children: ReactNode;
};

export function AuthForm({ children, className, ...props }: AuthFormProps) {
  return (
    <form
      className={className}
      onSubmit={(e) => e.preventDefault()}
      {...props}
    >
      {children}
    </form>
  );
}
