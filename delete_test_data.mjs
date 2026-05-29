import { createClient } from "@libsql/client/web";

async function deleteTestData() {
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

  console.log("Menghapus data laporan testing...");

  try {
    const selectResult = await client.execute("SELECT id, description FROM reports");
    console.log("Semua Laporan:", selectResult.rows);

    // Delete reports where description contains [LOAD TEST
    const result = await client.execute({
      sql: "DELETE FROM reports WHERE description LIKE '%[LOAD TEST %'",
      args: []
    });

    console.log(`✅ Sukses! ${result.rowsAffected} laporan testing telah dihapus dari database.`);
  } catch (error) {
    console.error("❌ Gagal menghapus data:", error);
  }

  process.exit(0);
}

deleteTestData();
