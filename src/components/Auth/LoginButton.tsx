"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    queryClient.removeQueries({ queryKey: ["user-profile"] });
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
        className="btn h-10 min-h-10 px-5 text-sm border-0 bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-500/30 transition-all duration-300 hover:from-red-700 hover:to-red-600 hover:shadow-lg hover:shadow-red-500/40 hover:-translate-y-0.5 active:translate-y-0"
        onClick={() => signIn()}
      >
        Sign In
      </button>
      {/* <Link href={"/user/signup"}>
        <button className="btn btn-sm btn-primary bg-red-600 hover:bg-red-700 border-0">
          Get Started
        </button> 
      </Link> */}
    </div>
  );
}
