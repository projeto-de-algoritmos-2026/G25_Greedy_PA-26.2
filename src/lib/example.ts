import type { Task } from "./knapsack";

// 330 min livres
export const EXAMPLE_CAPACITY = 330;

export const EXAMPLE_TASKS: Task[] = [
  { id: "ex-1", name: "Lista de exercícios de grafos", minutes: 120, priority: 9 },
  { id: "ex-2", name: "Revisar slides de PA", minutes: 60, priority: 7 },
  { id: "ex-3", name: "Academia", minutes: 90, priority: 4 },
  { id: "ex-4", name: "Responder e-mails", minutes: 30, priority: 3 },
  { id: "ex-5", name: "Projeto da disciplina", minutes: 150, priority: 10 },
  { id: "ex-6", name: "Ler um capítulo do livro", minutes: 60, priority: 2 },
];
