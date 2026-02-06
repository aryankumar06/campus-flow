
import "dotenv/config";
import { db } from "./lib/db";

async function main() {
    const email = "workingforaarav@gmail.com";
    console.log(`Checking ${email}...`);
    const user = await db.user.findUnique({ where: { email } });

    if (user) {
        console.log("User verified.");
        console.log("Role:", user.role);
        console.log("Approved:", user.isApproved);
        console.log("CollegeId:", user.collegeId); // Should be NULL now
    } else {
        console.log("User NOT FOUND");
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await db.$disconnect();
    });
