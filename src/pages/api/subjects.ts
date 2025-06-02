import clientPromise from "@/connection/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("Exam");
    if (req.method === 'GET') {
        try {
            const subjects = await db.collection("Subjects").find({}).toArray();
            res.status(200).json(subjects);
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
    if (req.method === 'POST') {
        try {
            const { title, description, icon } = req.body;
            const result = await db.collection("Subjects").insertOne({ title, description , icon});
            if (result)
                res.status(200).json({ message: "Subject added successfully" });
        } catch (error) {
            console.error("Error adding user:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
