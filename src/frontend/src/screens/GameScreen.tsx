import { ArrowLeft, Radio } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GameMode } from "../App";
import { useGetQuestions } from "../hooks/useQueries";

const FALLBACK_QUESTIONS: Record<string, string[]> = {
  Kids: [
    "Have you ever told your parents a white lie to avoid vegetables?",
    "Did you ever cheat in a game with your friends?",
    "Have you ever blamed a sibling for something you did?",
  ],
  Teen: [
    "Have you ever pretended to be sick to skip school?",
    "Did you ever sneak out at night without permission?",
    "Have you ever lied about finishing homework?",
  ],
  Young: [
    "Have you ever ghosted someone you genuinely liked?",
    "Did you ever lie on your resume or application?",
    "Have you ever drunk-texted someone you regret?",
  ],
  Party: [
    "Have you ever faked being busy to avoid a social event?",
    "Did you ever steal food from a friend's plate when they weren't looking?",
    "Have you ever laughed at a joke you didn't find funny?",
  ],
  Professional: [
    "Have you ever pretended to understand something in a meeting?",
    "Did you ever take credit for someone else's work idea?",
    "Have you ever bad-mouthed a colleague behind their back?",
  ],
  Intimate: [
    "Have you ever stayed in a relationship just to avoid being alone?",
    "Did you ever fake feelings to avoid an uncomfortable conversation?",
    "Have you ever been attracted to a friend's partner?",
  ],
};

interface Props {
  mode: GameMode;
  baselineBPM: number;
  onComplete: (score: number, bpm: number, delay: number) => void;
  onBack: () => void;
}

type Phase = "question" | "recording" | "analyzing";

export default function GameScreen({
  mode,
  baselineBPM,
  onComplete,
  onBack,
}: Props) {
  const [phase, setPhase] = useState<Phase>("question");
  const [qIndex] = useState(0);
  const [bpm, setBpm] = useState(baselineBPM);
  const bpmRef = useRef(baselineBPM);
  const [wavePoints, setWavePoints] = useState<number[]>(Array(40).fill(25));
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(0);
  const questionShownAt = useRef(Date.now());
  const responseDelayRef = useRef(2);
  const [recordingBpms, setRecordingBpms] = useState<number[]>([]);

  const { data: backendQuestions } = useGetQuestions(mode.id);
  const questions: string[] =
    backendQuestions && backendQuestions.length > 0
      ? backendQuestions.map((q) => q.text)
      : (FALLBACK_QUESTIONS[mode.id] ?? FALLBACK_QUESTIONS.Party);

  const question = questions[qIndex % questions.length];

  useEffect(() => {
    if (phase !== "recording") return;
    const interval = setInterval(() => {
      const targetMin = 75;
      const targetMax = 115;
      const delta = Math.random() * 5 - 2;
      const next = Math.min(
        targetMax,
        Math.max(targetMin, bpmRef.current + delta),
      );
      bpmRef.current = next;
      setBpm(Math.round(next));
      setRecordingBpms((prev) => [...prev, next]);
      setWavePoints((prev) => [
        ...prev.slice(1),
        25 + (next - baselineBPM) * 0.4 + (Math.random() * 8 - 4),
      ]);
      timerRef.current += 0.2;
      setTimer(timerRef.current);
    }, 200);
    return () => clearInterval(interval);
  }, [phase, baselineBPM]);

  const handleStartRecording = () => {
    const delay = (Date.now() - questionShownAt.current) / 1000;
    responseDelayRef.current = delay;
    timerRef.current = 0;
    setTimer(0);
    setRecordingBpms([]);
    bpmRef.current = baselineBPM + 5;
    setBpm(baselineBPM + 5);
    setPhase("recording");
  };

  const handleStopRecording = useCallback(() => {
    setPhase("analyzing");
    const delay = responseDelayRef.current;
    const avgBpm =
      recordingBpms.length > 0
        ? recordingBpms.reduce((a, b) => a + b, 0) / recordingBpms.length
        : bpmRef.current;

    const hrDelta = avgBpm - baselineBPM;
    const rawScore = 100 - hrDelta * 2 - delay * 3;
    const noise = Math.random() * 6 - 3;
    const score = Math.min(98, Math.max(5, Math.round(rawScore + noise)));

    setTimeout(() => {
      onComplete(score, Math.round(avgBpm), delay);
    }, 1500);
  }, [recordingBpms, baselineBPM, onComplete]);

  const wavePointsStr = wavePoints.map((y, x) => `${x * 8},${y}`).join(" ");

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 80%, oklch(0.62 0.28 295 / 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="flex items-center gap-3 px-5 pt-10 pb-5 relative z-10">
        <button
          type="button"
          data-ocid="game.cancel_button"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{
            background: "oklch(0.12 0.025 222)",
            border: "1px solid oklch(0.20 0.028 222)",
          }}
          onClick={onBack}
        >
          <ArrowLeft size={18} style={{ color: "oklch(0.70 0.030 220)" }} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2
              className="text-xl font-bold tracking-widest"
              style={{ color: "oklch(0.62 0.28 295)" }}
            >
              {mode.label} MODE
            </h2>
            <span>{mode.icon}</span>
          </div>
          <p className="text-xs" style={{ color: "oklch(0.50 0.025 220)" }}>
            Q{qIndex + 1} • Baseline: {baselineBPM} BPM
          </p>
        </div>
      </div>

      <div className="flex-1 px-5 flex flex-col gap-5 relative z-10">
        <AnimatePresence mode="wait">
          {phase === "analyzing" ? (
            <motion.div
              key="analyzing"
              className="flex-1 flex flex-col items-center justify-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                data-ocid="game.loading_state"
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.62 0.28 295 / 0.1)",
                  border: "2px solid oklch(0.62 0.28 295)",
                  boxShadow: "0 0 30px oklch(0.62 0.28 295 / 0.5)",
                }}
              >
                <span
                  className="text-4xl animate-spin"
                  style={{ display: "inline-block" }}
                >
                  ⟳
                </span>
              </div>
              <p
                className="text-xl font-bold tracking-widest text-glow-purple"
                style={{ color: "oklch(0.62 0.28 295)" }}
              >
                ANALYZING...
              </p>
              <p className="text-sm" style={{ color: "oklch(0.50 0.025 220)" }}>
                Processing biometric data
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`phase-${phase}`}
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "oklch(0.10 0.022 222)",
                  border: "1px solid oklch(0.18 0.028 222)",
                }}
              >
                <div
                  className="text-xs tracking-widest mb-3"
                  style={{ color: "oklch(0.50 0.025 220)" }}
                >
                  QUESTION
                </div>
                <p
                  className="text-xl font-semibold leading-relaxed"
                  style={{ color: "oklch(0.96 0.012 220)" }}
                >
                  {question}
                </p>
              </div>

              {phase === "recording" && (
                <motion.div
                  className="rounded-xl p-4"
                  style={{
                    background: "oklch(0.08 0.018 222)",
                    border: "1px solid oklch(0.65 0.22 20 / 0.3)",
                  }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full animate-blink-dot"
                        style={{ background: "oklch(0.65 0.22 20)" }}
                      />
                      <span
                        className="text-xs font-semibold tracking-wider"
                        style={{ color: "oklch(0.65 0.22 20)" }}
                      >
                        RECORDING
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.50 0.025 220)" }}
                      >
                        {timer.toFixed(1)}s
                      </span>
                      <span
                        className="text-xl font-bold"
                        style={{ color: "oklch(0.86 0.22 155)" }}
                      >
                        {bpm}{" "}
                        <span
                          className="text-xs font-normal"
                          style={{ color: "oklch(0.50 0.025 220)" }}
                        >
                          BPM
                        </span>
                      </span>
                    </div>
                  </div>
                  <svg
                    width="100%"
                    height="50"
                    viewBox="0 0 320 50"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <polyline
                      points={wavePointsStr}
                      fill="none"
                      stroke="oklch(0.86 0.22 155)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}

              {phase === "recording" && (
                <div className="flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <div
                      className="absolute inset-0 rounded-full animate-pulse-ring"
                      style={{ border: "2px solid oklch(0.65 0.22 20 / 0.5)" }}
                    />
                    <div
                      className="absolute inset-[-12px] rounded-full animate-pulse-ring"
                      style={{
                        border: "1px solid oklch(0.65 0.22 20 / 0.3)",
                        animationDelay: "0.5s",
                      }}
                    />
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center"
                      style={{
                        background: "oklch(0.65 0.22 20 / 0.15)",
                        border: "2px solid oklch(0.65 0.22 20)",
                        boxShadow: "0 0 24px oklch(0.65 0.22 20 / 0.5)",
                      }}
                    >
                      <Radio
                        size={28}
                        style={{ color: "oklch(0.65 0.22 20)" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-auto">
                {phase === "question" ? (
                  <button
                    type="button"
                    data-ocid="game.primary_button"
                    className="w-full py-4 rounded-full font-bold tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                    style={{
                      background:
                        "linear-gradient(90deg, oklch(0.62 0.28 295), oklch(0.55 0.26 285))",
                      color: "oklch(0.96 0.012 220)",
                      boxShadow: "0 0 20px oklch(0.62 0.28 295 / 0.5)",
                    }}
                    onClick={handleStartRecording}
                  >
                    <Radio size={18} />
                    START RECORDING
                  </button>
                ) : (
                  <button
                    type="button"
                    data-ocid="game.save_button"
                    className="w-full py-4 rounded-full font-bold tracking-widest active:scale-[0.98] transition-all"
                    style={{
                      background: "oklch(0.65 0.22 20 / 0.15)",
                      border: "1px solid oklch(0.65 0.22 20 / 0.5)",
                      color: "oklch(0.65 0.22 20)",
                      boxShadow: "0 0 16px oklch(0.65 0.22 20 / 0.3)",
                    }}
                    onClick={handleStopRecording}
                  >
                    STOP RECORDING
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
