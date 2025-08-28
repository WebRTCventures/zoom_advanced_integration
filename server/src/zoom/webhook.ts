import { Router } from "express";
import crypto from "crypto";
import express from "express";
import { Request, Response, NextFunction } from "express";

export const webhook = Router();

// Zoom sends JSON POSTs. Capture raw body for signature check:
function rawBodySaver(req: Request, res: Response, buf: Buffer) {
  (req as any).rawBody = buf.toString("utf8");
}

export const jsonWithRaw = express.json({ verify: rawBodySaver });

webhook.post("/", (req: Request, res: Response) => {
  const secret = process.env.ZOOM_WEBHOOK_SECRET_TOKEN!;
  const ts = req.headers["x-zm-request-timestamp"];
  const body = req.body;
  const rawBody = req.rawBody;

  // Verify request signature (v0 scheme)
  const message = `v0:${ts}:${rawBody}`;
  const hash = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");
  const expected = `v0=${hash}`;
  if (req.headers["x-zm-signature"] !== expected) {
    return res.status(401).send("Invalid Zoom signature");
  }

  // Handle initial & periodic URL validation
  if (body?.event === "endpoint.url_validation") {
    const plain = body?.payload?.plainToken as string;
    const encryptedToken = crypto
      .createHmac("sha256", secret)
      .update(plain)
      .digest("hex");
    // Must respond within ~3s:
    return res.json({ plainToken: plain, encryptedToken });
  }

  // Business events
  switch (body?.event) {
    case "meeting.started":
      // TODO: mark meeting active
      break;
    case "meeting.ended":
      // TODO: mark ended
      break;
    case "participant.joined":
      // TODO: record participant join
      break;
    case "participant.left":
      // TODO: record participant leave
      break;
  }

  res.sendStatus(200);
});
