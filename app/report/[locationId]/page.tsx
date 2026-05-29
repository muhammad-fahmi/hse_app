import { db } from "@/db";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ReportForm from "./report-form";

export default async function ReportPage(props: { params: Promise<{ locationId: string }> }) {
  const params = await props.params;
  const locationId = params.locationId;

  // Since QR URL might use the unique `qr_code_id`, we fetch by it
  const [location] = await db.select().from(locations).where(eq(locations.qr_code_id, locationId));

  if (!location) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          SHE Incident Report
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Location: <span className="font-semibold text-primary">{location.name}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ReportForm locationId={location.id} locationName={location.name} />
        </div>
      </div>
    </div>
  );
}
