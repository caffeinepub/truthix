# Truthix

## Current State
New project, no existing application files.

## Requested Changes (Diff)

### Add
- Splash screen with glowing neon TRUTHIX logo and animated entrance
- Home screen: Start Game, Connect Watch, Choose Mode buttons
- Mode Selection screen: Kids, Teen, Young, Party, Professional, Intimate (18+ disclaimer)
- Calibration screen: 3-5 questions, simulated heart rate baseline recording with animated graph
- Game screen: question display, recording indicator, start/stop capture
- Result screen: large truth % number, Truthful/Neutral/Suspicious label, share button
- Backend: question database by category/mode, score storage
- Truth score logic: simulated HR delta + response delay = truth percentage
- Guest mode (no login required)
- Entertainment disclaimer throughout
- Dark neon UI: black background, neon green/purple glows, futuristic gaming style

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Motoko actor with question categories, game session storage, score history
2. Backend exposes: getQuestions(mode), saveSession(score), getLeaderboard()
3. Frontend: React SPA with mobile-first layout, all 6 screens as views/routes
4. Simulated heart rate: random walk algorithm with BPM display and SVG waveform graph
5. Calibration flow: 3 baseline questions -> compute baseline BPM
6. Game flow: display question, start recording, stop, compute truth score
7. Result: animate large percentage counter, show label, share via Web Share API
8. Mode selection: grid of 6 mode cards, Intimate requires age confirmation
9. Dark theme: CSS custom properties, neon glow via box-shadow/text-shadow
