import { Request,Response } from "express";
import bcrypt from "bcrypt";
import {pool} from "../config/db.js";


export const registerCustomer = async(
    req : Request,
    res : Response
): Promise<void> => {
    try{
        const { name, email, password} =req.body;

        if (!name ||!email || !password){
            res.status(400).json({
                message: "Name, email and passsword are required",
            });
            return;
        }

        if (password.length<6){
            res.status(400).json({
                message: "password must be atleast 6 characters",
            });
            return;
        }

        const normalizedEmail = email.toLowerCase();

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [normalizedEmail]
        );

        if (existingUser.rows.length>0){
            res.status(409).json({
                message:"Email already registered",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password, role, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email, role, status, created_at`,
        [name, normalizedEmail, hashedPassword, "customer", "active"]
        );


        res.status(201).json({
        message: "Customer registered successfully",
        user: result.rows[0],
        });
    }
    catch(error){
         console.error("Customer registration error:", error);
         res.status(500).json({
         message: "Internal server error",
         });
    }
};