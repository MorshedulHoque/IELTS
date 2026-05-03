"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Next.js client navigations scroll the window, but global `scroll-behavior: smooth`
 * (especially on `*`) can leave the document slightly off the true top. Force an
 * instant reset on route / query changes.
 */
function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryKey = searchParams.toString();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [pathname, queryKey]);

  return null;
}

export default function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopOnNavigate />
    </Suspense>
  );
}
