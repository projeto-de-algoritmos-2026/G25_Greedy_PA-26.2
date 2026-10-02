"use client";

import type { StepPlayer } from "@/hooks/useStepPlayer";
import { Button } from "./ui";

export function StepControls({ player }: { player: StepPlayer }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {player.atEnd ? (
        <Button onClick={player.restart}>Rodar de novo</Button>
      ) : (
        <>
          <Button onClick={player.toggle} className="min-w-28">
            {player.playing ? "Pausar" : "Continuar"}
          </Button>
          <Button variant="secondary" onClick={player.restart}>
            Reiniciar
          </Button>
        </>
      )}
      <span className="ml-auto text-sm tabular-nums text-muted">
        Passo {player.index + 1} de {player.total}
      </span>
    </div>
  );
}

export function StepMessage({ children }: { children: string }) {
  return (
    <p
      aria-live="polite"
      className="rounded-lg border border-line bg-canvas px-4 py-3 text-sm"
    >
      {children}
    </p>
  );
}
