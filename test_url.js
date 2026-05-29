const https = require('https');

https.get('https://hse-app-nine.vercel.app/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('Body:', data);
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
