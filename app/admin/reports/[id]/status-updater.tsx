"use client";

import { useState } from "react";
import { updateReportStatus } from "@/lib/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
      toast.success("Status updated successfully");
      window.location.reload(); // Hard reload to reflect name change as well
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="BARU">
            <span className="flex items-center gap-2">
              <Badge variant="destructive">BARU</Badge>
            </span>
          </SelectItem>
          <SelectItem value="PROSES">
            <span className="flex items-center gap-2">
              <Badge variant="default">PROSES</Badge>
            </span>
          </SelectItem>
          <SelectItem value="SELESAI">
            <span className="flex items-center gap-2">
              <Badge variant="secondary">SELESAI</Badge>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
