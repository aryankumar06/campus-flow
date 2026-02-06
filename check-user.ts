
import "dotenv/config";
import { db } from "./lib/db";

async function main() {
    const email = "workingforaarav@gmail.com";
    const user = await db.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log("User NOT FOUND");
    } else {
        console.log("User found:", user);
        console.log("Approved:", user.isApproved);
        console.log("Role:", user.role);
        console.log("Password Hash:", user.password.substring(0, 10) + "...");
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await db.$disconnect();
    });
