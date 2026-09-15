import cron from "node-cron";
import BuyingPool from "../modules/buyingPools/buyingPool.model.js";
import { autoReleaseExpiredSettlements } from "../modules/settlements/settlement.service.js";

const startCronJobs = () => {
    // Run every 1 minute to check for expired pools and 48h settlement release
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();
            
            // 1. Close expired pools
            const result = await BuyingPool.updateMany(
                { status: "OPEN", closeAt: { $lte: now } },
                { $set: { status: "CLOSED" } }
            );

            if (result.modifiedCount > 0) {
                console.log(`[CronJob] Successfully closed ${result.modifiedCount} expired buying pool(s).`);
            }

            // 2. Auto-release 48-hour settlements
            const releasedCount = await autoReleaseExpiredSettlements();
            if (releasedCount > 0) {
                console.log(`[CronJob] Successfully released ${releasedCount} eligible settlement(s) after 48h protection period.`);
            }
        } catch (error) {
            console.error("[CronJob] Error running background tasks:", error);
        }
    });

    console.log("[CronJob] Background tasks scheduled (BuyingPool expiry checker & Settlement release).");
};

export default startCronJobs;
