import { query } from '../db.js';

/**
 * @desc    Get all bookings related to the authenticated user
 * @route   GET /api/bookings
 * @access  Private (User sees their own bookings; Venue Owner sees bookings for their venues)
 */
export const getBookings = async (req, res) => {
  const { id, role } = req.user;

  try {
    let result;
    if (role === 'venue_owner') {
      // Host sees bookings for their own venues
      result = await query(`
        SELECT 
          b.id,
          b.venue_id AS "venueId",
          v.title AS "venueTitle",
          v.location AS "venueLocation",
          v.full_address AS "fullAddress",
          v.latitude,
          v.longitude,
          v.images[1] AS "venueImage",
          b.start_date AS "startDate",
          b.end_date AS "endDate",
          b.guests,
          b.total_price AS "totalPrice",
          b.status,
          b.booking_date AS "bookingDate",
          b.payment_status AS "paymentStatus",
          COALESCE(b.renter_name, u.name) AS "renterName",
          COALESCE(b.renter_email, u.email) AS "renterEmail",
          b.renter_phone AS "renterPhone",
          h.name AS "hostName",
          h.email AS "hostMail",
          b.check_in_instructions AS "checkInInstructions",
          v.booking_type AS "venueBookingType",
          v.cleaning_gap AS "venueCleaningGap",
          v.opening_time AS "venueOpeningTime",
          v.closing_time AS "venueClosingTime",
          b.booking_type AS "bookingType",
          b.refund_amount AS "refundAmount",
          b.refund_percentage AS "refundPercentage"
        FROM bookings b
        JOIN venues v ON b.venue_id = v.id
        JOIN users h ON v.host_id = h.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE h.id = $1
        ORDER BY b.created_at DESC
      `, [id]);
    } else {
      // Regular user sees bookings they have made
      result = await query(`
        SELECT 
          b.id,
          b.venue_id AS "venueId",
          v.title AS "venueTitle",
          v.location AS "venueLocation",
          v.full_address AS "fullAddress",
          v.latitude,
          v.longitude,
          v.images[1] AS "venueImage",
          b.start_date AS "startDate",
          b.end_date AS "endDate",
          b.guests,
          b.total_price AS "totalPrice",
          b.status,
          b.booking_date AS "bookingDate",
          b.payment_status AS "paymentStatus",
          h.name AS "hostName",
          h.email AS "hostMail",
          b.check_in_instructions AS "checkInInstructions",
          COALESCE(b.renter_name, u.name) AS "renterName",
          b.renter_phone AS "renterPhone",
          COALESCE(b.renter_email, u.email) AS "renterEmail",
          v.booking_type AS "venueBookingType",
          v.cleaning_gap AS "venueCleaningGap",
          v.opening_time AS "venueOpeningTime",
          v.closing_time AS "venueClosingTime",
          b.booking_type AS "bookingType",
          b.refund_amount AS "refundAmount",
          b.refund_percentage AS "refundPercentage"
        FROM bookings b
        JOIN venues v ON b.venue_id = v.id
        JOIN users h ON v.host_id = h.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.user_id = $1
        ORDER BY b.created_at DESC
      `, [id]);
    }

    const mappedBookings = result.rows.map(row => ({
      ...row,
      latitude: row.latitude !== null && row.latitude !== undefined ? Number(row.latitude) : null,
      longitude: row.longitude !== null && row.longitude !== undefined ? Number(row.longitude) : null,
    }));

    res.json(mappedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

/**
 * @desc    Create a new booking inquiry
 * @route   POST /api/bookings
 * @access  Private (User role only; enforces 30-day limits & operating hour constraints)
 */
export const createBooking = async (req, res) => {
  const { venueId, startDate, endDate, guests, totalPrice, renterName, renterPhone, renterEmail } = req.body;
  const user_id = req.user.id;

  try {
    if (!venueId || !startDate || !endDate || !guests || !totalPrice || !renterName || !renterPhone || !renterEmail) {
      return res.status(400).json({ message: 'Please provide all required booking fields (including contact name, phone, and email)' });
    }

    // Check if venue exists
    const venueRes = await query('SELECT * FROM venues WHERE id = $1', [venueId]);
    if (venueRes.rows.length === 0) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    const venue = venueRes.rows[0];

    // Validate 30-day booking limit for web bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (venue.booking_type !== 'hours') {
      start.setHours(0, 0, 0, 0);
      end.setHours(12, 0, 0, 0);
    }
    
    const maxAllowed = new Date(today);
    maxAllowed.setDate(today.getDate() + 30);
    maxAllowed.setHours(23, 59, 59, 999);

    if (start < today) {
      return res.status(400).json({ message: 'Booking time cannot be in the past.' });
    }
    if (end <= start) {
      return res.status(400).json({ message: 'End time must be after start time.' });
    }
    if (start > maxAllowed || end > maxAllowed) {
      const formattedLimit = maxAllowed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return res.status(400).json({ 
        message: `Web bookings are only allowed for dates within 30 days from today (up to ${formattedLimit}). Please contact the host directly to make an offline booking.` 
      });
    }

    // Operating hours check for hours-based booking
    if (venue.booking_type === 'hours') {
      const getMinutesOfDay = (d) => d.getHours() * 60 + d.getMinutes();
      const parseTimeStr = (tStr) => {
        if (!tStr) return 0;
        const [h, m] = tStr.split(':').map(Number);
        return h * 60 + m;
      };

      const startMinutes = getMinutesOfDay(start);
      const endMinutes = getMinutesOfDay(end);
      const openMinutes = parseTimeStr(venue.opening_time || '08:00');
      const closeMinutes = parseTimeStr(venue.closing_time || '22:00');

      if (startMinutes < openMinutes || endMinutes > closeMinutes) {
        return res.status(400).json({
          message: `Booking must be within operating hours: ${venue.opening_time || '08:00'} - ${venue.closing_time || '22:00'}.`
        });
      }
    }

    // Schedule overlap conflict validation
    const existingBookings = await query(`
      SELECT start_date, end_date, blocked_end_date FROM bookings 
      WHERE venue_id = $1 AND status != 'cancelled'
    `, [venueId]);

    const cleaningGap = Number(venue.cleaning_gap || 0);
    let blockedEndDate;
    if (venue.booking_type === 'hours') {
      blockedEndDate = new Date(end.getTime() + cleaningGap * 60 * 60 * 1000);
    } else {
      blockedEndDate = new Date(end.getTime() + 12 * 60 * 60 * 1000 + cleaningGap * 24 * 60 * 60 * 1000);
    }

    const hasOverlap = existingBookings.rows.some(b => {
      const bStart = new Date(b.start_date);
      const bEnd = new Date(b.end_date);
      const bBlockedEnd = new Date(b.blocked_end_date);
      
      if (venue.booking_type === 'hours') {
        const gapHours = Number(venue.cleaning_gap || 0);
        const limitNewEnd = new Date(end.getTime() + gapHours * 60 * 60 * 1000);
        const limitExistingEnd = new Date(bEnd.getTime() + gapHours * 60 * 60 * 1000);
        
        return start < limitExistingEnd && bStart < limitNewEnd;
      } else {
        return start < bBlockedEnd && bStart < blockedEndDate;
      }
    });

    if (hasOverlap) {
      return res.status(400).json({ 
        message: venue.booking_type === 'hours'
          ? 'The selected time range conflicts with an existing booking or its cleaning gap block.'
          : 'The selected dates conflict with an existing booking.'
      });
    }

    // Generate BKG-XXXX ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `BKG-${randomNum}`;

    const checkInCode = Math.floor(1000 + Math.random() * 9000);
    const checkInInstructions = venue.booking_type === 'hours'
      ? `Secure entry code: #${checkInCode}. Welcome to ${venue.title}! Please check in and out according to your reserved hours.`
      : `Secure entry code: #${checkInCode}. Welcome to ${venue.title}! Check-in starts at 12:00 AM (midnight) on your start date, and check-out is by 12:00 PM (noon) on your end date.`;

    try {
      await query('BEGIN');

      const result = await query(`
        INSERT INTO bookings (
          id, venue_id, user_id, start_date, end_date, blocked_end_date, cleaning_gap, guests, total_price, status, payment_status, check_in_instructions, renter_name, renter_phone, renter_email, booking_type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
      `, [
        bookingId, venueId, user_id, start, end, blockedEndDate, cleaningGap, guests, totalPrice, 'upcoming', 'paid', checkInInstructions, renterName, renterPhone, renterEmail, venue.booking_type || 'days'
      ]);

      await query('COMMIT');

      res.status(201).json({
        success: true,
        booking: result.rows[0]
      });
    } catch (dbError) {
      await query('ROLLBACK');
      if (dbError.code === '23P01') {
        return res.status(409).json({ message: 'This venue has just been booked by another customer.' });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

/**
 * @desc    Cancel an existing booking and calculate refund based on time-to-event rules
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private (User or Venue Owner)
 */
export const cancelBooking = async (req, res) => {
  const { id } = req.params;
  const { id: userId, role } = req.user;

  try {
    // Check if booking exists
    const bookingRes = await query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (bookingRes.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const booking = bookingRes.rows[0];

    // Verify user owns the booking or the venue being booked
    if (role === 'venue_owner') {
      const venueRes = await query('SELECT host_id FROM venues WHERE id = $1', [booking.venue_id]);
      if (venueRes.rows.length === 0 || venueRes.rows[0].host_id !== userId) {
        return res.status(403).json({ message: 'Not authorized to cancel bookings for this venue' });
      }
    } else if (booking.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    const today = new Date();
    const startDate = new Date(booking.start_date);

    if (startDate < today) {
      return res.status(400).json({ message: 'Cannot cancel a booking that has already started' });
    }

    // Calculate remaining time until start_date
    const diffTime = startDate.getTime() - today.getTime();
    const daysRemaining = diffTime / (1000 * 60 * 60 * 24);

    let refundPercentage = 0;
    let refundAmount = 0.00;
    let paymentStatus = booking.payment_status;

    if (booking.status === 'offline' || booking.payment_status === 'offline') {
      refundPercentage = 0;
      refundAmount = 0.00;
      paymentStatus = 'offline';
    } else {
      if (booking.booking_type === 'hours') {
        const hoursRemaining = diffTime / (1000 * 60 * 60);
        if (hoursRemaining >= 36) {
          refundPercentage = 100;
          refundAmount = Number(booking.total_price);
          paymentStatus = 'refunded';
        } else if (hoursRemaining >= 24) {
          refundPercentage = 50;
          refundAmount = Number(booking.total_price) * 0.5;
          paymentStatus = 'refunded';
        } else if (hoursRemaining >= 6) {
          refundPercentage = 10;
          refundAmount = Number(booking.total_price) * 0.10;
          paymentStatus = 'refunded';
        } else {
          refundPercentage = 0;
          refundAmount = 0.00;
          paymentStatus = 'paid';
        }
      } else {
        if (daysRemaining >= 10) {
          refundPercentage = 100;
          refundAmount = Number(booking.total_price);
          paymentStatus = 'refunded';
        } else if (daysRemaining >= 3) {
          refundPercentage = 50;
          refundAmount = Number(booking.total_price) * 0.5;
          paymentStatus = 'refunded';
        } else {
          refundPercentage = 0;
          refundAmount = 0.00;
          paymentStatus = 'paid';
        }
      }
    }

    // Update status to cancelled and refund payment
    const result = await query(`
      UPDATE bookings 
      SET 
        status = 'cancelled', 
        payment_status = $2,
        refund_amount = $3,
        refund_percentage = $4
      WHERE id = $1 
      RETURNING *
    `, [id, paymentStatus, refundAmount, refundPercentage]);

    res.json({
      success: true,
      booking: result.rows[0],
      refundAmount,
      refundPercentage
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};

/**
 * @desc    Lock a venue for offline bookings, private events, or maintenance
 * @route   POST /api/bookings/lock
 * @access  Private (Venue Owner only)
 */
export const lockVenue = async (req, res) => {
  const { venueId, startDate, endDate, notes, totalPrice, guests, renterName, renterPhone, renterEmail } = req.body;
  const host_id = req.user.id;

  try {
    if (!venueId || !startDate || !endDate || !renterName || !renterPhone || !renterEmail) {
      return res.status(400).json({ message: 'Please provide venueId, startDate, endDate, renterName, renterPhone, and renterEmail' });
    }

    // Check if venue exists and is owned by this host
    const venueRes = await query('SELECT * FROM venues WHERE id = $1', [venueId]);
    if (venueRes.rows.length === 0) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    const venue = venueRes.rows[0];
    if (venue.host_id !== host_id) {
      return res.status(403).json({ message: 'Not authorized to lock this venue' });
    }

    // Validate locking dates are not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (venue.booking_type !== 'hours') {
      start.setHours(0, 0, 0, 0);
      end.setHours(12, 0, 0, 0);
    }

    if (start < today) {
      return res.status(400).json({ message: 'Lock start date cannot be in the past.' });
    }
    if (end <= start) {
      return res.status(400).json({ message: 'Unlock date must be after lock start date.' });
    }

    // Operating hours check for hours-based booking
    if (venue.booking_type === 'hours') {
      const getMinutesOfDay = (d) => d.getHours() * 60 + d.getMinutes();
      const parseTimeStr = (tStr) => {
        if (!tStr) return 0;
        const [h, m] = tStr.split(':').map(Number);
        return h * 60 + m;
      };

      const startMinutes = getMinutesOfDay(start);
      const endMinutes = getMinutesOfDay(end);
      const openMinutes = parseTimeStr(venue.opening_time || '08:00');
      const closeMinutes = parseTimeStr(venue.closing_time || '22:00');

      if (startMinutes < openMinutes || endMinutes > closeMinutes) {
        return res.status(400).json({
          message: `Booking must be within operating hours: ${venue.opening_time || '08:00'} - ${venue.closing_time || '22:00'}.`
        });
      }
    }

    // Schedule overlap conflict validation
    const existingBookings = await query(`
      SELECT start_date, end_date, blocked_end_date FROM bookings 
      WHERE venue_id = $1 AND status != 'cancelled'
    `, [venueId]);

    const cleaningGap = Number(venue.cleaning_gap || 0);
    let blockedEndDate;
    if (venue.booking_type === 'hours') {
      blockedEndDate = new Date(end.getTime() + cleaningGap * 60 * 60 * 1000);
    } else {
      blockedEndDate = new Date(end.getTime() + 12 * 60 * 60 * 1000 + cleaningGap * 24 * 60 * 60 * 1000);
    }

    const hasOverlap = existingBookings.rows.some(b => {
      const bStart = new Date(b.start_date);
      const bEnd = new Date(b.end_date);
      const bBlockedEnd = new Date(b.blocked_end_date);
      
      if (venue.booking_type === 'hours') {
        const gapHours = Number(venue.cleaning_gap || 0);
        const limitNewEnd = new Date(end.getTime() + gapHours * 60 * 60 * 1000);
        const limitExistingEnd = new Date(bEnd.getTime() + gapHours * 60 * 60 * 1000);
        
        return start < limitExistingEnd && bStart < limitNewEnd;
      } else {
        return start < bBlockedEnd && bStart < blockedEndDate;
      }
    });

    if (hasOverlap) {
      return res.status(400).json({ 
        message: venue.booking_type === 'hours'
          ? 'The selected time range conflicts with an existing booking or its cleaning gap block.'
          : 'The selected dates conflict with an existing booking.'
      });
    }

    // Generate OFF-XXXX ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `OFF-${randomNum}`;

    const checkInInstructions = notes || 'Venue locked for offline event or maintenance.';

    try {
      await query('BEGIN');

      const result = await query(`
        INSERT INTO bookings (
          id, venue_id, user_id, start_date, end_date, blocked_end_date, cleaning_gap, guests, total_price, status, payment_status, check_in_instructions, renter_name, renter_phone, renter_email, booking_type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
      `, [
        bookingId, venueId, null, start, end, blockedEndDate, cleaningGap, guests || 0, totalPrice || 0, 'offline', 'offline', checkInInstructions, renterName, renterPhone, renterEmail, venue.booking_type || 'days'
      ]);

      await query('COMMIT');

      res.status(201).json({
        success: true,
        booking: result.rows[0]
      });
    } catch (dbError) {
      await query('ROLLBACK');
      if (dbError.code === '23P01') {
        return res.status(409).json({ message: 'This venue has just been booked by another customer.' });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Error locking venue:', error);
    res.status(500).json({ message: 'Error locking venue' });
  }
};

/**
 * @desc    Get non-cancelled bookings of a specific venue for calendar scheduling indicators
 * @route   GET /api/venues/:id/bookings
 * @access  Public
 */
export const getVenueBookings = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(`
      SELECT 
        b.id,
        b.start_date AS "startDate",
        b.end_date AS "endDate",
        b.status,
        b.booking_type AS "bookingType"
      FROM bookings b
      WHERE b.venue_id = $1 AND b.status != 'cancelled'
      ORDER BY b.start_date ASC
    `, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching venue bookings:', error);
    res.status(500).json({ message: 'Error fetching venue bookings' });
  }
};

/**
 * @desc    Fetch venue availability timelines (hours-based slots or daily blocked dates)
 * @route   GET /api/venues/:id/availability
 * @access  Public
 */
export const getVenueAvailability = async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Fetch venue details to see if it's days-based or hours-based
    const venueRes = await query('SELECT id, booking_type, cleaning_gap, opening_time, closing_time FROM venues WHERE id = $1', [id]);
    if (venueRes.rows.length === 0) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    const venue = venueRes.rows[0];
    const isHours = venue.booking_type === 'hours';

    if (isHours) {
      // Hours-based availability check
      let { date } = req.query;
      if (!date) {
        const today = new Date();
        const pad = (num) => String(num).padStart(2, '0');
        date = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
      }

      // Generate timeline slots for operating hours
      const parseTimeStr = (tStr) => {
        if (!tStr) return 0;
        const [h, m] = tStr.split(':').map(Number);
        return h * 60 + m;
      };

      const startMin = parseTimeStr(venue.opening_time || '08:00');
      const endMin = parseTimeStr(venue.closing_time || '22:00');
      const slots = [];
      for (let min = startMin; min + 60 <= endMin; min += 60) {
        const sh = Math.floor(min / 60);
        const sm = min % 60;
        const eh = Math.floor((min + 60) / 60);
        const em = (min + 60) % 60;
        const startStr = `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}`;
        const endStr = `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
        slots.push({ start: startStr, end: endStr });
      }

      // Fetch bookings that touch the requested date
      const bookingsRes = await query(`
        SELECT start_date, end_date, blocked_end_date 
        FROM bookings 
        WHERE venue_id = $1 
          AND status != 'cancelled' 
          AND start_date < $2 
          AND end_date > $3
      `, [id, `${date} 23:59:59`, `${date} 00:00:00`]);

      const combineDateAndHour = (dateStr, hourStr) => {
        return new Date(`${dateStr}T${hourStr}:00`);
      };

      const slotsWithStatus = slots.map(slot => {
        const slotStart = combineDateAndHour(date, slot.start);
        const slotEnd = combineDateAndHour(date, slot.end);
        let status = 'available';

        for (const b of bookingsRes.rows) {
          const bStart = new Date(b.start_date);
          const bEnd = new Date(b.end_date);
          const bBlockedEnd = new Date(b.blocked_end_date);

          if (slotStart < bEnd && bStart < slotEnd) {
            status = 'booked';
            break;
          }
          if (slotStart < bBlockedEnd && bEnd <= slotStart) {
            status = 'cleaning';
            break;
          }
        }

        return { ...slot, status };
      });

      return res.json({
        bookingType: 'hours',
        slots: slotsWithStatus
      });

    } else {
      // Days-based availability check
      // Query all bookings for this venue
      const bookingsRes = await query(`
        SELECT start_date, blocked_end_date, status 
        FROM bookings 
        WHERE venue_id = $1 AND status != 'cancelled'
      `, [id]);

      const unavailableDates = [];
      const getLocalDateStr = (d) => {
        const pad = (num) => String(num).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      };

      for (const b of bookingsRes.rows) {
        const start = new Date(b.start_date);
        const blockedEnd = new Date(b.blocked_end_date);
        
        // Loop from start date up to blocked_end_date - 1 day (checkout is allowed on the checkout day)
        for (let d = new Date(start); d < blockedEnd; d.setDate(d.getDate() + 1)) {
          unavailableDates.push(getLocalDateStr(d));
        }
      }

      // Deduplicate the array
      const uniqueUnavailableDates = [...new Set(unavailableDates)];

      return res.json({
        bookingType: 'days',
        unavailableDates: uniqueUnavailableDates
      });
    }

  } catch (error) {
    console.error('Error fetching venue availability:', error);
    res.status(500).json({ message: 'Error fetching venue availability' });
  }
};

/**
 * @desc    Get detailed parameters for a single booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private (Owner, Renter, or Admin only)
 */
export const getBookingById = async (req, res) => {
  const { id } = req.params;
  const { id: userId, role } = req.user;

  try {
    const result = await query(`
      SELECT 
        b.id,
        b.venue_id AS "venueId",
        v.title AS "venueTitle",
        v.location AS "venueLocation",
        v.full_address AS "fullAddress",
        v.latitude,
        v.longitude,
        v.images[1] AS "venueImage",
        b.start_date AS "startDate",
        b.end_date AS "endDate",
        b.guests,
        b.total_price AS "totalPrice",
        b.status,
        b.booking_date AS "bookingDate",
        b.payment_status AS "paymentStatus",
        COALESCE(b.renter_name, u.name) AS "renterName",
        COALESCE(b.renter_email, u.email) AS "renterEmail",
        b.renter_phone AS "renterPhone",
        h.name AS "hostName",
        h.email AS "hostMail",
        b.check_in_instructions AS "checkInInstructions",
        v.booking_type AS "venueBookingType",
        v.cleaning_gap AS "venueCleaningGap",
        v.opening_time AS "venueOpeningTime",
        v.closing_time AS "venueClosingTime",
        b.booking_type AS "bookingType",
        b.user_id AS "userId",
        v.host_id AS "hostId",
        b.refund_amount AS "refundAmount",
        b.refund_percentage AS "refundPercentage"
      FROM bookings b
      JOIN venues v ON b.venue_id = v.id
      JOIN users h ON v.host_id = h.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = result.rows[0];

    // Authorization check
    if (role !== 'admin' && booking.userId !== userId && booking.hostId !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    const mappedBooking = {
      ...booking,
      latitude: booking.latitude !== null && booking.latitude !== undefined ? Number(booking.latitude) : null,
      longitude: booking.longitude !== null && booking.longitude !== undefined ? Number(booking.longitude) : null,
    };

    res.json(mappedBooking);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ message: 'Error fetching booking details' });
  }
};
