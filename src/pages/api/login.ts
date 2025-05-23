import clientPromise from "@/connection/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("Exam");

    const { username, password = "", otp = "" } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await db.collection("Users").findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Case: OTP submission
    if (otp) {
      if (otp === user.otp) {
        return res.status(200).json({ message: "User logged in successfully" });
      } else {
        return res.status(401).json({ error: "Invalid OTP" });
      }
    }

    // Case: Requesting password reset (password blank)
    if (!password) {
      return sendMailAndStoreOtp(username, db, res);
    }

    // Case: Login attempt with password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Send OTP for valid password
    return sendMailAndStoreOtp(username, db, res);

  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const sendMailAndStoreOtp = async (username: string, db: any, res: NextApiResponse) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await db.collection("Users").updateOne(
      { username },
      {
        $set: {
          otp,
          otp_created: new Date(),
        },
      }
    );

    const mailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendMail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: username,
        html: `<p>Your OTP for verifying your user account is: <strong>${otp}</strong>. Please use this OTP to complete the login process.</p>`,
      }),
    });

    if (mailResponse.ok) {
      return res.status(200).json({ message: "OTP sent to the registered email" });
    } else {
      return res.status(400).json({ error: "Failed to send OTP" });
    }
  } catch (error: any) {
    console.error("OTP send error:", error);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};
