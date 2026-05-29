"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RealTimeNotifications() {
  const router = useRouter();

  useEffect(() => {
    // Poll every 5 seconds to get updates, 
    // replacing SSE to be fully compatible with Vercel Serverless
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
