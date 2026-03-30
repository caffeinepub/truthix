import { ArrowLeft, Heart, SkipForward } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const CALIBRATION_QUESTIONS = [
  { id: 1, text: "What is your first name?" },
  { id: 2, text: "What city were you born in?" },
  { id: 3, text: "What is your favorite food?" },
];

interface Props {
  onComplete: (baselineBPM: number) => void;
  onBack: () => void;
}

type PhaseType = "intro" | "question" | "recording" | "done";

function useHeartRateSim(min: number, max: number, active: boolean) {
  const [bpm, setBpm] = useState(70);
  const bpmRef = useRef(70);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      const delta = Math.random() * 5 - 2;
      const next = Math.min(max, Math.max(min, bpmRef.current + delta));
      bpmRef.current = next;
      setBpm(Math.round(next));
    }, 200);
    return () => clearInterval(interval);
  }, [active, min, max]);

  return { bpm, bpmRef };
}

export default function CalibrationScreen({ onComplete, onBack }: Props) {
  const [phase, setPhase] = useState<PhaseType>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [bpmReadings, setBpmReadings] = useState<number[]>([]);
  const [wavePoints, setWavePoints] = useState<number[]>(Array(40).fill(20));

  const isActive = phase === "question" || phase === "recording";
  const { bpm, bpmRef } = useHeartRateSim(62, 78, isActive);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setWavePoints((prev) => [
        ...prev.slice(1),
        20 + (bpmRef.current - 70) * 0.8 + (Math.random() * 10 - 5),
      ]);
    }, 100);
    return () => clearInterval(interval);
  }, [isActive, bpmRef]);

  const handleStopRecording = useCallback(() => {
    setBpmReadings((prev) => [...prev, bpmRef.current]);
    const nextQ = qIndex + 1;
    if (nextQ >= CALIBRATION_QUESTIONS.length) {
      setPhase("done");
    } else {
      setQIndex(nextQ);
      setPhase("question");
    }
  }, [bpmRef, qIndex]);

  useEffect(() => {
    if (phase !== "recording") return;
    if (countdown <= 0) {
      handleStopRecording();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown, handleStopRecording]);

  const handleStartAnswer = () => {
    setCountdown(5);
    setPhase("recording");
  };

  const handleFinish = () => {
    const avg =
      bpmReadings.length > 0
        ? bpmReadings.reduce((a, b) => a + b, 0) / bpmReadings.length
        : 70;
    onComplete(Math.round(avg));
  };

  const handleSkip = () => onComplete(70);

  const wavePointsStr = wavePoints.map((y, x) => `${x * 8},${y}`).join(" ");

  const avgBaseline =
    bpmReadings.length > 0
      ? Math.round(bpmReadings.reduce((a, b) => a + b, 0) / bpmReadings.length)
      : null;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-5 pt-10 pb-5">
        <button
          type="button"
          data-ocid="calibration.cancel_button"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{
            background: "oklch(0.12 0.025 222)",
            border: "1px solid oklch(0.20 0.028 222)",
          }}
          onClick={onBack}
        >
          <ArrowLeft size={18} style={{ color: "oklch(0.70 0.030 220)" }} />
        </button>
        <div>
          <h2
            className="text-xl font-bold tracking-widest"
            style={{ color: "oklch(0.86 0.22 155)" }}
          >
            CALIBRATING
          </h2>
          <p className="text-xs" style={{ color: "oklch(0.50 0.025 220)" }}>
            Establishing baseline heart rate
          </p>
        </div>
        <button
          type="button"
          data-ocid="calibration.secondary_button"
          className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            border: "1px solid oklch(0.25 0.025 222)",
            color: "oklch(0.55 0.025 220)",
          }}
          onClick={handleSkip}
        >
          <SkipForward size={12} />
          Skip
        </button>
      </div>

      <div className="flex gap-2 px-5 mb-5">
        {CALIBRATION_QUESTIONS.map((q, i) => (
          <div
            key={q.id}
            className="h-1.5 flex-1 rounded-full transition-all duration-500"
            style={{
              background:
                i < qIndex || phase === "done"
                  ? "oklch(0.86 0.22 155)"
                  : i === qIndex && phase !== "intro"
                    ? "linear-gradient(90deg, oklch(0.86 0.22 155), oklch(0.86 0.22 155 / 0.4))"
                    : "oklch(0.18 0.028 222)",
            }}
          />
        ))}
      </div>

      <div className="flex-1 px-5 flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              className="flex flex-col items-center gap-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.86 0.22 155 / 0.1)",
                  border: "2px solid oklch(0.86 0.22 155 / 0.4)",
                  boxShadow: "0 0 30px oklch(0.86 0.22 155 / 0.3)",
                }}
              >
                <Heart size={40} style={{ color: "oklch(0.86 0.22 155)" }} />
              </div>
              <div className="text-center">
                <h3
                  className="text-2xl font-bold"
                  style={{ color: "oklch(0.96 0.012 220)" }}
                >
                  Baseline Setup
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "oklch(0.60 0.025 220)" }}
                >
                  Answer 3 simple, truthful questions to establish your resting
                  heart rate baseline.
                </p>
              </div>
              <button
                type="button"
                data-ocid="calibration.primary_button"
                className="w-full py-4 rounded-full font-bold tracking-widest text-base"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.86 0.22 155), oklch(0.78 0.22 165))",
                  color: "oklch(0.065 0.018 222)",
                  boxShadow: "0 0 20px oklch(0.86 0.22 155 / 0.4)",
                }}
                onClick={() => setPhase("question")}
              >
                BEGIN CALIBRATION
              </button>
            </motion.div>
          )}

          {(phase === "question" || phase === "recording") && (
            <motion.div
              key={`q-${qIndex}`}
              className="flex flex-col gap-5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "oklch(0.10 0.022 222)",
                  border: "1px solid oklch(0.18 0.028 222)",
                }}
              >
                <div
                  className="text-xs tracking-widest mb-2"
                  style={{ color: "oklch(0.50 0.025 220)" }}
                >
                  QUESTION {qIndex + 1} OF {CALIBRATION_QUESTIONS.length}
                </div>
                <p
                  className="text-xl font-semibold"
                  style={{ color: "oklch(0.96 0.012 220)" }}
                >
                  {CALIBRATION_QUESTIONS[qIndex].text}
                </p>
              </div>

              <div
                className="rounded-xl overflow-hidden p-3"
                style={{
                  background: "oklch(0.08 0.018 222)",
                  border: "1px solid oklch(0.15 0.025 222)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs tracking-wider"
                    style={{ color: "oklch(0.50 0.025 220)" }}
                  >
                    HEART RATE
                  </span>
                  <span
                    className="text-lg font-bold"
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
              </div>

              {phase === "question" ? (
                <button
                  type="button"
                  data-ocid="calibration.primary_button"
                  className="w-full py-4 rounded-full font-bold tracking-widest"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.86 0.22 155), oklch(0.78 0.22 165))",
                    color: "oklch(0.065 0.018 222)",
                    boxShadow: "0 0 20px oklch(0.86 0.22 155 / 0.4)",
                  }}
                  onClick={handleStartAnswer}
                >
                  START ANSWER
                </button>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                    style={{
                      border: "2px solid oklch(0.65 0.22 20)",
                      color: "oklch(0.65 0.22 20)",
                      background: "oklch(0.65 0.22 20 / 0.1)",
                      boxShadow: "0 0 20px oklch(0.65 0.22 20 / 0.4)",
                    }}
                  >
                    {countdown}
                  </div>
                  <button
                    type="button"
                    data-ocid="calibration.save_button"
                    className="w-full py-4 rounded-full font-bold tracking-widest"
                    style={{
                      background: "oklch(0.65 0.22 20 / 0.15)",
                      border: "1px solid oklch(0.65 0.22 20 / 0.5)",
                      color: "oklch(0.65 0.22 20)",
                    }}
                    onClick={handleStopRecording}
                  >
                    STOP RECORDING
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div
              key="done"
              className="flex flex-col items-center gap-6 mt-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.86 0.22 155 / 0.1)",
                  border: "2px solid oklch(0.86 0.22 155)",
                  boxShadow: "0 0 30px oklch(0.86 0.22 155 / 0.5)",
                }}
              >
                <span className="text-4xl">✓</span>
              </div>
              <div className="text-center">
                <h3
                  className="text-2xl font-bold text-glow-green"
                  style={{ color: "oklch(0.86 0.22 155)" }}
                >
                  BASELINE ESTABLISHED
                </h3>
                {avgBaseline && (
                  <p
                    className="mt-2 text-sm"
                    style={{ color: "oklch(0.60 0.025 220)" }}
                  >
                    Avg baseline:{" "}
                    <strong style={{ color: "oklch(0.86 0.22 155)" }}>
                      {avgBaseline} BPM
                    </strong>
                  </p>
                )}
              </div>
              <button
                type="button"
                data-ocid="calibration.primary_button"
                className="w-full py-4 rounded-full font-bold tracking-widest"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.86 0.22 155), oklch(0.78 0.22 165))",
                  color: "oklch(0.065 0.018 222)",
                  boxShadow: "0 0 20px oklch(0.86 0.22 155 / 0.4)",
                }}
                onClick={handleFinish}
              >
                START GAME →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
