"use client";

import * as React from "react";
import { Mail } from "lucide-react";

import { IconInput } from "@/components/auth/icon-input";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <IconInput
        label="Email Address"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="name@company.com"
        icon={<Mail />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <PasswordField
        value={password}
        onChange={setPassword}
        name="password"
        autoComplete="current-password"
        required
      />
      <Button type="submit" className="h-10 w-full text-sm font-medium">
        Login
      </Button>
    </form>
  );
}
