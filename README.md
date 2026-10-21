# Web Jajan Dulu!

Web profil satu halaman untuk proyek kewirausahaan Jajan Dulu!. Dibuat dengan Vite, React, TypeScript, GSAP ScrollTrigger, dan Lenis.

## Menjalankan

```bash
npm install
npm run dev
```

## Data yang perlu diisi sebelum publikasi

- `src/data/kontak.ts`: nomor WhatsApp (format `62...` tanpa tanda plus), tautan dan handle Instagram serta TikTok, nama dan peran anggota.
- `src/data/varian.ts`: cerita dan resep tiap jajanan. Resep di sana resep rumahan umum, jadi cek ulang takarannya.

## Tautan untuk QR recipe tag

Setiap karakter punya tautan yang langsung membuka modal resepnya:

- `https://domainmu/#klepon`
- `https://domainmu/#onde-onde`
- `https://domainmu/#kue-lapis`
- `https://domainmu/#kue-lumpur`
- `https://domainmu/#serabi`

## Deploy

```bash
npm run build
```

Hasilnya ada di folder `dist`. Unggah ke hosting statis (Netlify, Vercel, atau Cloudflare Pages), lalu sambungkan domain di pengaturan hosting tersebut. Di Netlify dan Vercel, cukup hubungkan repo dengan perintah build `npm run build` dan folder output `dist`.
