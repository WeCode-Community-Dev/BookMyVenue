const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/venues/:id', async (req, res) => {
    const venueId = req.params.id;
    try{
        const result = await db.query('SELECT * FROM venues WHERE id = $1',[venueId]);
        if(result.rows.length === 0){
            return res.status(404).json({
                message:  'Not found'
            });
        }
        const venue = result.rows[0];
        res.status(200).json({
            message: 'Venue details retrieved successfully',
            venue: venue
        });

    } catch(error){
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error'});
    }
});

module.exports = router;