"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getLatestReportId } from "@/lib/actions";

export default function RealTimeNotifications({ latestReportId }: { latestReportId?: string }) {
  const router = useRouter();
  const prevReportId = useRef(latestReportId);

  // 1. Data Refresh Polling (Realtime Data Update)
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [router]);

  // 2. Alarm Trigger
  useEffect(() => {
    // Akan terpicu jika latestReportId berubah (artinya router.refresh menemukan data baru)
    if (latestReportId !== undefined && latestReportId !== prevReportId.current) {
      // Play audio
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          osc.type = "square";
          osc.frequency.setValueAtTime(800, ctx.currentTime + i * 0.3);
          
          gainNode.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.3);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.3 + 0.2);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start(ctx.currentTime + i * 0.3);
          osc.stop(ctx.currentTime + i * 0.3 + 0.2);
        }
      } catch (e) {
        console.error("Gagal memutar audio:", e);
      }

      toast.error("🚨 LAPORAN BARU MASUK!", {
        description: "Segera periksa rincian laporan.",
        duration: 10000,
      });
    }

    prevReportId.current = latestReportId;
  }, [latestReportId]);

  return null;
}
