"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  if (session) {
    return (
      <>
        <button onClick={handleSignOut}>Sign out</button>
      </>
    );
  }
  return (
    <div className="flex gap-2">
      <button
        className="btn btn-sm btn-outline btn-neutral hidden sm:inline-flex"
        onClick={() => signIn()}
      >
        Sign In
      </button>
      <Link href={"/user/signup"}>
        <button className="btn btn-sm btn-primary bg-red-600 hover:bg-red-700 border-0">
          Get Started
        </button>
      </Link>
    </div>
  );
}
