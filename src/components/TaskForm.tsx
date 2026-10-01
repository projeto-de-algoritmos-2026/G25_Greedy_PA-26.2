"use client";

import { useState, type FormEvent } from "react";
import { Button, Field, inputClass } from "./ui";
import type { Task } from "@/lib/knapsack";
import { MINUTES_PER_DAY } from "@/lib/time";
import { MAX_PRIORITY, MIN_PRIORITY } from "@/lib/priority";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function TaskForm({ onAdd }: { onAdd: (task: Task) => void }) {
  const [name, setName] = useState("");
  const [minutes, setMinutes] = useState(60);
  const [priority, setPriority] = useState(5);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Dê um nome para a tarefa.");
      return;
    }
    if (minutes <= 0) {
      setError("A tarefa precisa durar pelo menos 1 minuto.");
      return;
    }
    onAdd({ id: newId(), name: name.trim(), minutes, priority });
    setName("");
    setError(null);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <Field label="Nome da tarefa" htmlFor="task-name">
        <input
          id="task-name"
          className={inputClass}
          placeholder="Ex.: Estudar grafos"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Duração (minutos)" htmlFor="task-minutes">
          <input
            id="task-minutes"
            type="number"
            min={1}
            max={MINUTES_PER_DAY}
            step={5}
            className={inputClass}
            value={minutes}
            onChange={(e) =>
              setMinutes(
                Math.min(MINUTES_PER_DAY, Math.max(0, Number(e.target.value) || 0)),
              )
            }
          />
        </Field>
        <Field
          label={`Prioridade (${MIN_PRIORITY} a ${MAX_PRIORITY})`}
          htmlFor="task-priority"
        >
          <input
            id="task-priority"
            type="number"
            min={MIN_PRIORITY}
            max={MAX_PRIORITY}
            className={inputClass}
            value={priority}
            onChange={(e) =>
              setPriority(
                Math.min(
                  MAX_PRIORITY,
                  Math.max(MIN_PRIORITY, Number(e.target.value) || MIN_PRIORITY),
                ),
              )
            }
          />
        </Field>
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger-500">
          {error}
        </p>
      )}

      <Button type="submit">Adicionar tarefa</Button>
    </form>
  );
}
