"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReport } from "@/lib/actions";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h3 className="text-xl font-bold text-gray-900">Report Sent!</h3>
        <p className="text-center text-gray-600">
          Thank you for reporting the issue at {locationName}. The SHE team has been notified.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
          Report Another Issue
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-md bg-yellow-50 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Instructions</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Please describe the safety, health, or environmental issue clearly. Include specific details to help the SHE team resolve it quickly.</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Issue Description
        </label>
        <div className="mt-1">
          <Textarea
            id="description"
            name="description"
            rows={4}
            className="w-full"
            placeholder="E.g. Spilled oil near the main entrance..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Submit Report"}
      </Button>
    </form>
  );
}
