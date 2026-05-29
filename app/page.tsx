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
import AdminShell from "@/components/admin-shell";
import { AlertCircle, CheckCircle2, Clock, ListFilter, Plus, TrendingUp } from "lucide-react";

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

  const stats = [
    { 
      label: "Total Reports", 
      value: reports.length, 
      icon: ListFilter, 
      color: "text-blue-500",
      bg: "bg-blue-500/10" 
    },
    { 
      label: "New Issues", 
      value: reports.filter(r => r.status === "BARU").length, 
      icon: AlertCircle, 
      color: "text-red-500",
      bg: "bg-red-500/10"
    },
    { 
      label: "In Progress", 
      value: reports.filter(r => r.status === "PROSES").length, 
      icon: Clock, 
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    { 
      label: "Resolved", 
      value: reports.filter(r => r.status === "SELESAI").length, 
      icon: CheckCircle2, 
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
  ];

  return (
    <AdminShell userName={session.user.name}>
      <RealTimeNotifications latestReportId={reports.length > 0 ? reports[0].id : undefined} />
      
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="glass border-none shadow-sm card-hover overflow-hidden relative">
              <div className={stat.bg + " absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-8 -mt-8 opacity-20 transition-transform group-hover:scale-110"} />
              <CardHeader className="pb-2">
                <stat.icon className={stat.color + " w-5 h-5"} />
                <CardTitle className="text-sm font-medium text-muted-foreground pt-2">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Section */}
        <Card className="glass border-none shadow-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-secondary/20 px-6 py-4">
            <div>
              <CardTitle className="text-lg font-semibold">Incident Reports</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Real-time safety and health reports from all locations.</p>
            </div>
            <Link href="/admin/locations">
              <Button size="sm" className="rounded-full gap-2">
                <Plus className="w-4 h-4" /> Add Location
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/10">
                  <TableRow>
                    <TableHead className="px-6">Reported At</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right px-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-secondary/20 transition-colors">
                      <TableCell className="px-6 font-medium whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>{new Date(report.created_at || "").toLocaleDateString()}</span>
                          <span className="text-[10px] text-muted-foreground italic">
                            {new Date(report.created_at || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-secondary/50 font-medium">
                          {report.location_name}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate hidden md:table-cell text-muted-foreground">
                        {report.description}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={cn(
                            "rounded-full px-3 py-0.5 text-[10px] font-bold uppercase",
                            report.status === "BARU" ? "bg-red-500 hover:bg-red-600" : 
                            report.status === "PROSES" ? "bg-amber-500 hover:bg-amber-600" : 
                            "bg-green-500 hover:bg-green-600"
                          )}
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-6">
                        <Link href={`/admin/reports/${report.id}`}>
                          <Button size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-colors">
                            View Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {reports.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-16">
                        <div className="flex flex-col items-center gap-2">
                          <Clock className="w-8 h-8 opacity-20" />
                          <p>No reports found in the system.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
