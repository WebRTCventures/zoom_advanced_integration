import axios from "axios";

let cached: { access_token: string; expires_at: number } | null = null;

export async function getS2SToken() {
  const now = Date.now() / 1000;
  if (cached && cached.expires_at - 60 > now) return cached.access_token;

  const res = await axios.post("https://api.zoom.us/oauth/token", null, {
    params: {
      grant_type: "account_credentials",
      account_id: process.env.ZOOM_ACCOUNT_ID,
    },
    auth: {
      username: process.env.ZOOM_CLIENT_ID!,
      password: process.env.ZOOM_CLIENT_SECRET!,
    },
  });

  cached = {
    access_token: res.data.access_token,
    expires_at: now + res.data.expires_in,
  };
  return cached.access_token;
}
