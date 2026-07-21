import { Request,Response } from "express";
import bcrypt from "bcrypt";
import {pool} from "../config/db.js";
import jwt from "jsonwebtoken";

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

        const normalizedEmail = email.trim().toLowerCase();

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

export const registerOwner=async (
    req : Request,
    res : Response
): Promise<void> =>{
    try
    {
        const {name,email,password}=req.body;

        if(!name ||!email || !password){
            res.status(400).json({
                message: "Name, email and password required",
            });
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser= await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [normalizedEmail]
        );

        if(existingUser.rows.length>0){
            res.status(409).json({
                message: "Email already registered",
            });
            return;
        }

        const hashedPassword= await bcrypt.hash(password, 10);

        const result = await pool.query(
         `INSERT INTO users (name, email, password, role, status)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, name, email, role, status, created_at`,
         [name, normalizedEmail, hashedPassword, "owner", "active"]
        );

        res.status(201).json({
            message : "Venue owner registered successfully",
            user: result.rows[0],
        });
    }catch(error){
        console.error("Owner registration failed", error)

        res.status(500).json({
            message: "Internal server error",
        });

    }
} ;

export const loginUser= async(
    req : Request,
    res : Response
): Promise<void> =>{

    try{
        const{email, password}= req.body;

        if(!email || !password){
            res.status(400).json({
                message:"Email and password required",
            });
            return;
        }

        const normalizedEmail=email.trim().toLowerCase();

        const result =await pool.query(
         `SELECT id, name, email, password, role, status
         FROM users
         WHERE email = $1`,
         [normalizedEmail]
        );

        if (result.rows.length === 0) {
          res.status(401).json({
          message: "Invalid email or password",
          });
         return;
        }

        const user=result.rows[0];

        if(user.role === "root_admin"){
            res.status(403).json({
                message: "Root admin must use admin login",
            });
            return;
        }

        if(user.status !== "active"){
            res.status(403).json({
                message:"account is not active",
            });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch){
            res.status(401).json({
                message:"Invalid password or email"
            });
            return;
        }


        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },

            process.env.JWT_SECRET as string,

            {
                expiresIn: "1d",
            }
        );

        res.status(200).json({
            message: "Login successfull",
            token,

            user:{

                id :  user.id,
                name : user.name,
                email : user.email,
                role : user.role,
                status : user.status,
            },
        });

    }catch(error){
        console.error("Login error:", error);

        res.status(500).json({
            message:"Internal server error",
        });
    }
};

export const rootAdminLogin = async (
    req : Request,
    res : Response
): Promise<void> => {
    try {
        const {email , password} = req.body;

        if(!email || !password){
            res.status(400).json({
                message:"email and password are required",
            });
            return;
        }

        const normalizedEmail=email.trim().toLowerCase();
        console.log("Root admin login request email:", normalizedEmail);

        const result =await pool.query(
             `SELECT id, name, email, password, role, status
             FROM users
             WHERE email = $1`,
            [normalizedEmail]
        );

        if(result.rows.length ===0){
            res.status(401).json({
                message:"Invalid email or password",
            });
            return;
        }

        const user=result.rows[0];
        console.log("Root admin found:", {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        passwordStart: user.password.substring(0, 7),
        });

        if (user.role !== "root_admin"){
            res.status(403).json({
                message:" Access denied rooot admin only",
            });
            return;
        }

        if (user.status !== "active"){
            res.status(403).json({
                message :"root admin account is not active",
            });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log("Root admin password match:", isPasswordMatch);

        if(!isPasswordMatch){
            res.status(401).json({
                message:"invalid email or password",
            });
            return;
        }

        const token=jwt.sign(

        {
            id : user.id,
            email : user.email,
            role: user.role,
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "1d"
        }
        );

        res.status(200).json({
            message : "Root admin login successful",
            token,
            user:{
                id: user.id,
                name: user.name,
                email: user.email,
                role : user.role,
                status: user.status,
            },
        });

    }catch(error){
        console.error("root admin login error",error);

        res.status(500).json({
            message:"internal server error",        
        });
    }
};