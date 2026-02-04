import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.model.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub, email, name, email_verified } = ticket.getPayload();

    let teacher = await Teacher.findOne({ email });

    if (!teacher) {
      teacher = await Teacher.create({
        name,
        email,
        googleId: sub,
        emailVerified: email_verified,
        authProviders: { local: false, google: true, microsoft: false },
      });
    } else {
      teacher.googleId = sub;
      teacher.authProviders.google = true;
      await teacher.save();
    }

    const jwtToken = jwt.sign(
      { id: teacher._id, role: teacher.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, 
      token: jwtToken,
       teacher:{id:teacher._id} });
  } catch {
    res.status(401).json({ success: false, message: "Google login failed" });
  }
};
