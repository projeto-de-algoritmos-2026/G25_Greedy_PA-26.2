export const MIN_PRIORITY = 1;
export const MAX_PRIORITY = 10;

// cores das tarefas
const TASK_COLORS = [
  "#2f8f7a",
  "#f2b84b",
  "#6c8ebf",
  "#d98a6c",
  "#8f7ac2",
  "#4fae97",
  "#c9a227",
  "#5fa8c9",
];

export function taskColor(index: number): string {
  return TASK_COLORS[index % TASK_COLORS.length];
}
