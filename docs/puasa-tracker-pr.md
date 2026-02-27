## Puasa Tracker

### What’s included
- Homepage banner: progress bar + total puasa (persistent via **localStorage**)
- New route: `/check-in`
  - Check-in untuk **hari ini** atau **kemarin**
  - Status: **Puasa** / **Tidak Puasa**
  - Jika **Tidak Puasa**: alasan wajib (min 5 karakter)
  - Check-in **locked** (tidak bisa edit setelah submit)

### Screenshots

**Homepage**

![Homepage Puasa Tracker](./pr-screenshots/home-puasa-tracker-checkpoints-loaded.png)

**Check-in page**

![Check-in](./pr-screenshots/check-in-timezone-fix.png)

### Notes
- Data tersimpan di `localStorage`, jadi sifatnya **per-browser/per-device**.
