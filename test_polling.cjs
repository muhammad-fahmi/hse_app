const https = require("https");
const { spawn } = require("child_process");

let prevId = null;
let pollCount = 0;

function poll() {
  https.get("https://hse-app-nine.vercel.app/api/latest-report", {
    headers: {
      "Cache-Control": "no-cache",
      "Pragma": "no-cache"
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log(`[Poll ${++pollCount}] Latest ID: ${json.id}`);
        
        if (prevId && json.id !== prevId) {
          console.log(`\n🚨 BINGO! DATA BERUBAH SECARA REAL-TIME! 🚨`);
          console.log(`ID Lama: ${prevId}`);
          console.log(`ID Baru: ${json.id}\n`);
          process.exit(0);
        }
        prevId = json.id;
      } catch (e) {
        console.error("Parse error:", data);
      }
    });
  });
}

console.log("Mulai polling API Vercel setiap 3 detik...");
poll();
const interval = setInterval(poll, 3000);

// Setela 5 detik berjalan normal, kita suntikkan 10 data
setTimeout(() => {
  console.log("\n>>> MENYUNTIKKAN 10 LAPORAN DARI BACKGROUND... <<<");
  const loadTest = spawn("node", ["--env-file=.env.local", "test_load.mjs"]);
  
  loadTest.stdout.on("data", data => console.log(data.toString().trim()));
}, 5000);

setTimeout(() => {
  console.log("Waktu tunggu habis (20 detik). Menghentikan test.");
  process.exit(1);
}, 20000);
