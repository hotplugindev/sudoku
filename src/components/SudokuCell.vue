<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "@/stores/game";

const props = defineProps<{
    row: number;
    col: number;
}>();

const game = useGameStore();

const value = computed(() => game.current[props.row]?.[props.col] || 0);
const isLocked = computed(() => game.locked[props.row]?.[props.col] ?? false);

const cellNotes = computed(() => {
    if (value.value !== 0) return [];
    const s = game.getNotes(props.row, props.col);
    return Array.from(s).sort();
});

const hasNotes = computed(() => cellNotes.value.length > 0);

const isSelected = computed(
    () =>
        game.selectedCell?.row === props.row &&
        game.selectedCell?.col === props.col,
);

const isHighlighted = computed(() => {
    if (!game.selectedCell) return false;
    const { row, col } = game.selectedCell;
    return (
        row === props.row ||
        col === props.col ||
        (Math.floor(row / 3) === Math.floor(props.row / 3) &&
            Math.floor(col / 3) === Math.floor(props.col / 3))
    );
});

const isSameValue = computed(() => {
    if (!game.selectedCell || value.value === 0) return false;
    const selVal = game.current[game.selectedCell.row]?.[game.selectedCell.col];
    return selVal !== 0 && selVal === value.value;
});

const isInCompletedRegion = computed(() => 
    game.greyOutCompleted && game.isCellInCompletedRegion(props.row, props.col)
);

/* Right & bottom thick borders for 3x3 box separation */
const thickRight = computed(() => props.col === 2 || props.col === 5);
const thickBottom = computed(() => props.row === 2 || props.row === 5);

/** Check if a specific note number (1-9) is present */
function hasNote(n: number): boolean {
    const s = game.getNotes(props.row, props.col);
    return s.has(n);
}

function onClick() {
    game.selectCell(props.row, props.col);
}
</script>

<template>
    <div
        class="cell"
        :class="{
            'cell--locked': isLocked,
            'cell--selected': isSelected,
            'cell--highlighted': isHighlighted && !isSelected,
            'cell--same-value': isSameValue && !isSelected,
            'cell--thick-right': thickRight,
            'cell--thick-bottom': thickBottom,
            'cell--completed': isInCompletedRegion,
        }"
        @click="onClick"
    >
        <!-- Main placed number -->
        <span v-if="value !== 0" class="cell-value">{{ value }}</span>

        <!-- Pencil notes as 3×3 mini-grid -->
        <div v-else-if="hasNotes" class="notes-grid">
            <span
                v-for="n in 9"
                :key="n"
                class="note"
                :class="{ 'note--visible': hasNote(n) }"
            >
                {{ hasNote(n) ? n : "" }}
            </span>
        </div>
    </div>
</template>

<style scoped>
.cell {
  width: calc(var(--board-size) / 9);
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--md-sys-color-outline-variant);
  background: var(--md-sys-color-surface-container-low);
  cursor: pointer;
  transition: background 130ms ease, box-shadow 130ms ease;
  position: relative;
}

.cell:hover {
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary) 9%,
    var(--md-sys-color-surface-container-low)
  );
}

.cell--locked {
  background: var(--md-sys-color-surface-container-high);
}

.cell--locked .cell-value {
  color: var(--md-sys-color-on-surface);
  font-weight: 700;
}

.cell--highlighted {
  background: color-mix(
    in srgb,
    var(--md-sys-color-secondary) 17%,
    var(--md-sys-color-surface-container-low)
  );
}

.cell--same-value {
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary) 20%,
    var(--md-sys-color-surface-container-low)
  );
}

.cell--selected {
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary) 22%,
    var(--md-sys-color-surface-container-low)
  );
  box-shadow: inset 0 0 0 2px var(--md-sys-color-primary);
}

.cell--thick-right {
  border-right: 2px solid var(--md-sys-color-outline);
}

.cell--thick-bottom {
  border-bottom: 2px solid var(--md-sys-color-outline);
}

.cell--completed {
  opacity: 0.58;
}

.cell-value {
  font-size: clamp(0.92rem, 2.2vw, 1.25rem);
  font-family: var(--font-mono);
  color: var(--md-sys-color-primary);
  font-weight: 700;
  line-height: 1;
}

.cell--locked .cell-value {
  color: var(--md-sys-color-on-surface);
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  padding: 1px;
}

.note {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(0.38rem, 0.95vw, 0.58rem);
  font-family: var(--font-mono);
  font-weight: 500;
  color: transparent;
  line-height: 1;
  user-select: none;
}

.note--visible {
  color: var(--md-sys-color-on-surface-variant);
}
</style>
