import { Router } from "express";
import { KJUR } from "jsrsasign";

export const sdkSig = Router();

sdkSig.post("/", (req, res) => {
  const { meetingNumber, role } = req.body || {};
  if (!meetingNumber || role === undefined) {
    return res.status(400).json({ error: "meetingNumber and role required" });
  }

  const iat = Math.floor(Date.now() / 1000); // issued at
  const exp = iat + 60 * 60 * 2; // expire in 2 hours
  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    sdkKey: process.env.ZOOM_SDK_KEY,
    mn: meetingNumber,
    role,
    iat,
    exp,
    appKey: process.env.ZOOM_SDK_KEY, // used by Zoom
    tokenExp: exp,
    video_webrtc_mode: true,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);

  // IMPORTANT: HS256 uses your SDK SECRET (not the SDK key)
  const signature = KJUR.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    process.env.ZOOM_SDK_SECRET
  );

  return res.json({ signature });
});
