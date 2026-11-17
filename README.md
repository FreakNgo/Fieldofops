# Vortex Strike
Static game + one tiny serverless function (`api/turn.js`). Gameplay is true WebRTC peer-to-peer (PeerJS).

## Deploy (Vercel)
`vercel --prod` (or import the folder from Git).

## Make PC <-> phone work on ANY network (recommended)
Phones on mobile data usually need a TURN relay. Free option (Cloudflare Realtime TURN):
1. Cloudflare dashboard > Realtime > TURN > create a key.
2. In Vercel add env vars `CF_TURN_KEY_ID` and `CF_TURN_API_TOKEN`, redeploy.
(Or Metered: `METERED_APP` + `METERED_KEY`.) Without these the game falls back to a shared public relay that may be unreliable.

## Poki
Upload the folder as a static build (the `api/` folder is ignored; the public fallback relay is used).

## Controls
WASD move, Shift run, Run + C slide, C/Ctrl crouch, R reload, 1-3 weapons, RMB zoom. Mobile: joystick (push far = run), drag to aim, on-screen buttons.
