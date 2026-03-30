import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Question {
    id: bigint;
    difficulty: bigint;
    text: string;
    category: string;
}
export type Time = bigint;
export interface GameSession {
    mode: string;
    timestamp: Time;
    truthScore: bigint;
    sessionId: bigint;
}
export interface backendInterface {
    getQuestionById(id: bigint): Promise<Question>;
    getQuestions(category: string): Promise<Array<Question>>;
    getTopScores(): Promise<Array<GameSession>>;
    saveSession(mode: string, score: bigint): Promise<bigint>;
}
