const mongoose = require("mongoose");
const SlotTemplates = require("../models/slotTemplate");
const BookableUnits = require("../models/bookableUnit");
const toDateKey = require("../utils/dateKey");

const MATERIALIZATION_WINDOW_DAYS = 90;

function resolveInstant(date, minutesSinceMidnight) {
   const instant = new Date(date);
   instant.setHours(0, minutesSinceMidnight, 0, 0);
   return instant;
}

// Core read+insert logic, run against a given session. Returns the
// count of units created. Throws on any failure — the caller's transaction
// (started either here or by an outer caller) rolls back everything.
async function runMaterialization(venueId, session) {
   const slotTemplates = await SlotTemplates.find({
      venue: venueId,
      isActive: true,
      deletedAt: null,
   }).session(session).lean();

   if (slotTemplates.length === 0) return { created: 0 };

   const today = new Date();
   today.setHours(0, 0, 0, 0);

   const dateKeys = [];
   for (let i = 0; i < MATERIALIZATION_WINDOW_DAYS; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dateKeys.push(toDateKey(date));
   }

   const existingUnits = await BookableUnits.find({ venue: venueId })
      .select("slotTemplate unitDate")
      .session(session)
      .lean();
   const existingKeys = new Set(
      existingUnits.map((u) => `${u.slotTemplate}_${u.unitDate}`)
   );

   const toInsert = [];
   for (const template of slotTemplates) {
      for (const dateKey of dateKeys) {
         const key = `${template._id}_${dateKey}`;
         if (existingKeys.has(key)) continue;

         const [year, month, day] = dateKey.split("-").map(Number);
         const dateForInstant = new Date(year, month - 1, day);

         toInsert.push({
            venue: venueId,
            slotTemplate: template._id,
            unitDate: dateKey,
            startAt: resolveInstant(dateForInstant, template.startTime),
            endAt: resolveInstant(dateForInstant, template.endTime),
            status: "AVAILABLE",
         });
      }
   }

   if (toInsert.length === 0) return { created: 0 };

   await BookableUnits.insertMany(toInsert, { ordered: false, session });

   return { created: toInsert.length };
}

// Ensures every active SlotTemplate on this venue has a materialized
// BookableUnit for each date in the next MATERIALIZATION_WINDOW_DAYS days
// (including today). Safe to re-run — only creates units that don't exist yet.
// Atomic per venue: either every unit in this pass is created, or none
// are.
//
// Pass `session` to participate in a caller's transaction (e.g. slot creation
// atomically materializing its own units alongside the new SlotTemplate). If
// no session is passed, this function opens and manages its own transaction.
async function materializeVenueAvailability(venueId, session = null) {
   if (session) {
      return runMaterialization(venueId, session);
   }

   const ownSession = await mongoose.startSession();
   let result;
   try {
      await ownSession.withTransaction(async () => {
         result = await runMaterialization(venueId, ownSession);
      });
   } finally {
      await ownSession.endSession();
   }
   return result;
}

module.exports = { materializeVenueAvailability, MATERIALIZATION_WINDOW_DAYS };
