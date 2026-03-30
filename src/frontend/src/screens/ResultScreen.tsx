import { Home, RotateCcw, Share2, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { GameMode } from "../App";
import { useGetTopScores, useSaveSession } from "../hooks/useQueries";

interface Props {
  score: number;
  bpm: number;
  baselineBPM: number;
  mode: GameMode;
  onPlayAgain: () => void;
  onHome: () => void;
}

function getVerdict(score: number): {
  label: string;
  color: string;
  glow: string;
  emoji: string;
} {
  if (score >= 70)
    return {
      label: "TRUTHFUL",
      color: "oklch(0.86 0.22 155)",
      glow: "text-glow-green",
      emoji: "✅",
    };
  if (score >= 40)
    return {
      label: "NEUTRAL",
      color: "oklch(0.78 0.20 60)",
      glow: "",
      emoji: "⚖️",
    };
  return {
    label: "SUSPICIOUS",
    color: "oklch(0.65 0.22 20)",
    glow: "text-glow-red",
    emoji: "🚨",
  };
}

export default function ResultScreen({
  score,
  bpm,
  baselineBPM,
  mode,
  onPlayAgain,
  onHome,
}: Props) {
  const [displayScore, setDisplayScore] = useState(0);
  const { mutate: saveSession } = useSaveSession();
  const { data: topScores } = useGetTopScores();
  const verdict = getVerdict(score);
  const isHighScore = score >= 75;
  const savedRef = useRef(false);

  useEffect(() => {
    let current = 0;
    const increment = score / 40;
    const interval = setInterval(() => {
      current = Math.min(score, current + increment);
      setDisplayScore(Math.round(current));
      if (current >= score) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [score]);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    saveSession({ mode: mode.id, score });
  }, [saveSession, mode.id, score]);

  const handleShare = async () => {
    const text = `I scored ${score}% on Truthix in ${mode.label} mode! Status: ${verdict.label} ${verdict.emoji} - Can you beat me?`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Truthix Score",
          text,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!", { description: text });
      }
    } catch {
      toast.error("Could not share result");
    }
  };

  const hrDelta = bpm - baselineBPM;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${verdict.color}0D 0%, transparent 70%)`,
        }}
      />

      <div className="flex items-center justify-between px-5 pt-10 pb-5 relative z-10">
        <div>
          <h2
            className="text-xl font-bold tracking-widest"
            style={{ color: "oklch(0.96 0.012 220)" }}
          >
            TRUTH RESULT
          </h2>
          <p className="text-xs" style={{ color: "oklch(0.50 0.025 220)" }}>
            {mode.icon} {mode.label} Mode
          </p>
        </div>
      </div>

      <div className="flex-1 px-5 flex flex-col gap-5 relative z-10">
        <motion.div
          className="flex flex-col items-center gap-4 py-6"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="w-44 h-44 rounded-full flex flex-col items-center justify-center relative"
            style={{
              background: `${verdict.color}12`,
              border: `3px solid ${verdict.color}`,
              boxShadow: `0 0 40px ${verdict.color}55, 0 0 80px ${verdict.color}22`,
            }}
          >
            <div
              className="absolute inset-0 rounded-full animate-pulse-ring"
              style={{ border: `1px solid ${verdict.color}44` }}
            />
            <div
              className="absolute inset-[-16px] rounded-full animate-pulse-ring"
              style={{
                border: `1px solid ${verdict.color}22`,
                animationDelay: "0.75s",
              }}
            />
            <span
              className={`text-6xl font-bold ${verdict.glow}`}
              style={{ color: verdict.color }}
            >
              {displayScore}%
            </span>
            <span
              className="text-xs tracking-widest mt-1"
              style={{ color: "oklch(0.50 0.025 220)" }}
            >
              TRUTH SCORE
            </span>
          </div>

          <motion.div
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-3xl">{verdict.emoji}</span>
            <span
              className={`text-2xl font-bold tracking-widest ${verdict.glow}`}
              style={{ color: verdict.color }}
            >
              {verdict.label}
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            {
              label: "PEAK BPM",
              value: `${bpm}`,
              unit: "bpm",
              color: "oklch(0.86 0.22 155)",
            },
            {
              label: "HR DELTA",
              value: `+${hrDelta > 0 ? hrDelta : 0}`,
              unit: "bpm",
              color: "oklch(0.62 0.28 295)",
            },
            {
              label: "BASELINE",
              value: `${baselineBPM}`,
              unit: "bpm",
              color: "oklch(0.88 0.12 200)",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-3 text-center"
              style={{
                background: "oklch(0.10 0.022 222)",
                border: "1px solid oklch(0.18 0.028 222)",
              }}
            >
              <div className="text-xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div
                className="text-[9px] tracking-wider"
                style={{ color: "oklch(0.35 0.015 220)" }}
              >
                {stat.unit}
              </div>
              <div
                className="text-[9px] tracking-wider mt-0.5"
                style={{ color: "oklch(0.45 0.020 220)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="rounded-2xl p-4"
          style={{
            background: "oklch(0.10 0.022 222)",
            border: "1px solid oklch(0.18 0.028 222)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "oklch(0.60 0.025 220)" }}
          >
            {score >= 70
              ? "Your heart rate remained stable — typical of truthful responses. Low stress indicators detected."
              : score >= 40
                ? "Mixed biometric signals detected. Some stress markers present but within normal range."
                : "Elevated heart rate variability detected. Strong stress markers — possible deception indicators."}
          </p>
        </motion.div>

        {isHighScore && (
          <motion.div
            className="flex items-center gap-2 rounded-xl px-4 py-3"
            style={{
              background: "oklch(0.86 0.22 155 / 0.08)",
              border: "1px solid oklch(0.86 0.22 155 / 0.3)",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Trophy size={16} style={{ color: "oklch(0.86 0.22 155)" }} />
            <span
              className="text-sm font-semibold"
              style={{ color: "oklch(0.86 0.22 155)" }}
            >
              Score saved to leaderboard!
            </span>
          </motion.div>
        )}

        {topScores && topScores.length > 0 && (
          <motion.div
            className="rounded-xl p-4"
            style={{
              background: "oklch(0.10 0.022 222)",
              border: "1px solid oklch(0.18 0.028 222)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div
              className="text-xs tracking-widest mb-2"
              style={{ color: "oklch(0.50 0.025 220)" }}
            >
              TOP SCORES
            </div>
            {topScores.slice(0, 3).map((s, i) => (
              <div
                key={`score-${s.sessionId}-${i}`}
                data-ocid={`result.item.${i + 1}`}
                className="flex justify-between items-center py-1"
              >
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.60 0.025 220)" }}
                >
                  #{i + 1} {s.mode}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: "oklch(0.86 0.22 155)" }}
                >
                  {Number(s.truthScore)}%
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <motion.div
        className="px-5 pb-8 pt-4 flex flex-col gap-3 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex gap-3">
          <button
            type="button"
            data-ocid="result.primary_button"
            className="flex-1 py-4 rounded-full font-bold tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.86 0.22 155), oklch(0.78 0.22 165))",
              color: "oklch(0.065 0.018 222)",
              boxShadow: "0 0 20px oklch(0.86 0.22 155 / 0.4)",
            }}
            onClick={onPlayAgain}
          >
            <RotateCcw size={16} />
            PLAY AGAIN
          </button>
          <button
            type="button"
            data-ocid="result.secondary_button"
            className="flex-1 py-4 rounded-full font-bold tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            style={{
              background: "oklch(0.62 0.28 295 / 0.15)",
              border: "1px solid oklch(0.62 0.28 295 / 0.5)",
              color: "oklch(0.62 0.28 295)",
              boxShadow: "0 0 16px oklch(0.62 0.28 295 / 0.3)",
            }}
            onClick={handleShare}
          >
            <Share2 size={16} />
            SHARE
          </button>
        </div>
        <button
          type="button"
          data-ocid="result.cancel_button"
          className="w-full py-3 rounded-full text-sm font-semibold tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          style={{
            border: "1px solid oklch(0.25 0.025 222)",
            color: "oklch(0.55 0.025 220)",
          }}
          onClick={onHome}
        >
          <Home size={14} />
          HOME
        </button>

        <p
          className="text-center text-xs"
          style={{ color: "oklch(0.30 0.015 220)" }}
        >
          ⚠️ For entertainment purposes only. Simulated biometric data.
        </p>
        <p
          className="text-center text-xs"
          style={{ color: "oklch(0.25 0.012 220)" }}
        >
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "oklch(0.50 0.15 155)" }}
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
