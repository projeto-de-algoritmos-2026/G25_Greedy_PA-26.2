import { formatMinutes, formatPercent } from "@/lib/time";

export interface DaySegment {
  id: string;
  name: string;
  minutes: number;
  fraction: number;
  color: string;
}

/**
 * A "mochila": uma barra horizontal do tamanho do tempo livre, preenchida
 * pelas tarefas escolhidas.
 */
export function DayBar({
  capacity,
  segments,
  highlightId,
}: {
  capacity: number;
  segments: DaySegment[];
  highlightId?: string | null;
}) {
  const used = segments.reduce((acc, s) => acc + s.minutes, 0);
  const free = Math.max(0, capacity - used);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between text-xs text-muted">
        <span>Seu dia ({formatMinutes(capacity)})</span>
        <span>
          Usado {formatMinutes(used)} · Livre {formatMinutes(free)}
        </span>
      </div>
      <div
        className="flex h-12 w-full overflow-hidden rounded-xl border border-line bg-[repeating-linear-gradient(135deg,var(--color-canvas),var(--color-canvas)_8px,var(--color-line)_8px,var(--color-line)_9px)]"
        role="img"
        aria-label={`Tempo usado: ${formatMinutes(used)} de ${formatMinutes(capacity)}`}
      >
        {capacity > 0 &&
          segments.map((s) => (
            <div
              key={s.id}
              title={`${s.name}: ${formatMinutes(s.minutes)}${s.fraction < 1 ? ` (${formatPercent(s.fraction)})` : ""}`}
              className={`flex items-center justify-center overflow-hidden border-r border-white/70 text-[11px] font-semibold text-white transition-all duration-500 ${
                highlightId === s.id ? "brightness-110 saturate-150" : ""
              }`}
              style={{
                width: `${(s.minutes / capacity) * 100}%`,
                background: s.color,
                backgroundImage:
                  s.fraction < 1
                    ? "repeating-linear-gradient(45deg, rgba(255,255,255,.25) 0 6px, transparent 6px 12px)"
                    : undefined,
              }}
            >
              <span className="truncate px-1">{s.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
