export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t py-6 text-center text-gray-500 text-sm mt-auto">
      &copy; {new Date().getFullYear()} BookMyVenue. All rights reserved.
    </footer>
  );
}