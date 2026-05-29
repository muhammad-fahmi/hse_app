"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RealTimeNotifications({ latestReportId }: { latestReportId?: string }) {
  const router = useRouter();
  const prevReportId = useRef(latestReportId);

  useEffect(() => {
    // Poll every 5 seconds to get updates
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    // Trigger alarm only if latestReportId changes and it's not the first render
    if (latestReportId && prevReportId.current && latestReportId !== prevReportId.current) {
      toast.error("🚨 LAPORAN BARU MASUK!", {
        description: "Segera periksa rincian laporan.",
        duration: 10000,
      });

      // Play audio
      const audio = new Audio("/alarm.mp3");
      audio.play().catch(e => console.error("Audio play failed:", e));
    }
    prevReportId.current = latestReportId;
  }, [latestReportId]);

  return null;
}
