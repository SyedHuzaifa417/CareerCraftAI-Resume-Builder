import Link from "next/link";

export default function Home() {
  return (
    <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
      front page
      <Link
        href="/resumes"
        className="ml-2 h-auto w-max rounded-lg bg-fuchsia-700 p-3 text-center text-white"
      >
        go to resumes
      </Link>
    </main>
  );
}
