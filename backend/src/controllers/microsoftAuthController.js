import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.model.js";
import { ConfidentialClientApplication } from "@azure/msal-node";

const msalClient = new ConfidentialClientApplication({
  auth: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}`,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  },
});

export const microsoftLogin = async (req, res) => {
  try {
    const { code } = req.body;

    const tokenResponse = await msalClient.acquireTokenByCode({
      code,
      scopes: ["openid", "profile", "email"],
      redirectUri: process.env.MICROSOFT_REDIRECT_URI,
    });

    const { oid, preferred_username, name } = tokenResponse.idTokenClaims;

    let teacher = await Teacher.findOne({ email: preferred_username });

    if (!teacher) {
      teacher = await Teacher.create({
        name,
        email: preferred_username,
        microsoftId: oid,
        authProviders: { local: false, google: false, microsoft: true },
        emailVerified: true,
      });
    } else {
      teacher.microsoftId = oid;
      teacher.authProviders.microsoft = true;
      await teacher.save();
    }

    const jwtToken = jwt.sign(
      { id: teacher._id, role: teacher.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token: jwtToken, teacher });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: "Microsoft login failed",
    });
  }
};
