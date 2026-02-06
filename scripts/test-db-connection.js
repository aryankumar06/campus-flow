const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Manually parse .env since we might not have dotenv installed
try {
    const envPath = path.join(process.cwd(), '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    for (const line of envFile.split('\n')) {
        const [key, value] = line.split('=');
        if (key && value && key.trim() === 'DATABASE_URL') {
            process.env.DATABASE_URL = value.trim().replace(/"/g, ''); // Remove quotes if any
            break;
        }
    }
} catch (e) {
    console.error("Could not read .env file:", e);
}

const url = process.env.DATABASE_URL;
console.log("-----------------------------------------");
console.log("DIAGNOSTIC DB TEST");
console.log("URL Found:", url ? "Yes" : "No");
if (url) console.log("URL Preview:", url.substring(0, 15) + "...");

if (!url) {
    console.error("ERROR: No DATABASE_URL found in .env");
    process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
    console.log("Attempting to connect with PrismaClient...");
    try {
        await prisma.$connect();
        console.log("✅ SUCCESS: PrismaClient connected to the database!");

        console.log("Checking for User table...");
        const count = await prisma.user.count();
        console.log("✅ SUCCESS: User table accessed. User count:", count);

    } catch (error) {
        console.error("❌ ERROR: Connection failed.");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
