import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getLocations } from "@/lib/actions";
import LocationManager from "./location-manager";
import AdminShell from "@/components/admin-shell";

export default async function LocationsPage() {
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

  const locations = await getLocations();

  return (
    <AdminShell userName={session.user.name}>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <LocationManager initialLocations={locations} />
      </div>
    </AdminShell>
  );
}
