import type { Allocation, Task } from "@/lib/knapsack";
import { formatMinutes, formatNumber, formatPercent } from "@/lib/time";

/** Agenda final: o que fazer no dia, na ordem em que o algoritmo escolheu. */
export function ResultSummary({
  allocations,
  tasks,
  capacity,
  totalValue,
  usedMinutes,
  colorOf,
}: {
  allocations: Allocation[];
  tasks: Task[];
  capacity: number;
  totalValue: number;
  usedMinutes: number;
  colorOf: (id: string) => string;
}) {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const chosen = new Set(allocations.map((a) => a.taskId));
  const left = tasks.filter((t) => !chosen.has(t.id));

  return (
    <div className="grid gap-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-4 sm:grid-cols-[1fr_auto]">
      <div>
        <h3 className="text-sm font-semibold">Agenda sugerida</h3>
        <ol className="mt-2 flex flex-col gap-1.5">
          {allocations.map((a, i) => {
            const task = byId.get(a.taskId)!;
            return (
              <li key={a.taskId} className="flex items-center gap-2 text-sm">
                <span className="w-5 text-xs tabular-nums text-muted">{i + 1}.</span>
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: colorOf(a.taskId) }}
                />
                <span className="flex-1">{task.name}</span>
                <span className="tabular-nums text-muted">
                  {formatMinutes(a.minutes)}
                  {a.fraction < 1 && ` (${formatPercent(a.fraction)})`}
                </span>
              </li>
            );
          })}
        </ol>
        {left.length > 0 && (
          <p className="mt-3 text-xs text-muted">
            Ficaram para outro dia: {left.map((t) => t.name).join(", ")}.
          </p>
        )}
      </div>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-1">
        <Stat label="Valor de prioridade" value={formatNumber(totalValue)} />
        <Stat
          label="Tempo usado"
          value={`${formatMinutes(usedMinutes)} de ${formatMinutes(capacity)}`}
        />
      </dl>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface px-4 py-2.5">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="text-lg font-bold tabular-nums">{value}</dd>
    </div>
  );
}
