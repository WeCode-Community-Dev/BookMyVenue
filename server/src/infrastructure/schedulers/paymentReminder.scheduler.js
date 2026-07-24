import cron from "node-cron";
import { iUserPaymentReminderUsecase } from "../../presentation/controllers/di.js";

cron.schedule("0 9 * * *", async () => {
    try {
        await iUserPaymentReminderUsecase.execute();
    } catch (error) {
        console.error("Payment reminder scheduler failed:", error);
    }
});