import Link from "next/link";

type AuthFooterLinkProps = {
  prompt: string;
  linkText: string;
  href: string;
};

export function AuthFooterLink({ prompt, linkText, href }: AuthFooterLinkProps) {
  return (
    <p className="text-center text-sm text-on-surface-variant">
      {prompt}{" "}
      <Link
        href={href}
        className="font-semibold text-surface-tint hover:underline"
      >
        {linkText}
      </Link>
    </p>
  );
}
