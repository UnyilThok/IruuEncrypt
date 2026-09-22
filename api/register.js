module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('method not allowed');
  return res.status(200).json({ ok: true, note: 'register handled client-side via Pastefy' });
};