"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Immediate client-side redirect to home page
    router.replace("/");
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.location.replace("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <meta httpEquiv="refresh" content="0;url=/" />
      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
      <h1 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
        Redirecting to ZestFeedX Newsroom...
      </h1>
      <p className="text-sm text-slate-400 max-w-md">
        The requested dispatch or page could not be located. Redirecting you to the front page now.
      </p>
      <a
        href="/"
        className="mt-4 px-4 py-2 rounded-lg bg-[#d32f2f] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
      >
        Click here if not redirected
      </a>
    </div>
  );
}
