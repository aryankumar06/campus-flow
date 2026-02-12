
import "dotenv/config";
import { db } from "./lib/db";

async function main() {
    const users = await db.user.findMany();
    const map = new Map();

    for (const u of users) {
        if (!u.collegeId) continue;
        const ids = map.get(u.collegeId) || [];
        ids.push(u);
        map.set(u.collegeId, ids);
    }

    for (const [cid, list] of map.entries()) {
        if (list.length > 1) {
            console.log(`Duplicate Key '${cid}' found for ${list.length} users: ${list.map((u: any) => u.email).join(', ')}`);

            // Keep the first one, nullify others
            for (let i = 1; i < list.length; i++) {
                const u = list[i];
                console.log(`  -> Nullifying ${u.email}`);
                await db.user.update({
                    where: { id: u.id },
                    data: { collegeId: null }
                });
            }
        }
    }
    console.log("Duplicate check complete.");
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await db.$disconnect();
    });
