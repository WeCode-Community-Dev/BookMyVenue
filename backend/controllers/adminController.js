import { query } from '../db.js';


/**
 * @desc    Get aggregate platform metrics (user/host/venue counts, platform earnings, volume)
 * @route   GET /api/admin/stats
 * @access  Private (Admin role only)
 */
export const getDashboardStats = async (req, res) => {
  try {
    // user counts
    const usersCountRes = await query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'user'");
    const hostsCountRes = await query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'venue_owner'");
    
    // venue counts
    const venuesCountRes = await query("SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'pending')::int AS pending, COUNT(*) FILTER (WHERE status = 'approved')::int AS approved FROM venues");
    
    // financialtransactions
    const financialRes = await query(`
      SELECT COALESCE(SUM(total_price), 0)::int AS "totalVolume" 
      FROM bookings 
      WHERE payment_status = 'paid' AND status != 'cancelled'
    `);
    
    const totalVolume = financialRes.rows[0].totalVolume;
    const platformFeePercentage = 10; 
    const platformEarnings = Math.round(totalVolume * (platformFeePercentage / 100));
    const hostEarnings = totalVolume - platformEarnings;
    
    res.json({
      success: true,
      stats: {
        totalUsers: usersCountRes.rows[0].count,
        totalHosts: hostsCountRes.rows[0].count,
        totalVenues: venuesCountRes.rows[0].total,
        pendingVenues: venuesCountRes.rows[0].pending,
        approvedVenues: venuesCountRes.rows[0].approved,
        totalVolume,
        platformFeePercentage,
        platformEarnings,
        hostEarnings
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching admin dashboard stats' });
  }
};

/**
 * @desc    Get all venues across the platform for approval review
 * @route   GET /api/admin/venues
 * @access  Private (Admin role only)
 */
export const getAllVenues = async (req, res) => {
  try {
    const result = await query(`
      SELECT v.*, u.name AS "hostName", u.email AS host_email 
      FROM venues v
      LEFT JOIN users u ON v.host_id = u.id
      ORDER BY v.id DESC
    `);
    
    // Map database rows using same camelCase logic
    const mappedVenues = result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      location: row.location,
      fullAddress: row.full_address,
      latitude: row.latitude !== null && row.latitude !== undefined ? Number(row.latitude) : null,
      longitude: row.longitude !== null && row.longitude !== undefined ? Number(row.longitude) : null,
      capacity: Number(row.capacity),
      squareFeet: Number(row.square_feet),
      pricePerNight: Number(row.price_per_night),
      hostEmail: row.host_email,
      hostName: row.hostName || 'Unknown Host',
      hostType: row.host_type,
      rating: Number(row.rating),
      isTopRated: row.is_top_rated,
      dateRange: row.date_range,
      parking: row.parking,
      catering: row.catering,
      images: row.images,
      amenities: row.amenities,
      rules: row.rules,
      eventTypes: row.event_types,
      status: row.status || 'pending',
      rejectionReason: row.rejection_reason || '',
      createdAt: row.created_at
    }));
    
    res.json(mappedVenues);
  } catch (error) {
    console.error('Error fetching all venues:', error);
    res.status(500).json({ message: 'Error fetching venues list' });
  }
};

/**
 * @desc    Approve or decline a pending venue listing
 * @route   PUT /api/admin/venues/:id/status
 * @access  Private (Admin role only)
 */
export const updateVenueStatus = async (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body; // 'approved' or 'declined'

  if (!status || !['approved', 'declined', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value. Must be approved, declined, or pending.' });
  }

  try {
    const checkRes = await query('SELECT * FROM venues WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    let result;
    if (status === 'declined') {
      result = await query(
        'UPDATE venues SET status = $1, rejection_reason = $2 WHERE id = $3 RETURNING *',
        [status, rejectionReason || '', id]
      );
    } else {
      result = await query(
        'UPDATE venues SET status = $1, rejection_reason = NULL WHERE id = $2 RETURNING *',
        [status, id]
      );
    }

    res.json({
      success: true,
      message: `Venue status successfully updated to ${status}`,
      venue: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating venue status:', error);
    res.status(500).json({ message: 'Error updating venue status' });
  }
};

/**
 * @desc    Get list of all bookings across the platform
 * @route   GET /api/admin/bookings
 * @access  Private (Admin role only)
 */
export const getAllBookings = async (req, res) => {
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
        b.created_at AS "createdAt",
        COALESCE(b.renter_name, u.name) AS "renterName",
        COALESCE(b.renter_email, u.email) AS "renterEmail",
        b.renter_phone AS "renterPhone",
        h.name AS "hostName",
        h.email AS "hostMail"
      FROM bookings b
      JOIN venues v ON b.venue_id = v.id
      JOIN users h ON v.host_id = h.id
      LEFT JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `);
    
    const mappedBookings = result.rows.map(row => ({
      ...row,
      latitude: row.latitude !== null && row.latitude !== undefined ? Number(row.latitude) : null,
      longitude: row.longitude !== null && row.longitude !== undefined ? Number(row.longitude) : null,
    }));

    res.json(mappedBookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

/**
 * @desc    Get list of all registered platform users and hosts
 * @route   GET /api/admin/users
 * @access  Private (Admin role only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const result = await query(`
      SELECT id, name, email, role, created_at AS "createdAt"
      FROM users 
      ORDER BY role ASC, id ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Error fetching users list' });
  }
};
