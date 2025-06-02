import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from 'nodemailer';

export default async function handler(req:NextApiRequest, res : NextApiResponse){
    if(req.method !== 'POST'){
        return res.status(405).json({"error" :"Method is not allowed"}
        )
    }
    const {to,  html} = req.body;
    const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        auth: {
            user: 'ocr.aiapi@e-commsys.com.au',
            pass: 'V$493748249674uz'
        }
    });
    console.log(html);
    try {
        let info =await transporter.sendMail({
            from: `"Login Test" <ocr.aiapi@e-commsys.com.au>`,
            to ,
            subject : "OTP verfication",
            html
                })
                console.log(info);
        res. status(200).json({message : "message send successfully"})
    }
    catch(err){
        res.status(500).json({error :"failed to send  the email"})
    }

}