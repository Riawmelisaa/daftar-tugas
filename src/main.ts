import "./style.css";
import { APP_NAME, APP_VERSION, COURSES, STORAGE_KEY } from "./config";
import { loadData, saveData } from "./storage";
import type { FilterStatus, Status, Task, TaskId } from "./types";
import { addDaysISO, createId, filterBy, formatDate, isOverdue } from "./utils";

// ---------- Tipe primitif ----------
const appName: string = APP_NAME;
const appVersion: string = APP_VERSION;
let editingId: TaskId | null = null;
let currentFilter: FilterStatus = "semua";

// ---------- Array bertipe ----------
const seedTasks: Task[] = [
  {
    id: createId(),
    title: "Membuat aplikasi daftar tugas dengan Vite + TypeScript",
    course: "Pengembangan Aplikasi Web",
    deadline: addDaysISO(3),
    status: "belum",
    note: "Upload ke GitHub dan tampilkan di website pribadi.",
  },
  {
    id: createId(),
    title: "Merancang ERD untuk studi kasus perpustakaan",
    course: "Manajemen Basis Data",
    deadline: addDaysISO(7),
    status: "belum",
  },
  {
    id: createId(),
    title: "Membuat profil diri dengan HTML5",
    course: "Pengembangan Aplikasi Web",
    deadline: addDaysISO(-2),
    status: "selesai",
  },
];

let tasks: Task[] = loadData<Task[]>(STORAGE_KEY, seedTasks);

// ---------- Elemen DOM ----------
function el<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Elemen #${id} tidak ditemukan`);
  return found as T;
}

const form = el<HTMLFormElement>("task-form");
const titleInput = el<HTMLInputElement>("task-title");
const courseSelect = el<HTMLSelectElement>("task-course");
const deadlineInput = el<HTMLInputElement>("task-deadline");
const noteInput = el<HTMLTextAreaElement>("task-note");
const submitBtn = el<HTMLButtonElement>("submit-btn");
const cancelBtn = el<HTMLButtonElement>("cancel-btn");
const formTitle = el<HTMLHeadingElement>("form-title");
const list = el<HTMLUListElement>("task-list");
const emptyState = el<HTMLParagraphElement>("empty-state");
const summary = el<HTMLParagraphElement>("summary");
const filterButtons = document.querySelectorAll<HTMLButtonElement>("[data-filter]");

// ---------- Inisialisasi tampilan ----------
document.title = `${appName} | Ria Melisa`;
el<HTMLElement>("app-name").textContent = appName;
el<HTMLElement>("app-version").textContent = `v${appVersion}`;

for (const course of COURSES) {
  const option = document.createElement("option");
  option.value = course;
  option.textContent = course;
  courseSelect.append(option);
}

// ---------- Logika data ----------
function persist(): void {
  saveData<Task[]>(STORAGE_KEY, tasks);
}

function statusLabel(status: Status): string {
  return status === "selesai" ? "Selesai" : "Belum Selesai";
}

function visibleTasks(): Task[] {
  const byFilter = currentFilter === "semua" ? tasks : filterBy(tasks, (t) => t.status === currentFilter);
  return [...byFilter].sort((a, b) => a.deadline.localeCompare(b.deadline));
}

function toggleStatus(id: TaskId): void {
  tasks = tasks.map((t) => (t.id === id ? { ...t, status: t.status === "selesai" ? "belum" : "selesai" } : t));
  persist();
  render();
}

function removeTask(id: TaskId): void {
  const target = tasks.find((t) => t.id === id);
  if (!target) return;
  if (!window.confirm(`Hapus tugas "${target.title}"?`)) return;
  tasks = filterBy(tasks, (t) => t.id !== id);
  if (editingId === id) resetForm();
  persist();
  render();
}

function startEdit(id: TaskId): void {
  const target = tasks.find((t) => t.id === id);
  if (!target) return;
  editingId = id;
  titleInput.value = target.title;
  courseSelect.value = target.course;
  deadlineInput.value = target.deadline;
  noteInput.value = target.note ?? "";
  formTitle.textContent = "Edit Tugas";
  submitBtn.textContent = "Simpan Perubahan";
  cancelBtn.hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  titleInput.focus();
}

function resetForm(): void {
  editingId = null;
  form.reset();
  formTitle.textContent = "Tambah Tugas Baru";
  submitBtn.textContent = "Tambah Tugas";
  cancelBtn.hidden = true;
}

// ---------- Render (memakai textContent agar aman dari XSS) ----------
function actionButton(label: string, ariaLabel: string, className: string, onClick: () => void): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `btn ${className}`;
  btn.textContent = label;
  btn.setAttribute("aria-label", ariaLabel);
  btn.addEventListener("click", onClick);
  return btn;
}

function renderTask(task: Task): HTMLLIElement {
  const item = document.createElement("li");
  item.className = `task task--${task.status}`;

  const body = document.createElement("div");
  body.className = "task__body";

  const title = document.createElement("h3");
  title.className = "task__title";
  title.textContent = task.title;

  const meta = document.createElement("p");
  meta.className = "task__meta";
  meta.textContent = `${task.course} · Tenggat ${formatDate(task.deadline)}`;

  const badges = document.createElement("p");
  badges.className = "task__badges";

  const badge = document.createElement("span");
  badge.className = `badge badge--${task.status}`;
  badge.textContent = statusLabel(task.status);
  badges.append(badge);

  if (isOverdue(task)) {
    const late = document.createElement("span");
    late.className = "badge badge--late";
    late.textContent = "Lewat tenggat";
    badges.append(late);
  }

  body.append(title, meta, badges);

  if (task.note) {
    const note = document.createElement("p");
    note.className = "task__note";
    note.textContent = task.note;
    body.append(note);
  }

  const actions = document.createElement("div");
  actions.className = "task__actions";
  actions.append(
    actionButton(
      task.status === "selesai" ? "Tandai Belum" : "Tandai Selesai",
      `${task.status === "selesai" ? "Tandai belum selesai" : "Tandai selesai"}: ${task.title}`,
      "btn--ghost",
      () => toggleStatus(task.id),
    ),
    actionButton("Edit", `Edit tugas: ${task.title}`, "btn--ghost", () => startEdit(task.id)),
    actionButton("Hapus", `Hapus tugas: ${task.title}`, "btn--danger", () => removeTask(task.id)),
  );

  item.append(body, actions);
  return item;
}

function render(): void {
  const shown: Task[] = visibleTasks();
  list.replaceChildren(...shown.map(renderTask));

  const total: number = tasks.length;
  const done: number = filterBy(tasks, (t) => t.status === "selesai").length;
  const hasTasks: boolean = total > 0;
  summary.textContent = `${total} tugas, ${done} selesai, ${total - done} belum selesai`;

  emptyState.hidden = shown.length > 0;
  if (shown.length === 0) {
    emptyState.textContent = hasTasks
      ? "Tidak ada tugas dengan status ini."
      : "Belum ada tugas. Tambahkan tugas pertamamu lewat formulir di atas.";
  }

  filterButtons.forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.filter === currentFilter));
  });
}

// ---------- Event ----------
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title: string = titleInput.value.trim();
  if (!title) {
    titleInput.focus();
    return;
  }

  const note: string = noteInput.value.trim();
  const base = { title, course: courseSelect.value, deadline: deadlineInput.value, note: note || undefined };

  if (editingId !== null) {
    tasks = tasks.map((t) => (t.id === editingId ? { ...t, ...base } : t));
  } else {
    tasks = [...tasks, { id: createId(), status: "belum", ...base }];
  }

  persist();
  resetForm();
  render();
});

cancelBtn.addEventListener("click", resetForm);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter as FilterStatus;
    render();
  });
});

render();
