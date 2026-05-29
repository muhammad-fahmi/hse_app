import { db } from "@/db";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ReportForm from "./report-form";
import { ShieldCheck, MapPin } from "lucide-react";

export default async function ReportPage(props: { params: Promise<{ locationId: string }> }) {
  const params = await props.params;
  const locationId = params.locationId;

  const [location] = await db.select().from(locations).where(eq(locations.qr_code_id, locationId));

  if (!location) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-primary/10 -z-10 rounded-b-[100px] blur-3xl" />
      
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-xl mb-6 border border-primary/10">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Incident Report
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary font-bold text-sm shadow-sm">
            <MapPin className="w-4 h-4" />
            <span>{location.name}</span>
          </div>
        </div>

        <div className="glass border-none shadow-2xl rounded-3xl overflow-hidden p-6 sm:p-10 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <ReportForm locationId={location.id} locationName={location.name} />
        </div>
        
        <p className="text-center text-xs text-muted-foreground font-medium">
          Powered by SHE QR System &bull; Keeping workplaces safe.
        </p>
      </div>
    </div>
  );
}
