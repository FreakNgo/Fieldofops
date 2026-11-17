// Vercel serverless function: returns short-lived TURN credentials (keeps your key private).
// Set ONE of these in Vercel > Project > Settings > Environment Variables:
//   Cloudflare (1TB/mo free): CF_TURN_KEY_ID + CF_TURN_API_TOKEN
//   Metered (free tier):      METERED_APP + METERED_KEY
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const e = process.env;
    if (e.CF_TURN_KEY_ID && e.CF_TURN_API_TOKEN) {
      const r = await fetch(`https://rtc.live.cloudflare.com/v1/turn/keys/${e.CF_TURN_KEY_ID}/credentials/generate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${e.CF_TURN_API_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ttl: 86400 })
      });
      const j = await r.json();
      return res.status(200).json({ iceServers: [].concat(j.iceServers || []) });
    }
    if (e.METERED_APP && e.METERED_KEY) {
      const r = await fetch(`https://${e.METERED_APP}.metered.live/api/v1/turn/credentials?apiKey=${e.METERED_KEY}`);
      return res.status(200).json({ iceServers: await r.json() });
    }
  } catch (err) {}
  res.status(200).json({ iceServers: [] });
};
