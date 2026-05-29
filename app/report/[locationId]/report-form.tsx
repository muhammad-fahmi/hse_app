"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReport } from "@/lib/actions";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle, Send, RefreshCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReportForm({ locationId, locationName }: { locationId: string, locationName: string }) {
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please describe the issue");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createReport({ location_id: locationId, description });
      setIsSuccess(true);
      toast.success("Report submitted successfully");
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-10 animate-in zoom-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
          <CheckCircle2 className="h-20 w-20 text-green-500 relative" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Report Received</h3>
          <p className="text-muted-foreground font-medium max-w-[250px] mx-auto text-sm leading-relaxed">
            Thank you. The SHE team has been notified about the issue at <span className="text-primary font-bold">{locationName}</span>.
          </p>
        </div>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className="mt-4 rounded-xl gap-2 hover:bg-primary hover:text-primary-foreground transition-all px-8 h-12 font-bold"
        >
          <RefreshCcw className="w-4 h-4" /> Report Another Issue
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-2xl bg-amber-500/10 p-4 border border-amber-500/20 flex gap-4">
        <div className="bg-amber-500 p-2 rounded-xl h-fit shadow-lg shadow-amber-500/20">
          <AlertTriangle className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">How to report</h3>
          <p className="text-xs text-amber-800/70 dark:text-amber-300/70 leading-relaxed">
            Please be specific. Describe exactly what and where the issue is so we can act fast.
          </p>
        </div>
      </div>

      <div className="space-y-3 group">
        <label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 group-focus-within:text-primary transition-colors">
          Issue Description
        </label>
        <div className="relative">
          <Textarea
            id="description"
            name="description"
            rows={5}
            className="w-full bg-secondary/30 border-none rounded-2xl p-4 focus-visible:ring-primary/30 resize-none text-md placeholder:text-muted-foreground/50 transition-all"
            placeholder="E.g. I noticed a large oil spill near the entrance of Warehouse B, it looks like a slip hazard..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className={cn(
          "w-full h-14 text-lg font-black uppercase tracking-tighter rounded-2xl shadow-xl transition-all active:scale-[0.98]",
          isSubmitting ? "bg-muted cursor-not-allowed" : "bg-primary hover:shadow-primary/30 shadow-primary/20"
        )} 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending Report...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            Submit Incident
            <Send className="w-5 h-5" />
          </div>
        )}
      </Button>
    </form>
  );
}
