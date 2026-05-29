import { createClient } from "@libsql/client/web";

async function clearReports() {
  const dbUrl = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (!dbUrl || !authToken) {
    console.error("Missing DATABASE_URL or DATABASE_AUTH_TOKEN in env vars");
    process.exit(1);
  }

  const client = createClient({
    url: dbUrl,
    authToken: authToken,
  });

  console.log("Menghapus semua laporan dari database...");

  try {
    const result = await client.execute("DELETE FROM reports");
    console.log(`✅ Sukses! ${result.rowsAffected} laporan telah dibersihkan.`);
  } catch (error) {
    console.error("❌ Gagal menghapus laporan:", error);
  }

  process.exit(0);
}

clearReports();
