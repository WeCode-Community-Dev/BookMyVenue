const mongoose = require("mongoose");
const Venues = require("../../models/venue");
const BookableUnits = require("../../models/bookableUnit");
const { PUBLIC_VENUE_FILTER } = require("./shared");
const { MATERIALIZATION_WINDOW_DAYS } = require("../../services/materializeVenueAvailability");
const toDateKey = require("../../utils/dateKey");

const DEFAULT_RANGE_DAYS = 35;

function isValidDateKey(value) {
   return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

// GET /venues/:id/availability?dateFrom&dateTo — public, APPROVED venues only.
// Returns materialized BookableUnits in [dateFrom, dateTo] (inclusive),
// enriched with each unit's slot label and current price.
async function getVenueAvailability(req, res) {
   try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ message: "Invalid venue id" });
      }

      const venue = await Venues.findOne({ _id: id, ...PUBLIC_VENUE_FILTER })
         .select("_id")
         .lean();
      if (!venue) {
         return res.status(404).json({ message: "Venue not found" });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + MATERIALIZATION_WINDOW_DAYS - 1);
      const maxDateKey = toDateKey(maxDate);

      const defaultToDate = new Date(today);
      defaultToDate.setDate(defaultToDate.getDate() + DEFAULT_RANGE_DAYS - 1);

      const { dateFrom, dateTo } = req.query;

      if (dateFrom !== undefined && !isValidDateKey(dateFrom)) {
         return res.status(400).json({ message: "dateFrom must be in YYYY-MM-DD format" });
      }
      if (dateTo !== undefined && !isValidDateKey(dateTo)) {
         return res.status(400).json({ message: "dateTo must be in YYYY-MM-DD format" });
      }

      const rangeFrom = dateFrom || toDateKey(today);
      const rangeTo = dateTo || toDateKey(defaultToDate);

      if (rangeFrom > rangeTo) {
         return res.status(400).json({ message: "dateFrom must not be after dateTo" });
      }
      if (rangeTo > maxDateKey) {
         return res.status(400).json({
            message: `dateTo must not be more than ${MATERIALIZATION_WINDOW_DAYS} days from today`,
         });
      }

      const units = await BookableUnits.find({
         venue: id,
         unitDate: { $gte: rangeFrom, $lte: rangeTo },
      })
         .populate({ path: "slotTemplate", select: "label price" })
         .sort({ unitDate: 1, startAt: 1 })
         .lean();

      const data = units
         .filter((unit) => unit.slotTemplate)
         .map((unit) => ({
            id: unit._id,
            venue: unit.venue,
            slotTemplateId: unit.slotTemplate._id,
            slotLabel: unit.slotTemplate.label,
            price: unit.slotTemplate.price,
            unitDate: unit.unitDate,
            startAt: unit.startAt,
            endAt: unit.endAt,
            status: unit.status,
         }));

      return res.status(200).json({ data });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to fetch availability" });
   }
}

module.exports = getVenueAvailability;
