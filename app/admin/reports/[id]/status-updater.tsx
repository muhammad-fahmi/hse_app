"use client";

import { useState } from "react";
import { updateReportStatus } from "@/lib/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StatusUpdater({
  reportId,
  initialStatus,
  userId,
}: {
  reportId: string;
  initialStatus: string;
  userId: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string | null) => {
    if (!newStatus) return;
    setIsUpdating(true);
    try {
      await updateReportStatus(reportId, newStatus, userId);
      setStatus(newStatus);
      toast.success("Status updated to " + newStatus);
      window.location.reload(); 
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
        <SelectTrigger className="w-full h-12 rounded-xl bg-secondary/30 border-none focus:ring-primary/20 transition-all">
          <SelectValue placeholder="Update Status" />
        </SelectTrigger>
        <SelectContent className="glass border-none shadow-2xl rounded-2xl p-2">
          <SelectItem value="BARU" className="rounded-xl focus:bg-red-500/10 focus:text-red-600">
            <div className="flex items-center gap-3 py-1">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <span className="font-bold text-xs uppercase tracking-wider">New Incident</span>
            </div>
          </SelectItem>
          <SelectItem value="PROSES" className="rounded-xl focus:bg-amber-500/10 focus:text-amber-600">
            <div className="flex items-center gap-3 py-1">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <span className="font-bold text-xs uppercase tracking-wider">In Progress</span>
            </div>
          </SelectItem>
          <SelectItem value="SELESAI" className="rounded-xl focus:bg-green-500/10 focus:text-green-600">
            <div className="flex items-center gap-3 py-1">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
              <span className="font-bold text-xs uppercase tracking-wider">Resolved</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      {isUpdating && (
        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-primary animate-pulse">
          <Loader2 className="w-3 h-3 animate-spin" />
          Synchronizing...
        </div>
      )}
    </div>
  );
}
