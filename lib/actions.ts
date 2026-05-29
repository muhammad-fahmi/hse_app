"use server";

import { db } from "@/db";
import { locations, reports } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { eventEmitter } from "./events";

export async function createReport(data: { location_id: string; description: string }) {
  const newId = crypto.randomUUID();
  await db.insert(reports).values({
    id: newId,
    location_id: data.location_id,
    description: data.description,
    status: "BARU",
    created_at: new Date(),
  });
  
  eventEmitter.emit("new_report", {
    id: newId,
    location_id: data.location_id,
    description: data.description,
  });
  
  revalidatePath("/admin");
}

export async function getReports() {
  const allReports = await db
    .select({
      id: reports.id,
      description: reports.description,
      status: reports.status,
      created_at: reports.created_at,
      location_name: locations.name,
      location_id: locations.id,
    })
    .from(reports)
    .leftJoin(locations, eq(reports.location_id, locations.id))
    .orderBy(desc(reports.created_at));
  return allReports;
}

export async function updateReportStatus(reportId: string, status: string, handlerId: string) {
  await db
    .update(reports)
    .set({ status, handled_by: handlerId })
    .where(eq(reports.id, reportId));
  revalidatePath("/admin");
}

export async function getLocations() {
  return db.select().from(locations);
}

export async function createLocation(name: string) {
  await db.insert(locations).values({
    id: crypto.randomUUID(),
    name,
    qr_code_id: crypto.randomUUID(),
  });
  revalidatePath("/admin/locations");
}
