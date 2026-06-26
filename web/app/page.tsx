import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1  items-center justify-center font-sans dark:bg-black">
      <header className="flex justify-between items-center w-full px-16 py-4">
        <h1>BookMyVenue</h1>
        <div>
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/signup">Signup</Link>
          </Button>
        </div>

      </header>
      <main className="flex flex-1 w-full   flex-col items-center justify-between dark:bg-black sm:items-start" >

      </main>
    </div>
  );
}
