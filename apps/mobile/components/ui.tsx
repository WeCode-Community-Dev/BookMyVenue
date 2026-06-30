// Shared RN primitives that mirror the shadcn components used on web.
// Keep the props API close so screen code looks familiar across platforms.
import {
  Pressable,
  Text,
  View,
  TextInput,
  type PressableProps,
  type TextInputProps,
  type ViewProps,
} from "react-native";
import { forwardRef } from "react";

type Variant = "primary" | "outline" | "ghost";
export interface ButtonProps extends PressableProps {
  variant?: Variant;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className,
  ...rest
}: ButtonProps & { className?: string }) {
  const base = "rounded-full px-5 py-3 items-center justify-center";
  const styles: Record<Variant, string> = {
    primary: "bg-brand",
    outline: "border border-border bg-transparent",
    ghost: "bg-transparent",
  };
  const text: Record<Variant, string> = {
    primary: "text-brand-foreground font-semibold",
    outline: "text-foreground font-medium",
    ghost: "text-foreground font-medium",
  };
  return (
    <Pressable className={`${base} ${styles[variant]} ${className ?? ""}`} {...rest}>
      {typeof children === "string" ? <Text className={text[variant]}>{children}</Text> : children}
    </Pressable>
  );
}

export const Input = forwardRef<TextInput, TextInputProps & { className?: string }>(
  ({ className, ...rest }, ref) => (
    <TextInput
      ref={ref}
      placeholderTextColor="#a8a29e"
      className={`border border-border rounded-xl px-4 py-3 text-foreground bg-card ${className ?? ""}`}
      {...rest}
    />
  ),
);
Input.displayName = "Input";

export function Card({ className, ...rest }: ViewProps & { className?: string }) {
  return <View className={`bg-card rounded-2xl p-5 ${className ?? ""}`} {...rest} />;
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{children}</Text>
  );
}

export function H1({ children }: { children: React.ReactNode }) {
  return <Text className="font-serif text-3xl text-foreground">{children}</Text>;
}
export function H2({ children }: { children: React.ReactNode }) {
  return <Text className="font-serif text-2xl text-foreground">{children}</Text>;
}
export function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Text className={`text-foreground/80 ${className ?? ""}`}>{children}</Text>;
}
