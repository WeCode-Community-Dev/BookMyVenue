const cron = require("node-cron");
const SlotTemplates = require("../models/slotTemplate");
const { materializeVenueAvailability } = require("../services/materializeVenueAvailability");

// Runs the materialization pass for every venue that has at least one active
// slot template. Safe to call directly as well
// as from the scheduled cron job below. One venue's failure is logged and
// skipped rather than aborting the rest of the run.
async function materializeAllVenues() {
   const venueIds = await SlotTemplates.distinct("venue", {
      isActive: true,
      deletedAt: null,
   });

   const results = [];
   for (const venueId of venueIds) {
      try {
         const { created } = await materializeVenueAvailability(venueId);
         results.push({ venueId, status: "success", created });
         console.log(`[materializeAvailability] venue ${venueId}: created ${created} unit(s)`);
      } catch (err) {
         results.push({ venueId, status: "failed", error: err.message });
         console.error(`[materializeAvailability] venue ${venueId}: failed — ${err.message}`);
      }
   }

   const succeeded = results.filter((r) => r.status === "success");
   const failed = results.filter((r) => r.status === "failed");
   const totalCreated = succeeded.reduce((sum, r) => sum + r.created, 0);

   console.log(
      `[materializeAvailability] run complete: ${succeeded.length} succeeded, ${failed.length} failed, ${totalCreated} unit(s) created`
   );

   return { results, venuesProcessed: venueIds.length, succeeded: succeeded.length, failed: failed.length, created: totalCreated };
}

// Runs once daily at midnight server time.
function scheduleMaterializationJob() {
   cron.schedule("0 0 * * *", () => {
      materializeAllVenues().catch((err) => {
         console.error("[materializeAvailability] job failed:", err.message);
      });
   });
}

module.exports = { scheduleMaterializationJob };
