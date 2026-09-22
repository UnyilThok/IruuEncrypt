const crypto = require('crypto');

const NONCE_TTL = 60_000;
const USED_NONCE = globalThis._irruNonce || (globalThis._irruNonce = new Map());

setInterval(() => {
  const now = Date.now();
  for (const [n, t] of USED_NONCE) if (now - t > NONCE_TTL) USED_NONCE.delete(n);
}, 30_000);

module.exports = async function handler(req, res) {
  const token = req.query.token;
  const op    = req.query.op;
  const dev   = req.query.dev || '';
  const nonce = req.query.n || '';

  const ua = (req.headers['user-agent'] || '').toLowerCase();
  if (ua.includes('curl') || ua.includes('wget') || ua.includes('python') ||
      ua.includes('httpie') || ua.includes('postman')) {
    return res.status(403).send('forbidden');
  }

  if (!token) return res.status(400).send('missing token');

  let script = globalThis._irru && globalThis._irru[token];

  if (!script) {
    try {
      const r = await fetch('https://pastefy.app/api/v2/paste/' + token);
      if (!r.ok) return res.status(404).send('not found');
      const d = await r.json();
      const content = (d.paste && d.paste.content) || d.content;
      if (!content) return res.status(404).send('empty');
      script = JSON.parse(content);
      if (!globalThis._irru) globalThis._irru = {};
      globalThis._irru[token] = script;
    } catch (e) {
      return res.status(404).send('fetch failed');
    }
  }

  if (script.hardening?.envGuard && script.allowDevices && !script.allowDevices.includes(dev)) {
    return res.status(403).send('device not allowed');
  }

  if (op === 'nonce') {
    const n = crypto.randomBytes(16).toString('hex');
    USED_NONCE.set(n, Date.now());
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(n);
  }

  if (op === 'payload') {
    if (!nonce || !USED_NONCE.has(nonce)) return res.status(403).send('nonce invalid');
    if (Date.now() - USED_NONCE.get(nonce) > NONCE_TTL) {
      USED_NONCE.delete(nonce);
      return res.status(403).send('nonce expired');
    }
    USED_NONCE.delete(nonce);

    const secret = process.env.IRRU_HMAC_SECRET || 'change-me';
    const ts = Date.now();
    const mac = crypto.createHmac('sha256', secret)
      .update(token + dev + nonce + ts)
      .digest('hex').slice(0, 32);

    const wm = script.hardening?.watermark ? "\n-- " + dev + "\n" : "";
    const meta = "ts=" + ts + ";mac=" + mac;

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex');
    return res.status(200).send(meta + "\n" + script.cipher + wm);
  }

  return res.status(400).send('bad request');
};
