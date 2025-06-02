import clientPromise from "@/connection/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { username } = req.query;
    if (username) {
      const client = await clientPromise;
      const db = client.db("Exam");
      const user = await db.collection('Users').findOne({ username });
      if (user) {
        res.status(200).json({ user });
      }
      else {
        res.status(400).json({ "error": "user not found" });
      }
    }
    return res.status(500).json({ "error": "Internal server error" });
  }
  if (req.method == "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("Exam");
      const { first_name, last_name, gender, username, dob, password, phone } = req.body;
      const user = await db.collection('Users').findOne({ username });
      if (user)
        return res.status(400).json({ "error": "user with given email already exists" });
      else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await db.collection('Users').insertOne({
          first_name,
          last_name,
          gender,
          username,
          dob,
          password: hashedPassword,
          phone,
          created: new Date(),
          otp: "",
          token: null,

        });
        if(result)
          return res.status(201).json({ "message": "User Created Successfully" });
      }
    }
    catch (error) {
      return res.status(500).json({ "error": error });
    }
  }
  if (req.method === 'PUT') {
    try {
      const client = await clientPromise;
      const db = client.db("Exam");
      const { first_name, last_name, gender, username, dob, phone } = req.body;
      const result = await db.collection('Users').updateOne({ username }, {
        $set: {
          first_name,
          last_name,
          gender,
          dob,
          phone,
        }
      });
      if(result)
        return res.status(201).json({ "message": "User updated Successfully" });
    }
    catch (error: any) {
      return res.status(500).json({ "error": error.message });
    }
  }
  if (req.method === 'PATCH') {
    try {
      const client = await clientPromise;
      const db = client.db("Exam");
      const { username, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const result = await db.collection('Users').updateOne({ username }, {
        $set: {
          password: hashedPassword
        }
      });
      console.log(result);
      return res.status(201).json({ "message": "User updated Successfully" });
    }
    catch (error: any) {
      return res.status(500).json({ "error": error.message });
    }
  }
  else {
    return res.status(405).json({ "error": "Method is not allowed" })
  }
}