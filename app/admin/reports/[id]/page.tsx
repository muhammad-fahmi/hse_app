import { db } from "@/db";
import { reports, locations, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import StatusUpdater from "./status-updater";

export default async function ReportDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Session error:", error);
  }

  if (!session) {
    redirect("/login");
  }

  const reportId = params.id;
  let report = null;

  try {
    const [fetched] = await db
      .select({
        id: reports.id,
        description: reports.description,
        status: reports.status,
        created_at: reports.created_at,
        location_name: locations.name,
        handled_by_name: user.name,
      })
      .from(reports)
      .leftJoin(locations, eq(reports.location_id, locations.id))
      .leftJoin(user, eq(reports.handled_by, user.id))
      .where(eq(reports.id, reportId));
    report = fetched;
  } catch (error) {
    console.error("DB error:", error);
  }

  if (!report) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Report Details</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6 border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Location</p>
              <p className="text-lg font-semibold">{report.location_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Date Reported</p>
              <p className="text-lg font-semibold">{new Date(report.created_at || "").toLocaleString()}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Issue Description</p>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md text-gray-800 dark:text-gray-200">
              {report.description}
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Handled By</p>
              <p className="font-medium">{report.handled_by_name || "Unassigned"}</p>
            </div>
            
            <div className="w-64">
              <p className="text-sm text-gray-500 font-medium mb-1">Update Status</p>
              <StatusUpdater reportId={report.id} initialStatus={report.status} userId={session.user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
