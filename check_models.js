const https = require('https');

const API_KEY = "AIzaSyDKt83FqgALBGlLDR_gt2yVrE01qh7FYdE";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("Checking models...");

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.models) {
        console.log("--- AVAILABLE MODELS ---");
        json.models.forEach(m => {
          console.log(m.name);
        });
        console.log("------------------------");
      } else {
        console.log("ERROR: No models found or API Error");
        console.log(JSON.stringify(json, null, 2));
      }
    } catch (e) {
      console.error("Parse Error:", e);
      console.log("Raw Data:", data);
    }
  });
}).on('error', (e) => {
  console.error("Network Error:", e);
});
