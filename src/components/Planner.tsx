"use client";

import { useState } from "react";
import { solveFractional, type FractionalResult, type Task } from "@/lib/knapsack";
import { taskColor } from "@/lib/priority";
import { EXAMPLE_CAPACITY, EXAMPLE_TASKS } from "@/lib/example";
import { Button, Card } from "./ui";
import { DayCard } from "./DayCard";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import { FractionalView } from "./FractionalView";

interface Run {
  id: number;
  tasks: Task[];
  capacity: number;
  result: FractionalResult;
}

export function Planner() {
  const [capacity, setCapacity] = useState(240);
  const [tasks, setTasks] = useState<Task[]>([]);
  // ordem de criação, para cada tarefa ter uma cor fixa
  const [colorIds, setColorIds] = useState<string[]>([]);
  const [run, setRun] = useState<Run | null>(null);

  const colorOf = (id: string) => taskColor(Math.max(0, colorIds.indexOf(id)));

  function addTask(task: Task) {
    setTasks((ts) => [...ts, task]);
    setColorIds((ids) => [...ids, task.id]);
  }

  function removeTask(id: string) {
    setTasks((ts) => ts.filter((t) => t.id !== id));
  }

  function loadExample() {
    setCapacity(EXAMPLE_CAPACITY);
    setTasks(EXAMPLE_TASKS);
    setColorIds((ids) => [
      ...ids,
      ...EXAMPLE_TASKS.map((t) => t.id).filter((id) => !ids.includes(id)),
    ]);
    setRun(null);
  }

  function runAlgorithm() {
    const snapshot = [...tasks];
    setRun({
      id: Date.now(),
      tasks: snapshot,
      capacity,
      result: solveFractional(snapshot, capacity),
    });
  }

  const stale =
    run !== null &&
    (run.tasks.length !== tasks.length ||
      run.tasks.some((t, i) => t !== tasks[i]) ||
      run.capacity !== capacity);

  const canRun = tasks.length > 0 && capacity > 0;

  return (
    <div className="flex flex-col gap-6">
      <DayCard capacity={capacity} onChange={setCapacity} />

      <Card
        step={2}
        title="Tarefas"
        description="Nome, duração em minutos e prioridade de cada uma."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <TaskForm onAdd={addTask} />
            <Button variant="secondary" onClick={loadExample}>
              Carregar exemplo
            </Button>
          </div>
          <TaskList
            tasks={tasks}
            capacity={capacity}
            colorOf={colorOf}
            onRemove={removeTask}
          />
        </div>
      </Card>

      <Card
        step={3}
        title="Rodar o algoritmo"
        description="Knapsack fracionário: as tarefas com mais prioridade por minuto entram primeiro, e a última pode entrar só em parte."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={runAlgorithm} disabled={!canRun}>
            Rodar algoritmo
          </Button>
          {!canRun && (
            <p className="text-sm text-muted">
              Defina um tempo livre e adicione pelo menos uma tarefa.
            </p>
          )}
          {stale && (
            <p className="text-sm text-accent-600">
              Os dados mudaram. Clique em Rodar para atualizar.
            </p>
          )}
        </div>
      </Card>

      {run && (
        <Card title="Passo a passo">
          <FractionalView
            key={run.id}
            result={run.result}
            tasks={run.tasks}
            colorOf={colorOf}
          />
        </Card>
      )}
    </div>
  );
}
