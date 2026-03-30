import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { GameMode } from "../App";
import { GAME_MODES } from "../App";

const colorStyles: Record<
  string,
  { bg: string; border: string; text: string; glow: string }
> = {
  green: {
    bg: "oklch(0.86 0.22 155 / 0.12)",
    border: "oklch(0.86 0.22 155 / 0.5)",
    text: "oklch(0.86 0.22 155)",
    glow: "0 0 16px oklch(0.86 0.22 155 / 0.4)",
  },
  blue: {
    bg: "oklch(0.70 0.18 240 / 0.12)",
    border: "oklch(0.70 0.18 240 / 0.5)",
    text: "oklch(0.70 0.18 240)",
    glow: "0 0 16px oklch(0.70 0.18 240 / 0.4)",
  },
  purple: {
    bg: "oklch(0.62 0.28 295 / 0.12)",
    border: "oklch(0.62 0.28 295 / 0.5)",
    text: "oklch(0.62 0.28 295)",
    glow: "0 0 16px oklch(0.62 0.28 295 / 0.4)",
  },
  orange: {
    bg: "oklch(0.78 0.20 60 / 0.12)",
    border: "oklch(0.78 0.20 60 / 0.5)",
    text: "oklch(0.78 0.20 60)",
    glow: "0 0 16px oklch(0.78 0.20 60 / 0.4)",
  },
  slate: {
    bg: "oklch(0.65 0.05 240 / 0.12)",
    border: "oklch(0.65 0.05 240 / 0.5)",
    text: "oklch(0.65 0.05 240)",
    glow: "0 0 16px oklch(0.65 0.05 240 / 0.4)",
  },
  rose: {
    bg: "oklch(0.65 0.22 20 / 0.12)",
    border: "oklch(0.65 0.22 20 / 0.5)",
    text: "oklch(0.65 0.22 20)",
    glow: "0 0 16px oklch(0.65 0.22 20 / 0.4)",
  },
};

interface Props {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

export default function ModeSelectionScreen({
  selectedMode,
  onSelectMode,
  onBack,
}: Props) {
  const [pendingAdult, setPendingAdult] = useState<GameMode | null>(null);

  const handleSelect = (mode: GameMode) => {
    if (mode.adultOnly) {
      setPendingAdult(mode);
    } else {
      onSelectMode(mode);
    }
  };

  const confirmAdult = () => {
    if (pendingAdult) {
      onSelectMode(pendingAdult);
      setPendingAdult(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-5 pt-10 pb-5">
        <button
          type="button"
          data-ocid="mode.cancel_button"
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
            style={{ color: "oklch(0.96 0.012 220)" }}
          >
            CHOOSE MODE
          </h2>
          <p className="text-xs" style={{ color: "oklch(0.50 0.025 220)" }}>
            Select your game category
          </p>
        </div>
      </div>

      <div className="px-4 grid grid-cols-2 gap-3 pb-8">
        {GAME_MODES.map((mode, i) => {
          const styles = colorStyles[mode.color];
          const isSelected = selectedMode.id === mode.id;
          return (
            <motion.button
              key={mode.id}
              type="button"
              data-ocid={`mode.item.${i + 1}`}
              className="rounded-2xl p-4 text-left flex flex-col gap-2 transition-all duration-200 active:scale-95 min-h-[120px] relative overflow-hidden"
              style={{
                background: isSelected ? styles.bg : "oklch(0.10 0.022 222)",
                border: `1px solid ${isSelected ? styles.border : "oklch(0.18 0.028 222)"}`,
                boxShadow: isSelected ? styles.glow : "none",
              }}
              onClick={() => handleSelect(mode)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {isSelected && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: styles.text }}
                >
                  <Check
                    size={12}
                    style={{ color: "oklch(0.065 0.018 222)" }}
                  />
                </div>
              )}
              <span className="text-2xl">{mode.icon}</span>
              <div>
                <div
                  className="font-bold text-sm tracking-wider"
                  style={{
                    color: isSelected ? styles.text : "oklch(0.96 0.012 220)",
                  }}
                >
                  {mode.label}
                  {mode.adultOnly && (
                    <span
                      className="ml-1 text-[9px] px-1 py-0.5 rounded"
                      style={{
                        background: "oklch(0.65 0.22 20 / 0.2)",
                        color: "oklch(0.65 0.22 20)",
                      }}
                    >
                      18+
                    </span>
                  )}
                </div>
                <div
                  className="text-[10px] mt-0.5"
                  style={{ color: "oklch(0.50 0.025 220)" }}
                >
                  {mode.ageLabel}
                </div>
                <div
                  className="text-[11px] mt-1 leading-tight"
                  style={{ color: "oklch(0.60 0.025 220)" }}
                >
                  {mode.description}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {pendingAdult && (
          <Dialog
            open={!!pendingAdult}
            onOpenChange={() => setPendingAdult(null)}
          >
            <DialogContent
              data-ocid="mode.dialog"
              style={{
                background: "oklch(0.10 0.022 222)",
                border: "1px solid oklch(0.65 0.22 20 / 0.4)",
                boxShadow: "0 0 30px oklch(0.65 0.22 20 / 0.2)",
              }}
            >
              <DialogHeader>
                <DialogTitle style={{ color: "oklch(0.65 0.22 20)" }}>
                  🔥 Adult Content Warning
                </DialogTitle>
                <DialogDescription style={{ color: "oklch(0.70 0.030 220)" }}>
                  This mode contains adult content. Questions may be of a mature
                  or intimate nature.
                  <br />
                  <br />
                  <strong style={{ color: "oklch(0.96 0.012 220)" }}>
                    By continuing you confirm you are 18 years of age or older.
                  </strong>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <button
                  type="button"
                  data-ocid="mode.cancel_button"
                  className="flex-1 py-3 rounded-full text-sm font-semibold tracking-wider"
                  style={{
                    background: "oklch(0.15 0.025 222)",
                    color: "oklch(0.70 0.030 220)",
                    border: "1px solid oklch(0.22 0.028 222)",
                  }}
                  onClick={() => setPendingAdult(null)}
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  data-ocid="mode.confirm_button"
                  className="flex-1 py-3 rounded-full text-sm font-bold tracking-wider"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.65 0.22 20), oklch(0.60 0.24 10))",
                    color: "oklch(0.96 0.012 220)",
                    boxShadow: "0 0 16px oklch(0.65 0.22 20 / 0.4)",
                  }}
                  onClick={confirmAdult}
                >
                  I AM 18+
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
