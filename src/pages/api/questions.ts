import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/connection/mongodb";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("Exam");
  var questions
  if (req.method === 'GET') {
    const { subject, valid } = req.query;
    if (!subject)
      res.status(400).json({ error: "Not a valid subject selected" });
    try {
      if (valid=='true') {
         questions = await db.collection("Questions").find({ subject: subject }).project({ question: 1, options: 1 }).toArray();
      }
      else {
         questions = await db.collection("Questions").find({ subject: subject }).toArray();
      }
      if (questions)
        res.status(200).json(questions);
      else
        res.status(400).json({ "error": "No question found" });
    }
    catch (error) {
      res.status(500).json({ "error": error })
    }
  }
  if (req.method === 'POST') {
    try {
      const { subject, question, options, answer } = req.body;
      if (subject && question && options && answer) {
        const result = await db.collection("Questions").insertOne({ subject, question, options, answer });
        res.status(200).json({ "success": "Question saved successfully" });
      }
      else
        res.status(400).json({ "error": "Error in saving the records" });
    }
    catch (error) {
      res.status(405).json({ "error": error });
    }

  }
  else {
    res.status(405).json({ message: "Something went wring" })
  }
}