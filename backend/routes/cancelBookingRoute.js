const express = require('express');
const router = express.Router();
const db = require('../config/db');

const verifyToken = require('../middlwares/auth');

router.patch('/booking/:id', verifyToken, async (req, res) => {
    let client;
    const bookingId =  req.params.id;
    const user_id = req.user.id;
    
    try{
        client = await db.connect();

        const bookingDetails = await client.query('SELECT user_id, status FROM bookings WHERE id = $1',[bookingId]);

        if (bookingDetails.rows.length === 0) {
            return res.status(404).json({
                message: 'Booking not found.'
            });
        }

        const booking = bookingDetails.rows[0];

        if(req.user.role !== 'admin' && booking.user_id !== req.user.id ){
            return res.status(403).json({
                message: 'Access denied. You do not have permission to manage thus booking'
            });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({
                message: 'This booking has already been cancelled.'
            });
        }

        const updateData = await client.query("UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *",[bookingId]);

        return res.status(200).json({
            message: 'Booking cancelled successfully',
            booking: updateData.rows[0]
        });
        
        
    }catch (err) {
        console.error('Update booking error: ', err.message);
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