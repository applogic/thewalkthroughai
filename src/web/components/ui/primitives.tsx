import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";

/** Fades + rises its children once they scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "header" | "figure";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // biome-ignore lint/suspicious/noExplicitAny: single generic ref across tag names
      ref={ref as any}
      className={cn("reveal", shown && "is-in", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/** Numbered, letter-spaced section label. */
export function Kicker({
  index,
  children,
  className,
  tone = "ember",
}: {
  index?: string;
  children: ReactNode;
  className?: string;
  tone?: "ember" | "dim" | "ink";
}) {
  return (
    <p
      className={cn(
        "micro flex items-center gap-3",
        tone === "ember" && "text-ember",
        tone === "dim" && "text-[rgba(242,242,243,0.38)]",
        tone === "ink" && "text-[rgba(14,16,17,0.45)]",
        className,
      )}
    >
      {index ? (
        <>
          <span>{index}</span>
          <span aria-hidden className="h-px w-8 bg-current opacity-40" />
        </>
      ) : null}
      <span>{children}</span>
    </p>
  );
}

export function PillButton({
  children,
  href,
  onClick,
  type = "button",
  solid = false,
  disabled = false,
  className,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  solid?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5",
    "text-[0.78rem] font-medium tracking-[0.1em] uppercase transition-all duration-500",
    "disabled:cursor-not-allowed disabled:opacity-45",
    solid
      ? "bg-paper text-ink hover:bg-ember"
      : "border border-[rgba(242,242,243,0.22)] text-[rgba(242,242,243,0.82)] hover:border-ember hover:text-paper hover:shadow-[0_12px_38px_-16px_rgba(180,97,79,0.75)]",
    className,
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

/** Draggable / hover-wipe before-after comparison. */
export function CompareFrame({
  before,
  after,
  beforeLabel,
  afterLabel,
  hint,
  alt,
}: {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  hint: string;
  alt: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(62);
  const [active, setActive] = useState(false);

  function move(clientX: number) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(97, Math.max(3, next)));
  }

  return (
    <div
      ref={ref}
      className="frame group relative aspect-3/2 w-full cursor-ew-resize touch-pan-y select-none"
      onPointerMove={(event) => {
        if (event.pointerType === "mouse" || active) move(event.clientX);
      }}
      onPointerDown={(event) => {
        setActive(true);
        move(event.clientX);
      }}
      onPointerUp={() => setActive(false)}
      onPointerCancel={() => setActive(false)}
      onPointerLeave={() => setActive(false)}
    >
      <input
        aria-label="Compare original and enhanced image"
        type="range"
        min={3}
        max={97}
        value={pos}
        onChange={(event) => setPos(Number(event.target.value))}
        className="compare-accessible"
      />
      <img
        src={after}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={before}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-ink/25" />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-ember/80 shadow-[0_0_22px_2px_rgba(239,160,150,0.45)]"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ember/70 bg-ink/70 backdrop-blur-sm" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-linear-to-t from-void/85 to-transparent p-4 md:p-5">
        <span className="micro text-[rgba(242,242,243,0.55)]">{beforeLabel}</span>
        <span className="micro hidden text-[rgba(242,242,243,0.3)] transition-opacity duration-500 group-hover:opacity-0 md:block">
          {hint}
        </span>
        <span className="micro text-ember">{afterLabel}</span>
      </div>
    </div>
  );
}

export function Stat({ value, caption }: { value: string; caption: string }) {
  return (
    <div>
      <p className="display text-3xl text-paper md:text-[2.6rem]">{value}</p>
      <p className="micro mt-2 text-[rgba(242,242,243,0.38)]">{caption}</p>
    </div>
  );
}
