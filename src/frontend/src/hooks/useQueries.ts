import { useMutation, useQuery } from "@tanstack/react-query";
import type { Question } from "../backend.d";
import { useActor } from "./useActor";

export function useGetQuestions(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Question[]>({
    queryKey: ["questions", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuestions(category);
    },
    enabled: !!actor && !isFetching && category !== "",
  });
}

export function useSaveSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ mode, score }: { mode: string; score: number }) => {
      if (!actor) throw new Error("No actor");
      return actor.saveSession(mode, BigInt(Math.round(score)));
    },
  });
}

export function useGetTopScores() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["topScores"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopScores();
    },
    enabled: !!actor && !isFetching,
  });
}
