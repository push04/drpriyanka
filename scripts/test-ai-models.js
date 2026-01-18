const https = require('https');
const fs = require('fs');
const path = require('path');

// Models to test (From User Request + Research)
const models = [
    "xiaomi/mimo-v2-flash",
    "deepseek/deepseek-r1-0528",
    "google/gemma-3-27b-it",
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/devstral-2-2512",
    "qwen/qwen-3-coder-480b-a35b-instruct",
    "google/gemini-2.0-flash-exp:free"
];

// Read API Key from .env.local
let apiKey = "";
try {
    const envPath = path.join(__dirname, '../.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/OPENROUTER_API_KEY=(sk-or-v1-[a-zA-Z0-9]+)/);
    if (match && match[1]) {
        apiKey = match[1];
    } else {
        // Fallback or ask user
        console.error("Could not find OPENROUTER_API_KEY in .env.local");
        process.exit(1);
    }
} catch (e) {
    console.error("Error reading .env.local:", e.message);
    process.exit(1);
}

async function testModel(modelName) {
    return new Promise((resolve) => {
        const data = JSON.stringify({
            model: modelName,
            messages: [{ role: "user", content: "Say 'Test OK' if you can hear me." }]
        });

        const options = {
            hostname: 'openrouter.ai',
            path: '/api/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://drpriyankaclinic.com',
                'X-Title': 'ModelTest'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ [SUCCESS] ${modelName}`);
                    resolve({ model: modelName, status: 'OK' });
                } else {
                    console.log(`❌ [FAILED]  ${modelName} - Status: ${res.statusCode}`);
                    // Try to parse error
                    try {
                        const err = JSON.parse(body);
                        if (err.error && err.error.message) {
                            console.log(`   Reason: ${err.error.message.substring(0, 100)}...`);
                        }
                    } catch (e) { console.log(`   Raw: ${body.substring(0, 50)}...`); }
                    resolve({ model: modelName, status: res.statusCode });
                }
            });
        });

        req.on('error', (e) => {
            console.log(`❌ [ERROR]   ${modelName} - ${e.message}`);
            resolve({ model: modelName, status: 'ERROR' });
        });

        req.write(data);
        req.end();
    });
}

async function runTests() {
    console.log("🔍 Testing AI Models Connectivity & Rate Limits...\n");
    for (const model of models) {
        await testModel(model);
        // Small delay to avoid self-imposed rate limits
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log("\nDone.");
}

runTests();
