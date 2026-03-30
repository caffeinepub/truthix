import { ChevronRight, Play, Shield, Wifi } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { GameMode } from "../App";

interface Props {
  selectedMode: GameMode;
  onStartGame: () => void;
  onConnectWatch: () => void;
  onChooseMode: () => void;
}

const modeColorMap: Record<string, string> = {
  green: "oklch(0.86 0.22 155)",
  blue: "oklch(0.70 0.18 240)",
  purple: "oklch(0.62 0.28 295)",
  orange: "oklch(0.78 0.20 60)",
  slate: "oklch(0.65 0.05 240)",
  rose: "oklch(0.65 0.22 20)",
};

export default function HomeScreen({
  selectedMode,
  onStartGame,
  onChooseMode,
}: Props) {
  const modeColor = modeColorMap[selectedMode.color] ?? "oklch(0.86 0.22 155)";

  const handleConnectWatch = () => {
    toast.error("No device found", {
      description: "Ensure Bluetooth is enabled and your watch is nearby.",
      icon: "⌚",
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.86 0.22 155 / 0.06) 0%, transparent 70%)",
        }}
      />

      <motion.header
        className="flex items-center justify-between px-5 pt-10 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1
            className="text-3xl font-bold tracking-widest text-glow-green"
            style={{ color: "oklch(0.86 0.22 155)", letterSpacing: "0.2em" }}
          >
            TRUTHIX
          </h1>
          <p
            className="text-xs tracking-widest"
            style={{ color: "oklch(0.62 0.28 295)" }}
          >
            BIOMETRIC TRUTH ENGINE
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            border: `1px solid ${modeColor}`,
            color: modeColor,
            background: `${modeColor}18`,
          }}
        >
          <span>{selectedMode.icon}</span>
          <span>{selectedMode.label}</span>
        </div>
      </motion.header>

      <motion.div
        className="px-5 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: "oklch(0.10 0.022 222)",
            border: "1px solid oklch(0.18 0.028 222)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                border: "1px solid oklch(0.86 0.22 155 / 0.5)",
                color: "oklch(0.86 0.22 155)",
                background: "oklch(0.86 0.22 155 / 0.08)",
              }}
            >
              <Shield size={10} />
              <span>SIMULATED DATA</span>
            </div>
            <div
              className="flex items-center gap-1 text-xs"
              style={{ color: "oklch(0.65 0.22 20)" }}
            >
              <div
                className="w-2 h-2 rounded-full animate-blink-dot"
                style={{ background: "oklch(0.65 0.22 20)" }}
              />
              Watch Disconnected
            </div>
          </div>

          <div
            className="text-2xl font-bold mb-1"
            style={{ color: "oklch(0.96 0.012 220)" }}
          >
            Ready to play?
          </div>
          <p className="text-sm" style={{ color: "oklch(0.70 0.030 220)" }}>
            Calibrate your baseline, answer questions, and discover your truth
            score.
          </p>

          <div className="mt-4 h-10 relative overflow-hidden opacity-40">
            <svg
              width="100%"
              height="40"
              viewBox="0 0 320 40"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polyline
                points="0,20 20,10 40,25 60,5 80,20 100,30 120,8 140,22 160,12 180,28 200,15 220,25 240,8 260,20 280,18 300,25 320,20"
                fill="none"
                stroke="oklch(0.86 0.22 155)"
                strokeWidth="2"
              />
              <polyline
                points="0,22 20,32 40,18 60,28 80,15 100,20 120,30 140,12 160,28 180,8 200,25 220,15 240,28 260,12 280,22 300,10 320,22"
                fill="none"
                stroke="oklch(0.62 0.28 295)"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
            </svg>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="px-5 flex flex-col gap-3 mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <button
          type="button"
          data-ocid="home.primary_button"
          className="w-full min-h-[56px] rounded-full font-bold text-base tracking-widest flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98]"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.86 0.22 155), oklch(0.78 0.22 165))",
            color: "oklch(0.065 0.018 222)",
            boxShadow:
              "0 0 20px oklch(0.86 0.22 155 / 0.5), 0 0 40px oklch(0.86 0.22 155 / 0.25)",
          }}
          onClick={onStartGame}
        >
          <Play size={18} fill="currentColor" />
          START GAME
        </button>

        <button
          type="button"
          data-ocid="home.secondary_button"
          className="w-full min-h-[56px] rounded-full font-bold text-base tracking-widest flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98]"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.62 0.28 295), oklch(0.55 0.26 285))",
            color: "oklch(0.96 0.012 220)",
            boxShadow:
              "0 0 20px oklch(0.62 0.28 295 / 0.5), 0 0 40px oklch(0.62 0.28 295 / 0.25)",
          }}
          onClick={handleConnectWatch}
        >
          <Wifi size={18} />
          CONNECT WATCH
        </button>

        <button
          type="button"
          data-ocid="home.toggle"
          className="w-full min-h-[56px] rounded-full font-bold text-base tracking-widest flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98]"
          style={{
            background: "transparent",
            border: "1px solid oklch(0.30 0.025 222)",
            color: "oklch(0.70 0.030 220)",
          }}
          onClick={onChooseMode}
        >
          CHOOSE MODE
          <ChevronRight size={18} />
        </button>
      </motion.div>

      <motion.div
        className="px-5 mt-5 grid grid-cols-3 gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {[
          {
            label: "TRUTH SESSIONS",
            value: "0",
            color: "oklch(0.86 0.22 155)",
          },
          { label: "AVG TRUTH %", value: "—", color: "oklch(0.88 0.12 200)" },
          { label: "LEADERBOARD", value: "#—", color: "oklch(0.62 0.28 295)" },
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
              className="text-[9px] tracking-wider mt-0.5"
              style={{ color: "oklch(0.45 0.020 220)" }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>

      <div className="flex-1" />

      <motion.footer
        className="px-5 pb-8 pt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-xs" style={{ color: "oklch(0.35 0.015 220)" }}>
          ⚠️ For entertainment purposes only. Heart rate data is simulated.
        </p>
        <p className="text-xs mt-1" style={{ color: "oklch(0.28 0.012 220)" }}>
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
      </motion.footer>
    </div>
  );
}
