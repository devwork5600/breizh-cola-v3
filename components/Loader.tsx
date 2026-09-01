"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

import { useAnimationStore } from "@/store/useAnimationStore";

// Safety net: if the loading manager never reports 100% (e.g. a page with
// nothing to load, or a stalled request), don't block the site forever.
const MAX_WAIT_MS = 10000;

export default function Loader() {
  const { active, progress } = useProgress();
  const introPlayed = useAnimationStore((state) => state.introPlayed);

  // `introPlayed` (sessionStorage) and the live loading progress can already
  // differ from the server's render by the time the client hydrates. Gate
  // everything behind `mounted` so the server-rendered markup and the first
  // client render are always identical, then let the effects below correct
  // it right after hydration.
  const [mounted, setMounted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Latch: once we've seen everything finish loading, stay hidden even if
  // the manager becomes active again later (e.g. a texture lazily loaded
  // when switching product variant) so the loader only ever gates the
  // initial load.
  const [done, setDone] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    const timeout = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    return useProgress.subscribe((state) => {
      if (!state.active && state.progress >= 100) setDone(true);
    });
  }, []);

  const loadingDone = done || (!active && progress >= 100);
  const isReady = mounted && (timedOut || loadingDone || introPlayed);

  return (
    <div
      aria-hidden={isReady}
      className="bg-primary fixed inset-0 z-9999 flex items-center justify-center"
      style={{
        opacity: isReady ? 0 : 1,
        pointerEvents: isReady ? "none" : "auto",
        transition: mounted ? "opacity 0.5s ease-out" : "none",
      }}
    >
      <div className="text-center">
        <div className="bg-secondary/20 h-1 w-50 overflow-hidden rounded-full">
          <div
            className="bg-secondary h-full transition-[width] duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="font-poppins text-secondary mt-4 text-sm">
          {Math.round(Math.min(progress, 100))}%
        </p>
      </div>
    </div>
  );
}
