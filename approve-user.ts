
import "dotenv/config";
import { db } from "./lib/db";

async function main() {
    const email = "workingforaarav@gmail.com";
    console.log(`Approving ${email}...`);
    const user = await db.user.update({
        where: { email },
        data: { isApproved: true }
    });
    console.log("User approved:", user.isApproved);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await db.$disconnect();
    });
