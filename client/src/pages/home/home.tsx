import Navbar from "@/components/navbar";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
        <h1 className="text-3xl font-semibold">Find and book the perfect venue</h1>
        <p className="mt-2 text-muted-foreground">
          Browse venues, check availability, and book in minutes.
        </p>
      </main>
    </div>
  );
};

export default Home;
