<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/game";
import SudokuBoard from "@/components/SudokuBoard.vue";
import NumberPad from "@/components/NumberPad.vue";
import DifficultySelector from "@/components/DifficultySelector.vue";

const game = useGameStore();
const router = useRouter();
const loading = ref(false);

async function startGame(difficulty: string) {
    loading.value = true;
    try {
        await game.newGame(difficulty as "easy" | "medium" | "hard" | "expert");
    } catch (err) {
        console.error("Failed to start game:", err);
    } finally {
        loading.value = false;
    }
}

async function abandon() {
    if (!confirm("Are you sure you want to give up?")) return;
    await game.abandonGame();
}

function newGameFromFinish() {
    game.reset();
}

function goToDashboard() {
    router.push("/dashboard");
}

const difficultyColors: Record<string, string> = {
    easy: "#4caf50",
    medium: "#ffa726",
    hard: "#ef5350",
    expert: "#ab47bc",
};
</script>

<template>
  <div class="game-page container">
    <!-- Difficulty selection screen -->
    <div v-if="game.status === 'idle'" class="game-start card">
      <h2 class="page-title">New Game</h2>
      <p class="page-subtitle">Choose your difficulty</p>
      <DifficultySelector :loading="loading" @select="startGame" />
    </div>

    <!-- Active game -->
    <div v-else class="game-active">
      <div class="game-info card">
        <div class="info-item">
          <span class="info-label">Difficulty</span>
          <span
            class="info-value difficulty-badge"
            :style="{ color: difficultyColors[game.difficulty] }"
          >
            {{ game.difficulty }}
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">Mode</span>
          <span
            class="info-value mode-badge"
            :class="{ 'mode-badge--pencil': game.pencilMode }"
          >
            {{ game.pencilMode ? "Notes" : "Normal" }}
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">Time</span>
          <span class="info-value mono">{{ game.formattedTime }}</span>
        </div>
      </div>

      <div class="game-layout">
        <div class="board-container card">
          <SudokuBoard />

          <Transition name="fade">
            <div v-if="game.isPaused" class="pause-overlay" @click="game.resumeGame()">
              <div class="pause-content">
                <div class="pause-icon">⏸</div>
                <h3>Game Paused</h3>
                <p>Tap to resume</p>
              </div>
            </div>
          </Transition>
        </div>

        <div class="game-sidebar card">
          <NumberPad />

          <div class="game-actions" v-if="game.isPlaying">
            <button class="btn btn-secondary btn-sm" @click="game.togglePause()">
              {{ game.isPaused ? "Resume" : "Pause" }}
            </button>
            <button class="btn btn-danger btn-sm" @click="abandon">Give Up</button>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="game.isFinished" class="completion-overlay">
        <div class="completion-modal card">
          <template v-if="game.status === 'completed'">
            <div class="result-icon result-win">&#10003;</div>
            <h2>Puzzle Solved</h2>
            <div class="result-stats">
              <div class="result-stat">
                <span class="result-stat-label">Difficulty</span>
                <span
                  class="result-stat-value difficulty-badge"
                  :style="{ color: difficultyColors[game.difficulty] }"
                >
                  {{ game.difficulty }}
                </span>
              </div>
              <div class="result-stat">
                <span class="result-stat-label">Time</span>
                <span class="result-stat-value mono">{{ game.formattedTime }}</span>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="result-icon result-lose">&#10007;</div>
            <h2>Game Abandoned</h2>
            <p class="result-sub">The full solution has been revealed on the board.</p>
          </template>

          <div class="completion-actions">
            <button class="btn btn-secondary" @click="newGameFromFinish">
              New Puzzle
            </button>
            <button class="btn btn-primary" @click="goToDashboard">
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.game-page {
  padding-top: 12px;
  padding-bottom: 24px;
}

.game-start {
  max-width: 720px;
  margin: 24px auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.page-title {
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-weight: 700;
  letter-spacing: 0.01em;
}

.page-subtitle {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.game-info {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.info-item {
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: var(--md-sys-color-surface-container-high);
  border: 1px solid var(--md-sys-color-outline-variant);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.72rem;
  color: var(--md-sys-color-on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
}

.difficulty-badge {
  text-transform: capitalize;
}

.mode-badge {
  text-transform: capitalize;
  color: var(--md-sys-color-on-surface-variant);
}

.mode-badge--pencil {
  color: var(--md-sys-color-primary);
}

.game-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
  align-items: start;
}

.board-container {
  position: relative;
  display: grid;
  place-items: center;
  padding: 14px;
}

.pause-overlay {
  position: absolute;
  inset: 14px;
  border-radius: 18px;
  background: color-mix(in srgb, var(--md-sys-color-inverse-surface) 74%, transparent);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.pause-content {
  text-align: center;
  color: var(--md-sys-color-inverse-on-surface);
}

.pause-icon {
  font-size: 2.8rem;
  margin-bottom: 6px;
}

.pause-overlay h3 {
  font-size: 1.2rem;
  margin-bottom: 2px;
}

.pause-overlay p {
  font-size: 0.88rem;
  opacity: 0.84;
}

.game-sidebar {
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: sticky;
  top: 96px;
}

.game-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.completion-overlay {
  position: fixed;
  inset: 0;
  padding: 20px;
  background: color-mix(in srgb, var(--md-sys-color-inverse-surface) 58%, transparent);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.completion-modal {
  text-align: center;
  width: 100%;
  max-width: 480px;
  padding: 30px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
  animation: slide-up 220ms ease-out;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
}

.result-win {
  color: var(--md-sys-color-on-tertiary-container);
  background: var(--md-sys-color-tertiary-container);
}

.result-lose {
  color: var(--md-sys-color-on-error-container);
  background: var(--md-sys-color-error-container);
}

.completion-modal h2 {
  font-size: 1.55rem;
  line-height: 1.2;
}

.result-sub {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.93rem;
}

.result-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 100%;
  max-width: 340px;
}

.result-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.result-stat-label {
  font-size: 0.7rem;
  color: var(--md-sys-color-on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.result-stat-value {
  font-size: 1.15rem;
  font-weight: 700;
}

.completion-actions {
  margin-top: 8px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.completion-actions .btn {
  width: 100%;
}

@media (max-width: 1080px) {
  .game-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .game-sidebar {
    position: static;
  }
}

@media (max-width: 720px) {
  .game-info {
    grid-template-columns: 1fr;
  }

  .game-actions,
  .completion-actions {
    grid-template-columns: 1fr;
  }

  .board-container {
    padding: 10px;
  }

  .pause-overlay {
    inset: 10px;
  }
}
</style>
