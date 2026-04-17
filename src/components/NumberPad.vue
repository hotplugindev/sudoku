<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "@/stores/game";

const game = useGameStore();

function placeNumber(num: number) {
    if (!game.selectedCell || !game.isPlaying) return;
    const { row, col } = game.selectedCell;
    if (game.locked[row]?.[col]) return;
    game.makeMove(row, col, num);
}

function erase() {
    if (!game.selectedCell || !game.isPlaying) return;
    const { row, col } = game.selectedCell;
    if (game.locked[row]?.[col]) return;
    game.makeMove(row, col, 0);
}

function placeNote(num: number) {
    if (!game.selectedCell || !game.isPlaying) return;
    const { row, col } = game.selectedCell;
    if (game.locked[row]?.[col]) return;
    game.toggleNote(row, col, num);
}

function eraseNotes() {
    if (!game.selectedCell || !game.isPlaying) return;
    const { row, col } = game.selectedCell;
    if (game.locked[row]?.[col]) return;
    game.clearNotes(row, col);
}

// Count how many of each number are missing from the board
function getMissingCount(num: number): number {
    let count = 0;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = game.current[row]?.[col];
            if (cell && cell === num) {
                count++;
            }
        }
    }
    return 9 - count;
}

const missingCounts = computed(() => {
    const counts: Record<number, number> = {};
    for (let n = 1; n <= 9; n++) {
        counts[n] = getMissingCount(n);
    }
    return counts;
});
</script>

<template>
    <div class="pad-container">
        <!-- Pencil mode toggle -->
        <button
            class="pencil-toggle"
            :class="{ 'pencil-toggle--active': game.pencilMode }"
            :disabled="!game.isPlaying"
            @click="game.togglePencilMode()"
        >
            <svg
                class="pencil-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
            </svg>
            <span class="pencil-label">{{
                game.pencilMode ? "Notes ON" : "Notes OFF"
            }}</span>
            <span class="pencil-hint">N</span>
        </button>

        <!-- Grey-out completed toggle -->
        <button
            class="pencil-toggle"
            :class="{ 'pencil-toggle--active': game.greyOutCompleted }"
            :disabled="!game.isPlaying"
            @click="game.toggleGreyOutCompleted()"
        >
            <svg
                class="pencil-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M9 9h6v6H9z" />
            </svg>
            <span class="pencil-label">{{
                game.greyOutCompleted ? "Grey-out ON" : "Grey-out OFF"
            }}</span>
            <span class="pencil-hint">G</span>
        </button>

        <!-- Number pad -->
        <div class="numpad-section">
            <span class="section-label">Numbers</span>
            <div class="numpad">
                <button
                    v-for="n in 9"
                    :key="'num-' + n"
                    class="numpad-btn"
                    :class="{ 'numpad-btn--pencil': game.pencilMode }"
                    :disabled="!game.isPlaying"
                    @click="game.pencilMode ? placeNote(n) : placeNumber(n)"
                >
                    <span class="numpad-value">{{ n }}</span>
                    <span v-if="missingCounts[n] && missingCounts[n] > 0" class="numpad-counter">{{ missingCounts[n] }}</span>
                </button>
                <button
                    class="numpad-btn numpad-erase"
                    :disabled="!game.isPlaying"
                    @click="game.pencilMode ? eraseNotes() : erase()"
                >
                    ✕
                </button>
            </div>
        </div>

        <!-- Notes quick pad -->
        <div class="numpad-section notes-section">
            <span class="section-label">Quick Notes</span>
            <div class="numpad numpad--notes">
                <button
                    v-for="n in 9"
                    :key="'note-' + n"
                    class="numpad-btn numpad-btn--note"
                    :disabled="!game.isPlaying"
                    @click="placeNote(n)"
                >
                    {{ n }}
                </button>
                <button
                    class="numpad-btn numpad-btn--note numpad-erase--note"
                    :disabled="!game.isPlaying"
                    @click="eraseNotes()"
                >
                    ✕
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pad-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pencil-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid var(--md-sys-color-outline);
  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.84rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 130ms ease, border-color 130ms ease, color 130ms ease;
  user-select: none;
}

.pencil-toggle:hover:not(:disabled) {
  background: var(--md-sys-color-surface-container-highest);
}

.pencil-toggle--active {
  background: var(--md-sys-color-primary-container);
  border-color: color-mix(
    in srgb,
    var(--md-sys-color-primary) 50%,
    var(--md-sys-color-outline)
  );
  color: var(--md-sys-color-on-primary-container);
}

.pencil-toggle:disabled {
  opacity: 0.42;
  cursor: not-allowed;
}

.pencil-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.pencil-label {
  flex: 1;
  text-align: left;
}

.pencil-hint {
  min-width: 22px;
  min-height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid var(--md-sys-color-outline-variant);
  background: var(--md-sys-color-surface-container-lowest);
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.64rem;
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.numpad-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-label {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--md-sys-color-on-surface-variant);
}

.numpad {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 7px;
  width: 100%;
}

.numpad-btn {
  min-height: 50px;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 12px;
  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.12rem;
  font-family: var(--font-mono);
  font-weight: 600;
  cursor: pointer;
  transition: background 130ms ease, border-color 130ms ease, color 130ms ease,
    transform 90ms ease;
}

.numpad-value {
  display: block;
}

.numpad-counter {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  border-radius: 999px;
  padding: 0 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1;
}

.numpad-btn:hover:not(:disabled) {
  background: var(--md-sys-color-primary-container);
  border-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary-container);
}

.numpad-btn:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.numpad-btn--pencil {
  background: color-mix(
    in srgb,
    var(--md-sys-color-secondary-container) 68%,
    var(--md-sys-color-surface-container-high)
  );
}

.numpad-erase {
  color: var(--md-sys-color-error);
}

.numpad-erase:hover:not(:disabled) {
  background: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  border-color: color-mix(
    in srgb,
    var(--md-sys-color-error) 52%,
    var(--md-sys-color-outline)
  );
}

.notes-section {
  opacity: 0.9;
}

.numpad--notes {
  gap: 6px;
}

.numpad-btn--note {
  min-height: 38px;
  font-size: 0.82rem;
  font-weight: 500;
  background: var(--md-sys-color-surface-container-low);
  border: 1px dashed var(--md-sys-color-outline);
  color: var(--md-sys-color-on-surface-variant);
}

.numpad-btn--note:hover:not(:disabled) {
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  border-style: solid;
  border-color: var(--md-sys-color-secondary);
}

.numpad-erase--note {
  color: var(--md-sys-color-error);
}

.numpad-erase--note:hover:not(:disabled) {
  background: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  border-color: var(--md-sys-color-error);
  border-style: solid;
}

@media (max-width: 620px) {
  .pad-container {
    gap: 8px;
  }

  .pencil-toggle {
    min-height: 38px;
    font-size: 0.8rem;
    border-radius: 10px;
  }

  .pencil-hint {
    display: none;
  }

  .section-label {
    font-size: 0.64rem;
  }

  .numpad {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 6px;
  }

  .numpad-btn {
    min-height: 44px;
    font-size: 1rem;
    border-radius: 10px;
  }

  .numpad-btn--note {
    min-height: 34px;
    font-size: 0.75rem;
  }

  .notes-section {
    display: none;
  }
}
</style>
