"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getLatestReportId } from "@/lib/actions";

export default function RealTimeNotifications({ latestReportId }: { latestReportId?: string }) {
  const router = useRouter();
  const prevReportId = useRef(latestReportId);

  useEffect(() => {
    // Gunakan Fetch API standar untuk 100% mem-bypass Cache agresif Next.js
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/latest-report", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          }
        });
        const data = await res.json();
        const currentLatestId = data.id;
        
        if (currentLatestId && prevReportId.current && currentLatestId !== prevReportId.current) {
          // Play audio BEFORE toast to ensure it runs
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

          prevReportId.current = currentLatestId;
          router.refresh(); // Refresh the UI only when a new report is found
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
