const express = require('express');
const router = express.Router();
const db = require('../config/db');

const verifyToken = require('../middlwares/auth');

router.get('/all-bookings', verifyToken, async (req, res) =>{
    const user_id = req.user.id;

     if(req.user.role !== 'admin'){
            return res.status(403).json({
                message: 'You dont have access to all bookings'
            });
        }
    
    let client;
    try{

        
        client = await db.connect();


        const bookings = await client.query('SELECT * FROM bookings ORDER BY created_at');

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
            message: 'Internal server error'
        });
    }finally{
        if(client){
            client.release();
        }
    }
});

module.exports = router;