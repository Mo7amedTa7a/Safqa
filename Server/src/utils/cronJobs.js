import cron from "node-cron";
import BuyingPool from "../modules/buyingPools/buyingPool.model.js";

const startCronJobs = () => {
    // Run every 1 minute to check for expired pools (testing mode)
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();
            
            // Find all OPEN pools where the deadline (closeAt) has passed,
            // and automatically set their status to CLOSED.
            const result = await BuyingPool.updateMany(
                { status: "OPEN", closeAt: { $lte: now } },
                { $set: { status: "CLOSED" } }
            );

            if (result.modifiedCount > 0) {
                console.log(`[CronJob] Successfully closed ${result.modifiedCount} expired buying pool(s).`);
            }
        } catch (error) {
            console.error("[CronJob] Error closing expired pools:", error);
        }
    });

    console.log("[CronJob] Background tasks scheduled (BuyingPool expiry checker).");
};

export default startCronJobs;
