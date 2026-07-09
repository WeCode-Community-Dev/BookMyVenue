const express = require('express');
const router = express.Router();
const db = require('../config/db');

const verifyToken = require('../middlwares/auth');

router.get('/owner-venues', verifyToken, async (req, res) => {
    let client;
    const userId = req.user.id;

    if(req.user.role !== 'owner'){
            return res.status(403).json({
                message: 'You dont have access to this route'
            });
        }
    
        try{
            client = await db.connect();

            const ownersVenues = await client.query('SELECT * FROM venues WHERE owner_id = $1', [userId]);

            if(!ownersVenues.rows.length){
            return res.status(200).json({
                message: 'You dont have any registered venues',
                count: ownersVenues.rows.length,
                });
            }

            return res.status(200).json({
            message: 'Your veneus retrieved successfully',
            count: ownersVenues.rows.length,
            venues: ownersVenues.rows
            });
        }catch(err){
        console.error('Fetch venues error: ', err.message);
        return res.status(500).json({
            message: 'Internal server error'
        });
        }finally{
        if(client){
            client.release();
        }
    }
})

router.get('/owner-booking', verifyToken, async (req, res) => {
    let client;
    const userId = req.user.id;

    if(req.user.role !== 'owner'){
            return res.status(403).json({
                message: 'You dont have access to this route'
            });
        }
    
        try{
            client = await db.connect();

            const ownersVenuesAndBookings = await client.query('SELECT b.*, v.name AS venue_name FROM bookings b JOIN venues v ON b.venue_id = v.id WHERE v.owner_id = $1 ', [userId]);

            if(!ownersVenuesAndBookings.rows.length){
            return res.status(200).json({
                message: 'You dont have any bookings for yours venues',
                count: ownersVenuesAndBookings.rows.length,
                });
            }

            return res.status(200).json({
            message: 'Your veneus retrieved successfully',
            count: ownersVenuesAndBookings.rows.length,
            venues: ownersVenuesAndBookings.rows
            });
        }catch(err){
        console.error('Fetch venues error: ', err.message);
        return res.status(500).json({
            message: 'Internal server error'
        });
        }finally{
        if(client){
            client.release();
        }
    }
})

module.exports = router;