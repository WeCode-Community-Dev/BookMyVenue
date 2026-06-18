import { Button } from "@bookmyvenue/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button appName="BookMyVenue" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Click me</Button>
    </div>
  );
}
