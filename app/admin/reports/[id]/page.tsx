import { db } from "@/db";
import { reports, locations, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminShell from "@/components/admin-shell";
import StatusUpdater from "./status-updater";
import { Calendar, MapPin, User, FileText, Info } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <AdminShell userName={session.user.name}>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card className="glass border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-secondary/20 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="text-primary w-5 h-5" /> Report Description
                  </CardTitle>
                  <CardDescription>Full details of the incident.</CardDescription>
                </div>
                <Badge 
                  className={cn(
                    "rounded-full px-4 py-1 font-bold uppercase text-[10px]",
                    report.status === "BARU" ? "bg-red-500" : 
                    report.status === "PROSES" ? "bg-amber-500" : 
                    "bg-green-500"
                  )}
                >
                  {report.status}
                </Badge>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose prose-sm dark:prose-invert max-w-none bg-secondary/10 p-6 rounded-2xl border border-secondary/20 min-h-[150px] leading-relaxed italic text-foreground">
                  "{report.description}"
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="glass border-none shadow-md p-6 flex flex-col gap-3">
                <div className="bg-blue-500/10 w-10 h-10 rounded-full flex items-center justify-center text-blue-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Location</p>
                  <p className="text-lg font-black">{report.location_name}</p>
                </div>
              </Card>
              <Card className="glass border-none shadow-md p-6 flex flex-col gap-3">
                <div className="bg-purple-500/10 w-10 h-10 rounded-full flex items-center justify-center text-purple-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Date Reported</p>
                  <p className="text-lg font-black">{new Date(report.created_at || "").toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground font-medium">{new Date(report.created_at || "").toLocaleTimeString()}</p>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="glass border-none shadow-xl sticky top-24 overflow-hidden">
              <CardHeader className="bg-secondary/30 border-b">
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" /> Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Handling Officer</p>
                    <div className="flex items-center gap-3 bg-secondary/20 p-3 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {report.handled_by_name?.charAt(0) || "U"}
                      </div>
                      <span className="font-semibold">{report.handled_by_name || "Waiting for Officer"}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-3">Update Progress</p>
                    <StatusUpdater reportId={report.id} initialStatus={report.status} userId={session.user.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
