"use client";

import type { Task } from "@/lib/knapsack";
import { formatMinutes } from "@/lib/time";
import { Button } from "./ui";

export function TaskList({
  tasks,
  capacity,
  colorOf,
  onRemove,
}: {
  tasks: Task[];
  capacity: number;
  colorOf: (id: string) => string;
  onRemove: (id: string) => void;
}) {
  const requested = tasks.reduce((acc, t) => acc + t.minutes, 0);
  const overflow = requested - capacity;

  if (tasks.length === 0) {
    return (
      <div className="flex h-full min-h-40 items-center justify-center rounded-lg border border-dashed border-line p-6 text-center text-sm text-muted">
        Nenhuma tarefa ainda. Adicione ao lado ou carregue o exemplo.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-3 rounded-lg border border-line px-3 py-2"
          >
            <span
              aria-hidden
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ background: colorOf(task.id) }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{task.name}</p>
              <p className="text-xs text-muted">
                {task.minutes} min · prioridade {task.priority}
              </p>
            </div>
            <Button
              variant="ghost"
              className="px-2 py-1"
              aria-label={`Remover ${task.name}`}
              onClick={() => onRemove(task.id)}
            >
              Remover
            </Button>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">
        {tasks.length} tarefa(s), somando {requested} min ({formatMinutes(requested)}).{" "}
        {overflow > 0
          ? `Passa ${overflow} min do tempo livre: o algoritmo vai ter que escolher.`
          : "Tudo cabe no dia."}
      </p>
    </div>
  );
}
