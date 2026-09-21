module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('method not allowed');
  const SCRIPTS = globalThis._irru || (globalThis._irru = {});
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!body || !body.id || !body.cipher) return res.status(400).send('bad bundle');
    SCRIPTS[body.id] = body;
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: true, id: body.id });
  } catch (e) {
    return res.status(400).send('parse error');
  }
};