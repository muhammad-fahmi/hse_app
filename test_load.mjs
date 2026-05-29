import { createClient } from "@libsql/client/web";

async function runTest() {
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

  const qrCodeId = "9b46d73d-3a3a-48bb-9dd4-c14e68eb3cff";
  console.log(`Starting load test for QR Code ID: ${qrCodeId}...`);

  try {
    // 1. Get the location internal ID
    const locResult = await client.execute({
      sql: 'SELECT id, name FROM locations WHERE qr_code_id = ?',
      args: [qrCodeId]
    });

    if (locResult.rows.length === 0) {
      console.error(`Location with QR code ${qrCodeId} not found in database!`);
      process.exit(1);
    }

    const locationId = locResult.rows[0].id;
    const locationName = locResult.rows[0].name;
    console.log(`Found location: ${locationName} (ID: ${locationId})`);

    // 2. Prepare 10 concurrent requests
    console.log("Preparing to send 10 concurrent reports...");
    
    const promises = [];
    for (let i = 1; i <= 10; i++) {
      const description = `[LOAD TEST ${i}/10] Pipa air bocor skala besar di area ini! Ditemukan pada ${new Date().toISOString()}`;
      const newId = crypto.randomUUID();
      const createdAt = Math.floor(Date.now() / 1000); // unixepoch
      
      const promise = client.execute({
        sql: 'INSERT INTO reports (id, location_id, description, status, created_at) VALUES (?, ?, ?, ?, ?)',
        args: [newId, locationId, description, 'BARU', createdAt]
      });
      promises.push(promise);
    }

    const startTime = Date.now();
    await Promise.all(promises);
    const endTime = Date.now();

    console.log(`✅ Success! 10 reports inserted concurrently in ${endTime - startTime}ms.`);
    console.log(`Silakan cek Vercel Dashboard Anda sekarang. Alarm seharusnya berbunyi dan laporan akan muncul seketika!`);

  } catch (error) {
    console.error("❌ Test failed:", error);
  }

  process.exit(0);
}

runTest();
