import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getReports } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RealTimeNotifications from "@/components/real-time-notifications";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  let session = null;
  let reports: any[] = [];

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
    reports = await getReports();
  } catch (error) {
    console.error("Session or DB error:", error);
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <RealTimeNotifications latestReportId={reports.length > 0 ? reports[0].id : undefined} />
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">SHE Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome, {session.user.name}</span>
            <Link href="/admin/locations">
              <Button variant="outline">Manage Locations</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Incident Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{new Date(report.created_at || "").toLocaleString()}</TableCell>
                    <TableCell>{report.location_name}</TableCell>
                    <TableCell className="max-w-xs truncate">{report.description}</TableCell>
                    <TableCell>
                      <Badge variant={report.status === "BARU" ? "destructive" : report.status === "PROSES" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/reports/${report.id}`}>
                        <Button size="sm" variant="ghost">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {reports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      No reports found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
