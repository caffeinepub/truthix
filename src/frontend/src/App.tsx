import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import CalibrationScreen from "./screens/CalibrationScreen";
import GameScreen from "./screens/GameScreen";
import HomeScreen from "./screens/HomeScreen";
import ModeSelectionScreen from "./screens/ModeSelectionScreen";
import ResultScreen from "./screens/ResultScreen";
import SplashScreen from "./screens/SplashScreen";

export type Screen =
  | "splash"
  | "home"
  | "mode"
  | "calibrate"
  | "game"
  | "result";

export interface GameMode {
  id: string;
  label: string;
  description: string;
  ageLabel: string;
  color: string;
  icon: string;
  adultOnly?: boolean;
}

export const GAME_MODES: GameMode[] = [
  {
    id: "Kids",
    label: "KIDS",
    description: "Fun questions for little ones",
    ageLabel: "Ages 6–12",
    color: "green",
    icon: "🎈",
  },
  {
    id: "Teen",
    label: "TEEN",
    description: "Trending topics & challenges",
    ageLabel: "Ages 13–17",
    color: "blue",
    icon: "⚡",
  },
  {
    id: "Young",
    label: "YOUNG",
    description: "Life decisions & adventures",
    ageLabel: "Ages 18–25",
    color: "purple",
    icon: "🚀",
  },
  {
    id: "Party",
    label: "PARTY",
    description: "Wild & hilarious ice breakers",
    ageLabel: "All ages",
    color: "orange",
    icon: "🎉",
  },
  {
    id: "Professional",
    label: "PRO",
    description: "Workplace truths exposed",
    ageLabel: "Workplace",
    color: "slate",
    icon: "💼",
  },
  {
    id: "Intimate",
    label: "INTIMATE",
    description: "Deep personal revelations",
    ageLabel: "18+ only",
    color: "rose",
    icon: "🔥",
    adultOnly: true,
  },
];

export interface GameState {
  mode: GameMode;
  baselineBPM: number;
  lastScore: number;
  lastBPM: number;
  responseDelay: number;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [selectedMode, setSelectedMode] = useState<GameMode>(GAME_MODES[3]);
  const [gameState, setGameState] = useState<GameState>({
    mode: GAME_MODES[3],
    baselineBPM: 70,
    lastScore: 0,
    lastBPM: 70,
    responseDelay: 2,
  });

  const navigate = (s: Screen) => setScreen(s);

  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center">
      <div className="w-full max-w-[480px] min-h-screen relative overflow-hidden bg-background">
        {screen === "splash" && (
          <SplashScreen onComplete={() => navigate("home")} />
        )}
        {screen === "home" && (
          <HomeScreen
            selectedMode={selectedMode}
            onStartGame={() => navigate("calibrate")}
            onConnectWatch={() => {}}
            onChooseMode={() => navigate("mode")}
          />
        )}
        {screen === "mode" && (
          <ModeSelectionScreen
            selectedMode={selectedMode}
            onSelectMode={(m) => {
              setSelectedMode(m);
              setGameState((g) => ({ ...g, mode: m }));
            }}
            onBack={() => navigate("home")}
          />
        )}
        {screen === "calibrate" && (
          <CalibrationScreen
            onComplete={(bpm) => {
              setGameState((g) => ({ ...g, baselineBPM: bpm }));
              navigate("game");
            }}
            onBack={() => navigate("home")}
          />
        )}
        {screen === "game" && (
          <GameScreen
            mode={selectedMode}
            baselineBPM={gameState.baselineBPM}
            onComplete={(score, bpm, delay) => {
              setGameState((g) => ({
                ...g,
                lastScore: score,
                lastBPM: bpm,
                responseDelay: delay,
              }));
              navigate("result");
            }}
            onBack={() => navigate("home")}
          />
        )}
        {screen === "result" && (
          <ResultScreen
            score={gameState.lastScore}
            bpm={gameState.lastBPM}
            baselineBPM={gameState.baselineBPM}
            mode={selectedMode}
            onPlayAgain={() => navigate("game")}
            onHome={() => navigate("home")}
          />
        )}
        <Toaster
          toastOptions={{
            style: {
              background: "oklch(0.10 0.022 222)",
              border: "1px solid oklch(0.18 0.028 222)",
              color: "oklch(0.96 0.012 220)",
            },
          }}
        />
      </div>
    </div>
  );
}
