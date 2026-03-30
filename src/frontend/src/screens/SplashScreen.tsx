import { motion } from "motion/react";
import { useEffect } from "react";

interface Props {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: Props) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2500);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <button
      type="button"
      className="min-h-screen w-full flex flex-col items-center justify-center cursor-pointer relative overflow-hidden grid-bg"
      style={{
        background: "oklch(0.065 0.018 222)",
        border: "none",
        padding: 0,
      }}
      onClick={onComplete}
    >
      {/* Radial glow behind logo */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, oklch(0.86 0.22 155 / 0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 30% at 50% 50%, oklch(0.62 0.28 295 / 0.06) 0%, transparent 60%)",
        }}
      />

      {/* Animated scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute left-0 right-0 h-px animate-scan"
          style={{ background: "oklch(0.86 0.22 155 / 0.15)" }}
        />
      </div>

      <motion.div
        className="flex flex-col items-center gap-6 px-8"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo icon */}
        <motion.div
          className="w-24 h-24 rounded-2xl flex items-center justify-center relative animate-float"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.86 0.22 155 / 0.15), oklch(0.62 0.28 295 / 0.15))",
            border: "1px solid oklch(0.86 0.22 155 / 0.3)",
            boxShadow:
              "0 0 30px oklch(0.86 0.22 155 / 0.4), 0 0 60px oklch(0.86 0.22 155 / 0.2)",
          }}
        >
          <span className="text-5xl">🧬</span>
          <div
            className="absolute inset-0 rounded-2xl animate-pulse-ring"
            style={{ border: "1px solid oklch(0.86 0.22 155 / 0.4)" }}
          />
          <div
            className="absolute inset-[-8px] rounded-2xl animate-pulse-ring"
            style={{
              border: "1px solid oklch(0.86 0.22 155 / 0.2)",
              animationDelay: "0.5s",
            }}
          />
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1
            className="text-6xl font-bold tracking-widest text-glow-green"
            style={{ color: "oklch(0.86 0.22 155)", letterSpacing: "0.25em" }}
          >
            TRUTHIX
          </h1>
          <div
            className="mt-1 text-xs tracking-[0.4em] font-medium"
            style={{
              color: "oklch(0.62 0.28 295)",
              textShadow: "0 0 12px oklch(0.62 0.28 295 / 0.7)",
            }}
          >
            BIOMETRIC TRUTH ENGINE
          </div>
        </motion.div>

        <motion.p
          className="text-center text-sm font-semibold tracking-widest"
          style={{ color: "oklch(0.70 0.030 220)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          CAN YOU HANDLE THE TRUTH?
        </motion.p>

        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-blink-dot"
              style={{
                background: "oklch(0.86 0.22 155)",
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      <motion.p
        className="absolute bottom-8 text-xs tracking-wider"
        style={{ color: "oklch(0.40 0.020 220)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        TAP TO CONTINUE
      </motion.p>
    </button>
  );
}
