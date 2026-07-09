const express = require('express');
const router = express.Router();

const db = require('../config/db');
const verifyToken = require('../middlwares/auth');

router.post('/add-venue', verifyToken, async (req, res) => {
    let client;
    let ownerId;
    const { name, description, city, address, capacity, price_per_hour, owner_email } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if(!name || !description || !city || !address || ! capacity || !price_per_hour){
        return res.status(400).json({
            message: 'Every fields are required'
        });
    }

    if(userRole !== 'admin'){
        return res.status(403).json({
            message: 'You dont have the authority to access this feature'
        });
    }

    try{
        client = await db.connect();
        const ownerCheck = await client.query('SELECT * FROM users WHERE email = $1',[owner_email]);
        
        if(ownerCheck.rows.length > 0){
            ownerId = ownerCheck.rows[0].id;
        }else{
            return res.status(400).json({
                message: 'Owners email is nor valid'
            });
        }

        const insertVenue = `INSERT INTO venues (owner_id, name, description, city, address, capacity, price_per_hour, is_active, is_verified) VALUES ($1, $2, $3, $4, $5, $6, $7, true, true) RETURNING *`
        const newVenue = await client.query(insertVenue,[ownerId, name, description, city, address, capacity, price_per_hour])

        return res.status(201).json({
                message: 'Venue created succesfully',
                venue: newVenue.rows[0]
        });
    }catch(err){
            if (client) {
        }
        res.status(500).json({ error: 'Internal server error while processing booking.' });
    }finally{
        if (client) {
                client.release();
            }
    }
})

module.exports = router;