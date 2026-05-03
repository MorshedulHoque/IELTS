"use client";
import QueryProvider from "@/providers/QueryProvider";
import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({ children }: any) {
  return (
    <SessionProvider>
      <QueryProvider>{children}</QueryProvider>
    </SessionProvider>
  );
}