import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";

export default function Navbar() {
  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">
        <Link href="/resumes" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="logo"
            width={35}
            height={35}
            className="rounded-full"
          />
          <span className="text-xl font-bold tracking-tight text-blue-800">
            Career Craft AI
          </span>
        </Link>
        <UserButton
          appearance={{
            elements: {
              avatarBox: { width: 35, height: 35 },
            },
          }}
        ></UserButton>
      </div>
    </header>
  );
}
