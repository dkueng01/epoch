"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function EpochTracker() {
  const searchParams = useSearchParams();
  const [targetDate, setTargetDate] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 1. Initialize State from URL -> LocalStorage -> Default
  useEffect(() => {
    const urlDate = searchParams.get("d");
    const localDate = localStorage.getItem("epoch-target-date");
    const defaultDate = new Date(new Date().getFullYear() + 1, 0, 1)
      .toISOString()
      .slice(0, 16);

    const initialDate = urlDate || localDate || defaultDate;

    setTargetDate(initialDate);

    // If a visitor clicked a shared link, save it to their local storage too
    if (urlDate) {
      localStorage.setItem("epoch-target-date", urlDate);
    }
  }, [searchParams]);

  // 2. Countdown Interval Logic
  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // 3. Handle User Changing the Date
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setTargetDate(newDate);
    localStorage.setItem("epoch-target-date", newDate);

    // Silently update the URL so they can copy it without a page reload
    const params = new URLSearchParams(searchParams.toString());
    params.set("d", newDate);
    window.history.replaceState(null, "", `?${params.toString()}`);
    setCopied(false);
  };

  // 4. Handle Link Copying
  const copyShareLink = async () => {
    const url = new URL(window.location.href);
    // Ensure the current date is explicitly in the URL we are copying
    url.searchParams.set("d", targetDate);
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Prevent hydration mismatch by not rendering until we have the date
  if (!targetDate) return null;

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-20">
      {/* Header / Input */}
      <div className="z-10 w-full max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-24 animate-reveal-up opacity-0">
        <div>
          <h1 className="text-sm tracking-[0.3em] uppercase text-white/50 mb-4 font-mono">
            Epoch / Horizon
          </h1>
          <h2 className="text-4xl md:text-6xl font-light italic tracking-tight">
            Awaiting the <br className="hidden md:block" />
            <span className="text-neon-lime not-italic font-normal">
              inevitable.
            </span>
          </h2>
        </div>

        <div className="mt-12 md:mt-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto items-end">
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <label
              htmlFor="target-date"
              className="text-xs font-mono text-white/40 uppercase tracking-widest"
            >
              Set Temporal Anchor
            </label>
            <input
              id="target-date"
              type="datetime-local"
              value={targetDate}
              onChange={handleDateChange}
              className="h-14 bg-obsidian-light border border-white/10 px-4 py-3 text-stardust font-mono focus:outline-none focus:border-neon-lime/50 focus:ring-1 focus:ring-neon-lime/50 transition-all rounded-none w-full"
            />
          </div>

          {/* Share Button */}
          <button
            onClick={copyShareLink}
            className={`h-14 px-6 py-3 border font-mono text-xs uppercase tracking-widest transition-all duration-300 w-full sm:w-auto ${copied
              ? "border-neon-lime text-neon-lime bg-neon-lime/10"
              : "border-white/20 text-white/60 hover:border-white/60 hover:text-white"
              }`}
          >
            {copied ? "[ Link Copied ]" : "[ Share Epoch ]"}
          </button>
        </div>
      </div>

      {/* Massive Countdown Grid */}
      <div className="z-10 w-full max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 border-t border-white/10 pt-16">
        <TimeUnit value={timeLeft.days} label="Days" delay="delay-100" />
        <TimeUnit value={timeLeft.hours} label="Hours" delay="delay-200" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" delay="delay-300" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" delay="delay-400" />
      </div>

      {/* Footer Decoration */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-xs font-mono text-white/30 uppercase tracking-[0.4em] animate-reveal-up opacity-0"
        style={{ animationDelay: "600ms" }}
      >
        T - Minus System Active
      </div>
    </main>
  );
}

function TimeUnit({
  value,
  label,
  delay,
}: {
  value: number;
  label: string;
  delay: string;
}) {
  const formattedValue = value < 10 ? `0${value}` : value.toString();

  return (
    <div
      className={`flex flex-col items-center md:items-start animate-reveal-up opacity-0 ${delay}`}
    >
      <div className="relative overflow-hidden group">
        <span className="text-[20vw] md:text-[10vw] leading-[0.85] font-mono tracking-tighter text-stardust transition-transform duration-700 group-hover:text-neon-lime">
          {formattedValue}
        </span>
      </div>
      <span className="mt-4 text-sm md:text-lg font-serif italic text-white/60 pl-2 border-l border-neon-lime/30">
        {label}
      </span>
    </div>
  );
}

// Next.js App Router requires useSearchParams to be wrapped in a Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-obsidian" />}>
      <EpochTracker />
    </Suspense>
  );
}