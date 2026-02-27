## Puasa Tracker

### What’s included
- Homepage banner: progress bar + total puasa (persistent via Convex)
- New route: `/check-in`
  - Check-in untuk **hari ini** atau **kemarin**
  - Status: **Puasa** / **Tidak Puasa**
  - Jika **Tidak Puasa**: alasan wajib (min 5 karakter)
  - Check-in **locked** (tidak bisa edit setelah submit)

### Screenshots

**Homepage**

![Homepage Puasa Tracker](./pr-screenshots/home-puasa-tracker.png)

**Check-in page**

![Check-in](./pr-screenshots/check-in.png)

### Setup notes (Convex)
Tambahkan env var:
- `VITE_CONVEX_URL=...`

Lalu jalankan Convex dev / deploy sesuai project Convex kamu.
