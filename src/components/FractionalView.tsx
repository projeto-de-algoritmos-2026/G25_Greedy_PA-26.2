"use client";

import type { FractionalResult, Task } from "@/lib/knapsack";
import { useStepPlayer } from "@/hooks/useStepPlayer";
import { formatNumber, formatPercent } from "@/lib/time";
import { StepControls, StepMessage } from "./StepControls";
import { DayBar, type DaySegment } from "./DayBar";
import { ResultSummary } from "./ResultSummary";

export function FractionalView({
  result,
  tasks,
  colorOf,
}: {
  result: FractionalResult;
  tasks: Task[];
  colorOf: (id: string) => string;
}) {
  const player = useStepPlayer(result.steps.length);
  const step = result.steps[player.index];
  const byId = new Map(tasks.map((t) => [t.id, t]));

  const segments: DaySegment[] = step.order
    .filter((id) => (step.taken[id] ?? 0) > 0)
    .map((id) => {
      const task = byId.get(id)!;
      const fraction = step.taken[id];
      return {
        id,
        name: task.name,
        minutes: task.minutes * fraction,
        fraction,
        color: colorOf(id),
      };
    });

  const hasRatios = Object.keys(step.ratios).length > 0;

  return (
    <div className="flex flex-col gap-5">
      <StepControls player={player} />
      <StepMessage>{step.message}</StepMessage>
      <DayBar
        capacity={result.capacity}
        segments={segments}
        highlightId={step.currentTaskId}
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="px-3 py-2 font-medium">Tarefa</th>
              <th className="px-3 py-2 font-medium">Duração (min)</th>
              <th className="px-3 py-2 font-medium">Prioridade</th>
              <th className="px-3 py-2 font-medium">Prioridade / min</th>
              <th className="px-3 py-2 font-medium">Na mochila</th>
            </tr>
          </thead>
          <tbody>
            {step.order.map((id) => {
              const task = byId.get(id)!;
              const fraction = step.taken[id];
              const current = step.currentTaskId === id;
              return (
                <tr
                  key={id}
                  className={`border-t border-line ${current ? "bg-accent-50 font-semibold" : ""}`}
                >
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: colorOf(id) }}
                      />
                      {task.name}
                    </span>
                  </td>
                  <td className="px-3 py-2 tabular-nums">{task.minutes}</td>
                  <td className="px-3 py-2 tabular-nums">{task.priority}</td>
                  <td className="px-3 py-2 font-mono text-xs tabular-nums">
                    {hasRatios ? formatNumber(step.ratios[id], 4) : "?"}
                  </td>
                  <td className="px-3 py-2 tabular-nums">
                    {fraction === undefined ? "-" : formatPercent(fraction)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {step.kind === "done" && (
        <ResultSummary
          allocations={result.allocations}
          tasks={tasks}
          capacity={result.capacity}
          totalValue={result.totalValue}
          usedMinutes={result.usedMinutes}
          colorOf={colorOf}
        />
      )}
    </div>
  );
}
