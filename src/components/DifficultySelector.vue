<script setup lang="ts">
defineProps<{
  loading?: boolean;
}>();

const emit = defineEmits<{
  select: [difficulty: string];
}>();

const difficulties = [
  { value: "easy", label: "Easy", desc: "Perfect for beginners", color: "#4caf50" },
  { value: "medium", label: "Medium", desc: "A fair challenge", color: "#ffa726" },
  { value: "hard", label: "Hard", desc: "For experienced players", color: "#ef5350" },
  { value: "expert", label: "Expert", desc: "Ultimate brain teaser", color: "#ab47bc" },
];
</script>

<template>
  <div class="difficulty-grid">
    <button
      v-for="diff in difficulties"
      :key="diff.value"
      class="diff-card"
      :disabled="loading"
      @click="emit('select', diff.value)"
    >
      <div class="diff-indicator" :style="{ background: diff.color }"></div>
      <div class="diff-info">
        <span class="diff-label">{{ diff.label }}</span>
        <span class="diff-desc">{{ diff.desc }}</span>
      </div>
    </button>
  </div>
</template>

<style scoped>
.difficulty-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 720px;
}

.diff-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  min-height: 94px;
  padding: 16px;
  background: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 150ms ease, border-color 150ms ease,
    background 150ms ease;
  text-align: left;
}

.diff-card:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--md-sys-color-primary) 35%, var(--md-sys-color-outline-variant));
  box-shadow: var(--elev-2);
  background: var(--md-sys-color-surface-container);
}

.diff-card:disabled {
  opacity: 0.44;
  cursor: not-allowed;
}

.diff-indicator {
  width: 12px;
  height: 58px;
  border-radius: 6px;
  flex-shrink: 0;
}

.diff-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
}

.diff-label {
  font-size: 1rem;
  font-weight: 700;
  color: var(--md-sys-color-on-surface);
}

.diff-desc {
  font-size: 0.84rem;
  color: var(--md-sys-color-on-surface-variant);
}

@media (max-width: 760px) {
  .difficulty-grid {
    grid-template-columns: 1fr;
  }
}
</style>
