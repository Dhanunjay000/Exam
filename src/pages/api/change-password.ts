import clientPromise from "@/connection/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const client = await clientPromise;
            const db = client.db("Exam");
            const { username, currentPassword, newPassword, otp } = req.body;

            const user = await db.collection('Users').findOne({ username });
            if (!user) {
                return res.status(400).json({ "error": "User does not exist" });
            }

            // Verify current password
            if (!await bcrypt.compare(currentPassword, user.password)) {
                return res.status(401).json({ "error": "Current password is incorrect" });
            }

            // If OTP is provided, verify it
            if (otp) {
                if (otp !== user.otp) {
                    return res.status(401).json({ "error": "Invalid OTP" });
                }

                // Hash and update the new password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);

                await db.collection("Users").updateOne(
                    { username },
                    {
                        $set: {
                            password: hashedPassword,
                            otp: "", // Clear the OTP after successful password change
                            otp_created: null
                        }
                    }
                );

                return res.status(200).json({ "message": "Password changed successfully" });
            } else {
                // Generate and send OTP
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                await db.collection("Users").updateOne(
                    { username },
                    {
                        $set: {
                            otp,
                            otp_created: new Date()
                        }
                    }
                );

                // Send OTP via email
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendMail`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: username,
                        html: `<p>Your OTP for changing your password is: ${otp}. Please use this OTP to complete the password change process.</p>`
                    })
                });

                if (response.status === 200) {
                    return res.status(200).json({ "message": "OTP sent to your email" });
                } else {
                    return res.status(400).json({ "error": "Failed to send OTP" });
                }
            }
        } catch (error) {
            console.error("Error in change password:", error);
            return res.status(500).json({ "error": "Internal server error" });
        }
    } else {
        return res.status(405).json({ "error": "Method not allowed" });
    }
} 