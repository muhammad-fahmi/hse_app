import { db } from "@/db";
import { reports } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [report] = await db
      .select({ id: reports.id })
      .from(reports)
      .orderBy(desc(reports.created_at));
      
    return NextResponse.json({ id: report?.id || null }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    return NextResponse.json({ id: null }, { status: 500 });
  }
}
