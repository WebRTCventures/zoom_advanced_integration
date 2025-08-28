import "dotenv/config";
import express from "express";
import cors from "cors";
import { checkJwt } from "./auth/auth0";
import { meetings } from "./zoom/meetings.js";
import { sdkSig } from "./zoom/sdkSig.js";
import { webhook, jsonWithRaw } from "./zoom/webhook.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Meetings (S2S OAuth)
app.use("/api/meetings", meetings);

// Meeting SDK signature (SSO-gated)
app.use("/api/sdk-signature", checkJwt, sdkSig);

// Webhooks are NOT SSO-protected (Zoom needs to reach them)
app.post("/zoom/webhook", jsonWithRaw, webhook);

// Health
app.get("/health", (_req, res) => res.send("ok"));

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Server listening on :${port}`));
