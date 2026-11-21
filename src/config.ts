// Konfigurasi non-rahasia dibaca dari file .env (prefix VITE_).
// Nilai cadangan dipakai bila variabel tidak diisi (mis. saat deploy tanpa .env).
export const APP_NAME: string = import.meta.env.VITE_APP_NAME ?? "Daftar Tugas Kuliah";
export const APP_VERSION: string = import.meta.env.VITE_APP_VERSION ?? "1.0.0";

export const STORAGE_KEY = "daftar-tugas-kuliah";

export const COURSES: string[] = [
  "Manajemen Basis Data",
  "Jaringan Komputer",
  "Pengembangan Aplikasi Web",
  "Interaksi Manusia dan Komputer",
  "Intelegensi Buatan",
  "Manajemen Proyek Perangkat Lunak",
  "Pengembangan Aplikasi Mobile",
  "Kewirausahaan & Etika Bisnis",
];
