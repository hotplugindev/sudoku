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

const isEditable = computed(
    () => game.isPlaying && !game.isPaused && !isLocked.value,
);

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

function applyNumber(num: number) {
    if (!isEditable.value) return;
    if (game.pencilMode) {
        game.toggleNote(props.row, props.col, num);
    } else {
        game.makeMove(props.row, props.col, num);
    }
}

function clearSelection() {
    if (!isEditable.value) return;
    if (game.pencilMode) {
        game.clearNotes(props.row, props.col);
    } else {
        game.makeMove(props.row, props.col, 0);
    }
}

const showMobilePicker = computed(() => isSelected.value && isEditable.value);
const openPickerBelow = computed(() => props.row <= 2);
const alignPickerLeft = computed(() => props.col <= 1);
const alignPickerRight = computed(() => props.col >= 7);
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

        <Transition name="picker-pop">
            <div
                v-if="showMobilePicker"
                class="mobile-picker"
                :class="{
                    'mobile-picker--bottom': openPickerBelow,
                    'mobile-picker--left': alignPickerLeft,
                    'mobile-picker--right': alignPickerRight,
                }"
                @click.stop
            >
                <button
                    v-for="n in 9"
                    :key="'picker-' + n"
                    class="mobile-picker__btn"
                    :class="{
                        'mobile-picker__btn--active': (!game.pencilMode && value === n) || (game.pencilMode && hasNote(n)),
                    }"
                    @click.stop="applyNumber(n)"
                >
                    {{ n }}
                </button>
                <button
                    class="mobile-picker__btn mobile-picker__btn--clear"
                    @click.stop="clearSelection"
                >
                    ✕
                </button>
            </div>
        </Transition>
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
  transition: background 130ms ease, box-shadow 130ms ease, transform 90ms ease;
  position: relative;
}

.cell:hover {
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary) 9%,
    var(--md-sys-color-surface-container-low)
  );
  transform: translateZ(0);
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
    var(--md-sys-color-primary) 24%,
    var(--md-sys-color-surface-container-low)
  );
}

.cell--selected {
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary) 30%,
    var(--md-sys-color-surface-container-low)
  );
  box-shadow: inset 0 0 0 2px var(--md-sys-color-primary);
  z-index: 8;
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
  font-size: clamp(0.95rem, 2.3vw, 1.32rem);
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

.mobile-picker {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%);
  z-index: 20;
  width: clamp(150px, 26vw, 186px);
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
  border-radius: 14px;
  border: 1px solid var(--md-sys-color-outline-variant);
  background: color-mix(in srgb, var(--md-sys-color-surface-container-high) 96%, transparent);
  box-shadow: var(--elev-4);
  backdrop-filter: blur(8px);
}

.mobile-picker--bottom {
  top: calc(100% + 8px);
  bottom: auto;
}

.mobile-picker--left {
  left: 0;
  transform: none;
}

.mobile-picker--right {
  right: 0;
  left: auto;
  transform: none;
}

.mobile-picker__btn {
  min-height: 28px;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 9px;
  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  font-size: 0.84rem;
  font-family: var(--font-mono);
  font-weight: 700;
  cursor: pointer;
}

.mobile-picker__btn--active {
  border-color: var(--md-sys-color-primary);
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.mobile-picker__btn--clear {
  color: var(--md-sys-color-error);
}

.picker-pop-enter-active,
.picker-pop-leave-active {
  transition: opacity 130ms ease, transform 130ms ease;
}

.picker-pop-enter-from,
.picker-pop-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(6px);
}

@media (min-width: 761px) {
  .mobile-picker {
    display: none;
  }
}

@media (max-width: 420px) {
  .mobile-picker {
    width: 156px;
    padding: 6px;
    gap: 5px;
  }

  .mobile-picker__btn {
    min-height: 26px;
    font-size: 0.78rem;
  }
}
</style>
