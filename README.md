# Daftar Tugas Kuliah

Aplikasi web sederhana untuk mengelola tugas kuliah: tambah, edit, hapus, dan tandai status
(Belum Selesai / Selesai). Dibuat dengan **TypeScript** dan **Vite** untuk mata kuliah
Pengembangan Aplikasi Web.

## Menjalankan

```bash
npm install        # pasang dependency
cp .env.example .env   # (Windows: copy .env.example .env)
npm run dev        # server pengembangan
npm run build      # cek tipe (tsc) + build produksi ke folder dist/
npm run preview    # coba hasil build
```

## Skrip npm

| Skrip | Fungsi |
|---|---|
| `npm run dev` | Menjalankan Vite dev server dengan HMR |
| `npm run build` | `tsc && vite build`: memeriksa tipe lalu membuat build produksi |
| `npm run preview` | Menjalankan hasil build secara lokal |
| `npm run typecheck` | `tsc --noEmit`: hanya memeriksa tipe |

## Dependencies

- `devDependencies`: `typescript` dan `vite` (alat pengembangan/build, tidak dibawa ke produksi).
- `dependencies`: kosong, aplikasi tidak memakai library runtime.
- Versi memakai semantic versioning dengan caret (`^5.0.0`, `^7.0.0`): pembaruan minor/patch
  diizinkan, perubahan major tidak. `package-lock.json` mengunci versi agar instalasi konsisten.

## Variabel lingkungan

`.env` tidak diunggah ke GitHub (lihat `.gitignore`). Contoh isinya ada di `.env.example`.

| Variabel | Fungsi |
|---|---|
| `VITE_APP_NAME` | Nama aplikasi di judul halaman |
| `VITE_APP_VERSION` | Versi aplikasi yang tampil di header |

Semua variabel `VITE_*` terlihat di browser, jadi hanya dipakai untuk konfigurasi non-rahasia.
**Jangan** menyimpan password, API key, atau secret di sini.

## Penerapan TypeScript

| Konsep | Lokasi |
|---|---|
| Tipe primitif (`string`, `number`, `boolean`) | `src/main.ts` (`appName`, `total`, `hasTasks`), `src/utils.ts` |
| Array | `src/main.ts` (`seedTasks: Task[]`), `src/config.ts` (`COURSES: string[]`) |
| Interface | `src/types.ts` (`Task`) |
| Type alias dan union type | `src/types.ts` (`TaskId`, `Status`, `FilterStatus`) |
| Generic | `src/storage.ts` (`loadData<T>`, `saveData<T>`), `src/utils.ts` (`filterBy<T>`) |

## Struktur proyek

```
index.html          entry point
src/main.ts         logika dan tampilan aplikasi
src/types.ts        interface dan type alias
src/config.ts       konfigurasi dari .env + data mata kuliah
src/storage.ts      penyimpanan localStorage (generic)
src/utils.ts        fungsi bantu (generic, tanggal)
src/style.css       gaya tampilan
```

Data tersimpan di `localStorage` browser, jadi tidak ada server atau secret yang dibutuhkan.
