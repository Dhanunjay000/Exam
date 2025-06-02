import clientPromise from "@/connection/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("Exam");
    if (req.method === 'GET') {
        try {
            const { username } = req.query;
            const results = await db.collection("Results").find({username}).toArray();
            if(results)
                res.status(200).json(results);
            else 
                res.status(400).json({message : "No results found with the provided  user" })
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
    if (req.method === 'POST') {
        try {
            const { username, subject , total , ans, unans , crct , incrct  } = req.body;
            const result = await db.collection("Results").insertOne({ username, subject , total, ans , unans , crct , incrct, submitted_date : new Date()});
            if(result)
                res.status(200).json({ message: "Result submitted successfully" });
        } catch (error) {
            console.error("Error adding user:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
