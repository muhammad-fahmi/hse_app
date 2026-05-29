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

      // Mainkan suara alarm yang keras menggunakan Web Audio API tanpa perlu file mp3
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        
        // Buat 3 bunyi bip berturut-turut
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          osc.type = "square"; // Suara lebih tajam cocok untuk alarm
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
    }
    prevReportId.current = latestReportId;
  }, [latestReportId]);

  return null;
}
