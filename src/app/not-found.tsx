import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-65px)]">
      <h1 className="text-3xl font-bold">Page Not Found</h1>
      <p className="text-lg">The page you are looking for does not exist.</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Go back to the homepage
      </Link>
    </div>
  );
}
