import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/api";

type Difficulty = "easy" | "medium" | "hard" | "expert";
type GameStatus = "idle" | "in_progress" | "completed" | "abandoned";

export const useGameStore = defineStore("game", () => {
  /* ── State ─────────────────────────────────────────────────────────── */

  const gameId = ref<string | null>(null);
  const difficulty = ref<Difficulty>("medium");
  const puzzle = ref<number[][]>([]);
  const current = ref<number[][]>([]);
  const locked = ref<boolean[][]>([]);
  const status = ref<GameStatus>("idle");
  const elapsed = ref(0);
  const selectedCell = ref<{ row: number; col: number } | null>(null);
  const completedAt = ref<number | null>(null);

  /* ── Timer ─────────────────────────────────────────────────────────── */

  let timerInterval: ReturnType<typeof setInterval> | null = null;

  function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
      if (status.value === "in_progress") {
        elapsed.value++;
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  /* ── Getters ───────────────────────────────────────────────────────── */

  const formattedTime = computed(() => {
    const mins = Math.floor(elapsed.value / 60);
    const secs = elapsed.value % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  });

  const isPlaying = computed(() => status.value === "in_progress");
  const isFinished = computed(
    () => status.value === "completed" || status.value === "abandoned",
  );

  /* ── Actions ───────────────────────────────────────────────────────── */

  async function newGame(diff: Difficulty) {
    stopTimer();
    const { data } = await api.post("/game/new", { difficulty: diff });

    gameId.value = data.id;
    difficulty.value = diff;
    puzzle.value = data.puzzle;
    current.value = data.current;
    locked.value = data.locked;
    status.value = "in_progress";
    elapsed.value = 0;
    selectedCell.value = null;
    completedAt.value = null;

    startTimer();
    return data;
  }

  async function makeMove(row: number, col: number, value: number) {
    if (!gameId.value || status.value !== "in_progress") return null;

    const { data } = await api.post(`/game/${gameId.value}/move`, {
      row,
      col,
      value,
      elapsed: elapsed.value,
    });

    current.value = data.current;

    if (data.status === "completed") {
      status.value = "completed";
      completedAt.value = data.completedAt;
      stopTimer();
    }

    return data;
  }

  async function abandonGame() {
    if (!gameId.value || status.value !== "in_progress") return;

    const { data } = await api.post(`/game/${gameId.value}/abandon`);
    status.value = "abandoned";
    stopTimer();

    // Reveal solution
    if (data.solution) {
      current.value = data.solution;
    }
  }

  function selectCell(row: number, col: number) {
    selectedCell.value = { row, col };
  }

  function reset() {
    stopTimer();
    gameId.value = null;
    puzzle.value = [];
    current.value = [];
    locked.value = [];
    status.value = "idle";
    elapsed.value = 0;
    selectedCell.value = null;
    completedAt.value = null;
  }

  return {
    gameId,
    difficulty,
    puzzle,
    current,
    locked,
    status,
    elapsed,
    selectedCell,
    completedAt,
    formattedTime,
    isPlaying,
    isFinished,
    newGame,
    makeMove,
    abandonGame,
    selectCell,
    reset,
  };
});
