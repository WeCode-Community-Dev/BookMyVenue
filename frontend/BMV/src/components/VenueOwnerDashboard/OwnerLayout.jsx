import OwnerSidebar from "./OwnerSidebar";
import OwnerTopbar from "./OwnerTopbar";

function OwnerLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />
      <div className="flex-1 min-w-0">
        <OwnerTopbar />
        <main className="px-4 sm:px-6 py-6 max-w-[1400px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default OwnerLayout;
