# IrruuEncrypt

Protected Script Hub — AES-256, hardening, blacklist IP+device, private upload.

## Struktur
- index.html
- api/handler.js
- api/register.js

## Deploy
1. Push ke GitHub
2. Import ke Vercel → framework Other → Deploy
3. (Opsional) Set env IRRU_HMAC_SECRET → Redeploy

## Cara Kerja
- Client generate script → upload cipher ke Pastefy (unlisted)
- Pastefy ID menjadi token URL
- /api/<pastefy-id> → handler fetch dari Pastefy → return cipher
- Persistent lintas instance Vercel (anti cold-start)