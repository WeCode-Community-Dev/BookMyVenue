import { query } from '../db.js';

/**
 * Helper to map standard database snake_case columns to camelCase variables
 * and cast numeric Postgres types correctly to prevent frontend math bugs.
 * @param {object} row - The database row returned by pg client
 * @returns {object|null} CamelCased and formatted venue object
 */
const mapVenueRow = (row) => {
  if (!row) return null;
  return {
    id: row.id.toString(), // Normalize numeric ID to string to match frontend types
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
    bookingType: row.booking_type || 'days',
    cleaningGap: Number(row.cleaning_gap || 0),
    openingTime: row.opening_time || '08:00',
    closingTime: row.closing_time || '22:00',
    tags: [
      row.location,
      `${row.capacity} Guests`,
      row.is_top_rated ? 'Luxury' : 'Handpicked'
    ]
  };
};

/**
 * @desc    Get all approved venues with optional location and capacity filters
 * @route   GET /api/venues
 * @access  Public
 */
export const getVenues = async (req, res) => {
  try {
    const { location, capacity } = req.query;
    let queryText = `
      SELECT v.*, u.email AS host_email 
      FROM venues v 
      LEFT JOIN users u ON v.host_id = u.id
    `;
    const params = [];

    const conditions = ["v.status = 'approved'"];
    if (location && location !== 'All') {
      params.push(location);
      conditions.push(`v.location = $${params.length}`);
    }

    if (capacity && capacity !== 'All') {
      const capNum = parseInt(capacity, 10);
      if (!isNaN(capNum)) {
        if (capNum === 10) {
          conditions.push('v.capacity <= 10');
        } else if (capNum === 100) {
          conditions.push('v.capacity > 10 AND v.capacity <= 100');
        } else if (capNum === 1000) {
          conditions.push('v.capacity >= 1000');
        }
      }
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    // Sort by id or title by default
    queryText += ' ORDER BY v.id ASC';

    const result = await query(queryText, params);
    res.json(result.rows.map(mapVenueRow));
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).json({ message: 'Error fetching venues' });
  }
};

/**
 * @desc    Get detailed fields for a single venue by its ID
 * @route   GET /api/venues/:id
 * @access  Public
 */
export const getVenueById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(`
      SELECT v.*, u.email AS host_email 
      FROM venues v 
      LEFT JOIN users u ON v.host_id = u.id 
      WHERE v.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.json(mapVenueRow(result.rows[0]));
  } catch (error) {
    console.error('Error fetching venue details:', error);
    res.status(500).json({ message: 'Error fetching venue details' });
  }
};

/**
 * @desc    Create a new venue listing and set its status to pending approval
 * @route   POST /api/venues
 * @access  Private (Venue Owner only)
 */
export const createVenue = async (req, res) => {
  const {
    title, description, location, full_address, capacity, square_feet, price_per_night,
    host_type, rating, is_top_rated, date_range, parking, catering,
    images, amenities, rules, event_types, booking_type, cleaning_gap, opening_time, closing_time,
    latitude, longitude
  } = req.body;

  const host_id = req.user.id;
  const host_email = req.user.email;

  try {
    if (!title || !description || !location || !full_address || !capacity || !square_feet || !price_per_night) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const result = await query(`
      INSERT INTO venues (
        title, description, location, full_address, latitude, longitude, capacity, square_feet, price_per_night,
        host_id, host_type, rating, is_top_rated, date_range, parking, catering,
        images, amenities, rules, event_types, status, booking_type, cleaning_gap, opening_time, closing_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
      RETURNING *
    `, [
      title, description, location, full_address,
      latitude !== undefined && latitude !== null ? Number(latitude) : null,
      longitude !== undefined && longitude !== null ? Number(longitude) : null,
      capacity, square_feet, price_per_night,
      host_id, host_type || 'Superhost', rating || 5.0, is_top_rated || false, date_range || 'Available', parking || '', catering || '',
      images || [], amenities || [], rules || [], event_types || [], 'pending',
      booking_type || 'days', Number(cleaning_gap || 0), opening_time || '08:00', closing_time || '22:00'
    ]);

    const newVenue = result.rows[0];
    newVenue.host_email = host_email;

    res.status(201).json({
      success: true,
      venue: mapVenueRow(newVenue)
    });
  } catch (error) {
    console.error('Error creating venue:', error);
    res.status(500).json({ message: 'Error creating venue' });
  }
};

/**
 * @desc    Get all venues owned by the currently authenticated host
 * @route   GET /api/venues/my-venues
 * @access  Private (Venue Owner only)
 */
export const getMyVenues = async (req, res) => {
  const host_id = req.user.id;
  try {
    const result = await query(`
      SELECT v.*, u.email AS host_email 
      FROM venues v 
      LEFT JOIN users u ON v.host_id = u.id 
      WHERE v.host_id = $1 
      ORDER BY v.id ASC
    `, [host_id]);
    res.json(result.rows.map(mapVenueRow));
  } catch (error) {
    console.error('Error fetching host venues:', error);
    res.status(500).json({ message: 'Error fetching host venues' });
  }
};

/**
 * @desc    Update details for a venue owned by the authenticated host and reset its status to pending
 * @route   PUT /api/venues/:id
 * @access  Private (Venue Owner only)
 */
export const updateVenue = async (req, res) => {
  const { id } = req.params;
  const host_id = req.user.id;
  const host_email = req.user.email;

  const title = req.body.title;
  const description = req.body.description;
  const location = req.body.location;
  const full_address = req.body.fullAddress || req.body.full_address;
  const capacity = req.body.capacity;
  const square_feet = req.body.squareFeet || req.body.square_feet;
  const price_per_night = req.body.pricePerNight || req.body.price_per_night;
  const host_type = req.body.hostType || req.body.host_type;
  const is_top_rated = req.body.isTopRated !== undefined ? req.body.isTopRated : req.body.is_top_rated;
  const date_range = req.body.dateRange || req.body.date_range;
  const parking = req.body.parking;
  const catering = req.body.catering;
  const images = req.body.images;
  const amenities = req.body.amenities;
  const rules = req.body.rules;
  const event_types = req.body.eventTypes || req.body.event_types;
  const booking_type = req.body.bookingType || req.body.booking_type;
  const cleaning_gap = req.body.cleaningGap !== undefined ? req.body.cleaningGap : req.body.cleaning_gap;
  const opening_time = req.body.openingTime || req.body.opening_time;
  const closing_time = req.body.closingTime || req.body.closing_time;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  try {
    // Check ownership
    const checkRes = await query('SELECT * FROM venues WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    if (checkRes.rows[0].host_id !== host_id) {
      return res.status(403).json({ message: 'Not authorized to update this venue' });
    }

    if (!title || !description || !location || !full_address || !capacity || !square_feet || !price_per_night) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const result = await query(`
      UPDATE venues SET
        title = $1,
        description = $2,
        location = $3,
        full_address = $4,
        capacity = $5,
        square_feet = $6,
        price_per_night = $7,
        host_type = $8,
        is_top_rated = $9,
        date_range = $10,
        parking = $11,
        catering = $12,
        images = $13,
        amenities = $14,
        rules = $15,
        event_types = $16,
        status = 'pending',
        rejection_reason = NULL,
        booking_type = $17,
        cleaning_gap = $18,
        opening_time = $19,
        closing_time = $20,
        latitude = $21,
        longitude = $22
      WHERE id = $23 AND host_id = $24
      RETURNING *
    `, [
      title, description, location, full_address, Number(capacity), Number(square_feet), Number(price_per_night),
      host_type || 'Superhost', is_top_rated || false, date_range || 'Available', parking || '', catering || '',
      images || [], amenities || [], rules || [], event_types || [],
      booking_type || 'days', Number(cleaning_gap || 0), opening_time || '08:00', closing_time || '22:00',
      latitude !== undefined && latitude !== null ? Number(latitude) : null,
      longitude !== undefined && longitude !== null ? Number(longitude) : null,
      id, host_id
    ]);

    const updatedVenue = result.rows[0];
    updatedVenue.host_email = host_email;

    res.json({
      success: true,
      venue: mapVenueRow(updatedVenue)
    });
  } catch (error) {
    console.error('Error updating venue:', error);
    res.status(500).json({ message: 'Error updating venue' });
  }
};

/**
 * @desc    Delete a venue listing from the platform database
 * @route   DELETE /api/venues/:id
 * @access  Private (Venue Owner only)
 */
export const deleteVenue = async (req, res) => {
  const { id } = req.params;
  const host_id = req.user.id;

  try {
    // Check ownership
    const checkRes = await query('SELECT * FROM venues WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    if (checkRes.rows[0].host_id !== host_id) {
      return res.status(403).json({ message: 'Not authorized to delete this venue' });
    }

    await query('DELETE FROM venues WHERE id = $1 AND host_id = $2', [id, host_id]);
    res.json({
      success: true,
      message: 'Venue deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting venue:', error);
    res.status(500).json({ message: 'Error deleting venue' });
  }
};

