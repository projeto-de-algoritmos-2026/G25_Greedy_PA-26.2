"use client";

import { useEffect, useState } from "react";

// tempo entre passos (ms)
export const STEP_DELAY_MS = 1500;

export function useStepPlayer(total: number) {
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(true);

  const last = Math.max(0, total - 1);
  const atEnd = index >= last;
  const playing = running && !atEnd;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(
      () => setIndex((i) => Math.min(i + 1, last)),
      STEP_DELAY_MS,
    );
    return () => window.clearTimeout(id);
  }, [playing, index, last]);

  function toggle() {
    setRunning((r) => !r);
  }

  function restart() {
    setIndex(0);
    setRunning(true);
  }

  return { index, total, playing, atEnd, toggle, restart };
}

export type StepPlayer = ReturnType<typeof useStepPlayer>;
