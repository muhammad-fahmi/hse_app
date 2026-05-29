"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RealTimeNotifications() {
  const router = useRouter();

  useEffect(() => {
    const eventSource = new EventSource("/api/sse");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      toast("New Incident Reported!", {
        description: data.description,
        action: {
          label: "Refresh",
          onClick: () => router.refresh(),
        },
        duration: 10000,
        style: {
          backgroundColor: "#ffeb3b",
          color: "#000",
          border: "1px solid #fbc02d",
        }
      });
      // Optionally auto-refresh
      router.refresh();
      // Play a sound
      try {
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
        audio.play();
      } catch (e) {
        // Ignore auto-play policies
      }
    };

    return () => {
      eventSource.close();
    };
  }, [router]);

  return null;
}
