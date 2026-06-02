import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer"

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sendMail=async (to,subject,html)=>{
   try{
        await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    })
    console.log("Masil send successfully")
   } 
   catch(error){
    console.log(error)
    throw error
   }
};