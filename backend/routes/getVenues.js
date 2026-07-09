const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try{
        const result = await db.query('SELECT * FROM venues WHERE is_active = true ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch(error){
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error'});
    }
});

module.exports = router;