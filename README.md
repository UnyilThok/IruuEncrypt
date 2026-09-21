# IrruuEncrypt

Protected Script Hub — AES-256 encryption, hardening layer, blacklist IP+device, private upload ke Pastefy/Pastebin.

## Struktur
- `index.html` — UI utama (gate + generator + hardening + blacklist + private upload)
- `api/handler.js` — verifier serverless
- `api/register.js` — endpoint daftar script

## Deploy ke Vercel
1. Push repo ke GitHub
2. Buka vercel.com → Add New Project → Import repo
3. Framework Preset: **Other** → Root: `./` → Deploy
4. Settings → Environment Variables → `IRRU_HMAC_SECRET` = random string → Save
5. Redeploy

## URL
- UI: `https://iruu-encrypt.vercel.app/`
- API: `https://iruu-encrypt.vercel.app/api/<TOKEN>`

## Default gate password
`admin123`
Ganti via Console: `localStorage.setItem('irru_gate_pw','passwordbaru')`