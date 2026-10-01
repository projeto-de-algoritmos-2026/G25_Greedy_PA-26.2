"use client";

import { Card, Field, inputClass } from "./ui";
import { MINUTES_PER_DAY, formatMinutes } from "@/lib/time";

export function DayCard({
  capacity,
  onChange,
}: {
  capacity: number;
  onChange: (capacity: number) => void;
}) {
  return (
    <Card
      step={1}
      title="Tempo livre"
      description="Quantos minutos você tem para as tarefas? Esse tempo é a capacidade da mochila."
    >
      <div className="max-w-xs">
        <Field
          label="Tempo livre (minutos)"
          htmlFor="day-minutes"
          hint={`= ${formatMinutes(capacity)}`}
        >
          <input
            id="day-minutes"
            type="number"
            min={0}
            max={MINUTES_PER_DAY}
            step={5}
            className={inputClass}
            value={capacity}
            onChange={(e) =>
              onChange(
                Math.min(MINUTES_PER_DAY, Math.max(0, Number(e.target.value) || 0)),
              )
            }
          />
        </Field>
      </div>
    </Card>
  );
}
