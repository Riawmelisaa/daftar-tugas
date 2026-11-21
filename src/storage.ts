// ---------- Generic: berlaku untuk tipe data apa pun ----------
export function loadData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function saveData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // penyimpanan penuh / diblokir: aplikasi tetap berjalan tanpa persist
  }
}
