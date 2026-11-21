// ---------- Type alias & union type ----------
export type TaskId = string;
export type Status = "belum" | "selesai";
export type FilterStatus = Status | "semua";

// ---------- Interface ----------
export interface Task {
  id: TaskId;
  title: string;
  course: string;
  deadline: string; // format YYYY-MM-DD
  status: Status;
  note?: string; // properti opsional
}
