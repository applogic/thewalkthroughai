import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

const THRESHOLD = 0.95;

export function SlideToVerify({ onVerify, verified }: { onVerify: () => void; verified: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const knob = knobRef.current;
    if (!track || !knob) return 0;
    const max = track.clientWidth - knob.offsetWidth;
    setMaxOffset(max);
    return max;
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    setOffset(verified ? measure() : 0);
  }, [verified, measure]);

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (verified) return;
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || verified) return;
    const track = trackRef.current;
    const knob = knobRef.current;
    if (!track || !knob) return;
    const rect = track.getBoundingClientRect();
    const max = track.clientWidth - knob.offsetWidth;
    setOffset(Math.max(0, Math.min(e.clientX - rect.left - knob.offsetWidth / 2, max)));
  }

  function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || verified) return;
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const max = maxOffset || measure();
    if (max > 0 && offset >= max * THRESHOLD) {
      setOffset(max);
      onVerify();
    } else {
      setOffset(0);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (verified) return;
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight" || e.key === "End") {
      e.preventDefault();
      setOffset(measure());
      onVerify();
    }
  }

  const pct = maxOffset > 0 ? (offset / maxOffset) * 100 : 0;
  const transition = draggingRef.current ? "none" : undefined;

  return (
    <div className="select-none">
      <p className="micro mb-3 text-white/40">Human verification</p>
      <div ref={trackRef} className="relative h-12 overflow-hidden rounded-full border border-white/15">
        <div
          className="absolute left-0 top-0 h-full bg-ember/15 transition-[width] duration-300"
          style={{ transition, width: `${pct}%` }}
        />
        <span
          className={`micro pointer-events-none absolute inset-0 flex items-center justify-center ${
            verified ? "text-ember" : "text-white/35"
          }`}
        >
          {verified ? "Verified" : "Slide to verify"}
        </span>
        <div
          ref={knobRef}
          aria-label="Slide to verify you are human"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(pct)}
          className={`absolute top-0 flex h-12 w-12 touch-none items-center justify-center rounded-full transition-[left] duration-300 ${
            verified ? "cursor-default bg-ember text-void" : "cursor-grab bg-white/10 text-white/70 hover:bg-white/15 active:cursor-grabbing"
          }`}
          onKeyDown={handleKeyDown}
          onPointerCancel={handlePointerUp}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          role="slider"
          style={{ left: `${offset}px`, transition }}
          tabIndex={verified ? -1 : 0}
        >
          {verified ? <Check size={16} /> : <ArrowRight size={16} />}
        </div>
      </div>
    </div>
  );
}
