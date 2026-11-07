"use client";

import { useEffect, useRef, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number; total: number };

function partsUntil(target: number, now: number): Parts {
  const total = Math.max(0, Math.round((target - now) / 1000));
  return {
    total,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function spoken(p: Parts) {
  if (p.total === 0) return "Time's up.";
  if (p.total <= 10) return `${plural(p.total, "second")} left.`;
  if (p.total < 60) return "Less than a minute left.";
  const bits = [p.days && plural(p.days, "day"), p.hours && plural(p.hours, "hour"), plural(p.minutes, "minute")].filter(Boolean);
  return `${bits.join(", ")} left.`;
}

/**
 * Countdown, spec A5: boxes for days, hours, minutes and seconds (Baloo 2,
 * tabular numbers, so nothing shifts), or one compact line ("02:14:09").
 * Optionally turns --danger in the last minute. Screen readers hear it
 * each minute and in the last 10 seconds, not every second.
 */
export function CruiseCountdown({
  target,
  duration,
  onComplete,
  compact = false,
  urgent = true,
  showDays,
  label = "Time left",
  className,
}: {
  /** When it ends: a Date, an ISO string or a timestamp. */
  target?: Date | string | number;
  /** Or: how long from when it appears, in milliseconds (e.g. a 90-second round). */
  duration?: number;
  onComplete?: () => void;
  /** One line, "02:14:09", instead of boxes. */
  compact?: boolean;
  /** Turn --danger in the last minute. */
  urgent?: boolean;
  /** Show the days box (default: when there's at least a day left). */
  showDays?: boolean;
  label?: string;
  className?: string;
}) {
  // Both null until mounted, so the server and the first render agree (and
  // the page can be prerendered without reading the clock).
  const [clock, setClock] = useState<{ now: number; end: number } | null>(null);
  const now = clock?.now ?? null;
  const end = clock?.end ?? 0;
  const done = useRef(false);

  useEffect(() => {
    const tick = () =>
      setClock((c) => {
        const t = Date.now();
        return { now: t, end: c?.end ?? (duration !== undefined ? t + duration : new Date(target ?? t).getTime()) };
      });
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the end is fixed when it starts
  }, []);

  const p = now === null ? null : partsUntil(end, now);

  useEffect(() => {
    if (p?.total === 0 && !done.current) {
      done.current = true;
      onComplete?.();
    }
  }, [p?.total, onComplete]);

  // What screen readers hear. Above 10 seconds it only names minutes, so the
  // live region changes once a minute; then each of the last 10 seconds.
  const announce = p ? spoken(p) : "";

  const isUrgent = urgent && p !== null && p.total > 0 && p.total <= 60;
  const units = p
    ? [
        ...((showDays ?? p.days > 0) ? [{ n: p.days, label: p.days === 1 ? "Day" : "Days" }] : []),
        { n: p.hours, label: p.hours === 1 ? "Hour" : "Hours" },
        { n: p.minutes, label: "Min" },
        { n: p.seconds, label: "Sec" },
      ]
    : [];

  // Compact is inline (a <span>), so it can sit inside a sentence.
  const Root = compact ? "span" : "div";
  return (
    <Root role="timer" aria-label={label} className={className}>
      {compact ? (
        <span className="countdown-compact" data-urgent={isUrgent ? "" : undefined} aria-hidden="true">
          {p ? `${p.days ? `${p.days}d ` : ""}${pad(p.hours)}:${pad(p.minutes)}:${pad(p.seconds)}` : "--:--:--"}
        </span>
      ) : (
        <div className="countdown" data-urgent={isUrgent ? "" : undefined} aria-hidden="true">
          {(p ? units : [{ n: -1, label: "Hours" }, { n: -1, label: "Min" }, { n: -1, label: "Sec" }]).map((u) => (
            <span key={u.label} className="countdown-unit">
              <span className="countdown-number">{u.n < 0 ? "--" : pad(u.n)}</span>
              <span className="countdown-label">{u.label}</span>
            </span>
          ))}
        </div>
      )}
      <span className="visually-hidden" aria-live="polite">
        {announce}
      </span>
    </Root>
  );
}
