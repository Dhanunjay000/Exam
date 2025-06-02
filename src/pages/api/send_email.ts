import type { NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend('re_Kjhu8en9_A1pbYhY8JESg8x4GT3XsFQdV');

export default async (res: NextApiResponse) =>{
    const { data, error } = await resend.emails.send({
        from: 'dhanunjaybathula@gmail.com',
        to: ['leummopezellu-3177@yopmail.com'],
        subject: 'Hello world',
        text :"sample",
      });
    if (error) {
        return res.status(400).json(error);
      }
    
      res.status(200).json(data);
    };