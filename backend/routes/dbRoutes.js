const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/ping', (req, res) => {
    db.query('SELECT 1 AS alive') 
        .then((result) => {
            res.status(200).json({
                success: 'CONNECTED',
                message: "Database connection instance is active.",
                data: result.rows
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: 'DISCONNECTED',
                message: "Database engine did not reply to ping request.",
                error: error.message
            });
        });
});

router.get('/meta', (req, res) => {
    db.query('SELECT version(), current_database(), current_user')
        .then((result) => {
            res.status(200).json({
                success: true,
                systemDetails: result.rows
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: 'Failed to extract database structural metadata',
                error: error.message
            });
        });
})

module.exports = router;
