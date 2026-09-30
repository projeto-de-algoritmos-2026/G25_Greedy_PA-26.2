import type { Allocation, Task } from "./types";
import { formatMinutes, formatNumber, formatPercent } from "../time";

/**
 * Knapsack fracionário (algoritmo guloso).
 *
 * Peso  = duração da tarefa em minutos
 * Valor = prioridade da tarefa
 *
 * 1. Calcula a razão valor/peso (prioridade por minuto) de cada tarefa.
 * 2. Ordena as tarefas da maior razão para a menor.
 * 3. Percorre a lista colocando cada tarefa inteira enquanto couber.
 * 4. Quando a próxima tarefa não couber inteira, coloca só a fração
 *    que preenche o tempo restante e para.
 *
 * Complexidade: O(n log n) por causa da ordenação.
 */

export type FractionalStepKind =
  | "start"
  | "ratios"
  | "sort"
  | "consider"
  | "take-full"
  | "take-partial"
  | "skip"
  | "done";

export interface FractionalStep {
  kind: FractionalStepKind;
  message: string;
  /** Tarefa em destaque neste passo */
  currentTaskId: string | null;
  /** Ordem em que as tarefas aparecem na tela neste passo */
  order: string[];
  /** Razões já calculadas (vazio antes do passo "ratios") */
  ratios: Record<string, number>;
  /** Fração já colocada na mochila por tarefa */
  taken: Record<string, number>;
  remaining: number;
  totalValue: number;
}

export interface FractionalResult {
  capacity: number;
  ratios: Record<string, number>;
  sortedIds: string[];
  allocations: Allocation[];
  usedMinutes: number;
  totalValue: number;
  steps: FractionalStep[];
}

export function ratioOf(task: Task): number {
  return task.minutes > 0 ? task.priority / task.minutes : 0;
}

/** Maior razão primeiro; empate: maior prioridade, depois tarefa mais curta. */
function compareByRatio(a: Task, b: Task): number {
  const diff = ratioOf(b) - ratioOf(a);
  if (diff !== 0) return diff;
  if (b.priority !== a.priority) return b.priority - a.priority;
  return a.minutes - b.minutes;
}

export function solveFractional(
  tasks: Task[],
  capacity: number,
): FractionalResult {
  const steps: FractionalStep[] = [];
  const taken: Record<string, number> = {};
  let ratios: Record<string, number> = {};
  let order = tasks.map((t) => t.id);
  let remaining = capacity;
  let totalValue = 0;

  const push = (
    kind: FractionalStepKind,
    message: string,
    currentTaskId: string | null = null,
  ) => {
    steps.push({
      kind,
      message,
      currentTaskId,
      order: [...order],
      ratios: { ...ratios },
      taken: { ...taken },
      remaining,
      totalValue,
    });
  };

  push(
    "start",
    `Temos ${formatMinutes(capacity)} livres e ${tasks.length} tarefa(s) para encaixar.`,
  );

  ratios = Object.fromEntries(tasks.map((t) => [t.id, ratioOf(t)]));
  push(
    "ratios",
    "Calculamos a razão prioridade / minuto de cada tarefa. Quanto maior, mais urgência por minuto gasto.",
  );

  const sorted = [...tasks].sort(compareByRatio);
  order = sorted.map((t) => t.id);
  push("sort", "Ordenamos as tarefas da maior razão para a menor.");

  for (const task of sorted) {
    push(
      "consider",
      `Analisando "${task.name}": precisa de ${formatMinutes(task.minutes)}, restam ${formatMinutes(remaining)}.`,
      task.id,
    );

    if (remaining <= 0) {
      taken[task.id] = 0;
      push("skip", `Não sobrou tempo, "${task.name}" fica de fora.`, task.id);
      continue;
    }

    if (task.minutes <= remaining) {
      taken[task.id] = 1;
      remaining -= task.minutes;
      totalValue += task.priority;
      push(
        "take-full",
        `"${task.name}" cabe inteira. Restam ${formatMinutes(remaining)}.`,
        task.id,
      );
    } else {
      const fraction = remaining / task.minutes;
      taken[task.id] = fraction;
      totalValue += task.priority * fraction;
      const usedNow = remaining;
      remaining = 0;
      push(
        "take-partial",
        `"${task.name}" não cabe inteira. Colocamos ${formatPercent(fraction)} dela (${formatMinutes(usedNow)}) e o dia fica cheio.`,
        task.id,
      );
    }
  }

  push(
    "done",
    `Pronto! Valor total de prioridade: ${formatNumber(totalValue)}. Tempo usado: ${formatMinutes(capacity - remaining)}.`,
  );

  const allocations: Allocation[] = sorted
    .filter((t) => (taken[t.id] ?? 0) > 0)
    .map((t) => ({
      taskId: t.id,
      fraction: taken[t.id],
      minutes: t.minutes * taken[t.id],
      value: t.priority * taken[t.id],
    }));

  return {
    capacity,
    ratios,
    sortedIds: order,
    allocations,
    usedMinutes: capacity - remaining,
    totalValue,
    steps,
  };
}
