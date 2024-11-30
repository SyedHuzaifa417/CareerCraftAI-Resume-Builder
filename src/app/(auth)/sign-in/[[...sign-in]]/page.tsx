//[...sign-in] means catch all routes , extra [] is for optional
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-3">
      <SignIn />
    </main>
  );
}
