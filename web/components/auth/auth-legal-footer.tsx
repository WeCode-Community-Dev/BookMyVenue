export function AuthLegalFooter() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <a href="#" className="hover:text-on-surface hover:underline">
          Terms of Service
        </a>
        <span aria-hidden="true">·</span>
        <a href="#" className="hover:text-on-surface hover:underline">
          Privacy Policy
        </a>
      </div>
      <p className="text-label-sm tracking-wider text-muted-foreground uppercase">
        © 2024 BookMyVenue Inc. All rights reserved.
      </p>
    </div>
  );
}
