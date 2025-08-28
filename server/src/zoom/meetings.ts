import { Router } from "express";
import axios from "axios";
import { getS2SToken } from "./s2s.js";

export const meetings = Router();

// GET /api/meetings?userId=me (or an email/Zoom userId)
meetings.get("/", async (req, res) => {
  try {
    const userId = (req.query.userId as string) || "me";
    const token = await getS2SToken();
    const r = await axios.get(
      `https://api.zoom.us/v2/users/${userId}/meetings`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(r.data);
  } catch (e: any) {
    res
      .status(e?.response?.status || 500)
      .json(e?.response?.data || { error: "zoom_list_failed" });
  }
});

// POST /api/meetings { userId, topic, start_time, duration, timezone }
meetings.post("/", async (req, res) => {
  try {
    const { userId = "me", ...body } = req.body || {};
    const token = await getS2SToken();
    const r = await axios.post(
      `https://api.zoom.us/v2/users/${userId}/meetings`,
      body,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.status(201).json(r.data);
  } catch (e: any) {
    console.error(e);
    res
      .status(e?.response?.status || 500)
      .json(e?.response?.data || { error: "zoom_create_failed" });
  }
});
