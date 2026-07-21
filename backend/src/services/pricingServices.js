import { db } from '../db/index.js';
import { venuesTable } from '../models/venueModel.js';
import { findMatchingRow, classifyDay } from '../utils/utils.js';
import { eq } from 'drizzle-orm';

export default {
  priceCalc: async function (venueId, startDate, endDate, startTime, endTime) {
    const venue = await db.query.venuesTable.findFirst({
      where: eq(venuesTable.id, venueId),
      with: {
        pricing: true,
      },
    });

    if (!venue) throw new Error('Venue not found')

    const bookingType = venue.bookingType;

    if ((bookingType === 'daily')) {
      const dates = [];
      const current = new Date(startDate);
      const end = new Date(endDate);

      while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }

      const breakdown = dates.map((date) => {
        const dayType = classifyDay(date);
        console.log(venue,"gggggggggggggggggggggggggggggg")
        const pricingRow = findMatchingRow(venue.pricing, dayType);
        console.log(dayType,venue,pricingRow,"pricingRowpricingRow")
        return { date, dayType, amount: parseFloat(pricingRow.price) };
      });
      const totalAmount = breakdown.reduce((sum, d) => sum + d.amount, 0);
      return {venue, breakdown, totalAmount };
    }

    if ((bookingType === 'hourly')) {
      const [startH, startM] = startTime.split(':').map(Number); // [9, 0]
      const [endH, endM] = endTime.split(':').map(Number); // [14, 0]
      const dayType = classifyDay(startDate);
      const hours = endH + endM / 60 - (startH + startM / 60);
      const pricingRow = findMatchingRow(venue.pricing, dayType);
      const amount = hours * parseFloat (pricingRow.price);
      return {venue, breakdown: [{ date: startDate, hours, dayType, amount }], totalAmount: amount };
    }
  },
};
