import { Header } from '@/app/layout/header';

export function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-page px-6 py-8">{children}</main>
    </div>
  );
}
