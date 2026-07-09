require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../config/db');

const verifyToken = require('../middlwares/auth');

router.post('/', verifyToken, async (req, res) => {
        let client; 
        const {venue_id, start_datetime, end_datetime} = req.body;

        const user_id = req.user.id;

        if(!venue_id || !start_datetime || !end_datetime){
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }
        // Rule 1: end_datetime must be after start_datetime
        const start = new Date(start_datetime);
        const end =  new Date(end_datetime);

        if(start >= end){
            return res.status(400).json({
                error: "End time must be strictly after start time"
            });
        }

        

        try{
            client = await db.connect();
            await client.query('BEGIN');
            
            // Rule 3: Venue must exist
            const venueCheck = await client.query('SELECT id, price_per_hour FROM venues WHERE id = $1', [venue_id]);
            if (venueCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Venue does not exist.' });
            }

            const hours = Math.abs(end - start) / 36e5;
            const calculatedPrice = hours * venueCheck.rows[0].price_per_hour;
            // Rule 4: No overlapping booking for the same venue
            // Formula for overlap: (ExistingStart < NewEnd) AND (ExistingEnd > NewStart)
           const overlapCheck = await client.query(
            `SELECT id FROM bookings 
            WHERE venue_id = $1 
            AND status != 'cancelled'
            AND start_datetime < $2 
            AND end_datetime > $3`,
            [venue_id, end_datetime, start_datetime]
            );

            if(overlapCheck.rows.length > 0 ){
                await client.query('ROLLBACK');
                return res.status(409).json({ error: 'The venue is already booked for this time slot.'});
            }
            // Rule 5: Create booking with a default status (e.g., 'confirmed' or 'pending')
            const insertQuery = `
            INSERT INTO bookings (user_id, venue_id, start_datetime, end_datetime, total_price, status)
            VALUES ($1, $2, $3, $4, $5,'confirmed')
            RETURNING *
            `;
            const newBooking = await client.query(insertQuery, [user_id,venue_id,start_datetime,end_datetime,calculatedPrice]);
            await client.query('COMMIT');

            return res.status(201).json({
                message: 'Booking created succesfully',
                booking: newBooking.rows[0]
            });
        }catch(err){
            if (client) {
            await client.query('ROLLBACK');
        }
            console.error('Booking Error:', err.message);
            res.status(500).json({ error: 'Internal server error while processing booking.' });
        }finally{
            if (client) {
                client.release();
            }
        }
});

router.get('/my-bookings', verifyToken, async (req, res) =>{
    const user_id = req.user.id;
    try{
        client = await db.connect();

        const bookings = await client.query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at', [user_id]);

        if(!bookings.rows.length){
            return res.status(200).json({
                message: 'You dont have any booking record',
                count: bookings.rows.length,
            });
        }
        
        return res.status(200).json({
            message: 'Bookings retrieved successfully',
            count: bookings.rows.length,
            bookings: bookings.rows
        });

    }catch(err){
        console.error('Fetch booking error: ', err.message);
        return res.status(500).json({
            message: 'Internal server error: '
        });
    }finally{
        if(client){
            client.release();
        }
    }
});

module.exports = router;