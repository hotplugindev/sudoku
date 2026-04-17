<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getActiveTheme, setTheme, type ThemeMode } from "@/lib/theme";

const theme = ref<ThemeMode>("light");

function selectTheme(mode: ThemeMode) {
  theme.value = mode;
  setTheme(mode);
}

onMounted(() => {
  theme.value = getActiveTheme();
});
</script>

<template>
  <nav class="top-app-bar">
    <div class="top-app-bar__inner container">
      <RouterLink to="/" class="brand">
        <span class="brand__glyph">◧</span>
        <span class="brand__text">Sudoku</span>
      </RouterLink>

      <div class="controls">
        <div class="nav-pills" aria-label="Primary navigation">
          <RouterLink to="/" class="nav-pill">Play</RouterLink>
          <RouterLink to="/dashboard" class="nav-pill">Dashboard</RouterLink>
        </div>

        <div class="theme-toggle" role="group" aria-label="Theme">
          <button
            class="theme-toggle__btn"
            :class="{ 'theme-toggle__btn--active': theme === 'light' }"
            @click="selectTheme('light')"
            aria-label="Light theme"
          >
            Light
          </button>
          <button
            class="theme-toggle__btn"
            :class="{ 'theme-toggle__btn--active': theme === 'dark' }"
            @click="selectTheme('dark')"
            aria-label="Dark theme"
          >
            Dark
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.top-app-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  background: color-mix(in srgb, var(--md-sys-color-surface) 84%, transparent);
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.top-app-bar__inner {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--md-sys-color-on-surface);
  text-decoration: none;
  font-size: 1.15rem;
  font-weight: 700;
}

.brand__glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  color: var(--md-sys-color-on-primary-container);
  background: var(--md-sys-color-primary-container);
}

.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-pills {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
  border-radius: var(--radius-pill);
  background: var(--md-sys-color-surface-container-high);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.nav-pill {
  min-height: 36px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-pill);
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 120ms ease, color 120ms ease;
}

.nav-pill:hover {
  text-decoration: none;
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary) 12%,
    var(--md-sys-color-surface-container-high)
  );
}

.nav-pill.router-link-active {
  color: var(--md-sys-color-on-secondary-container);
  background: var(--md-sys-color-secondary-container);
}

.theme-toggle {
  display: inline-flex;
  background: var(--md-sys-color-surface-container-high);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--radius-pill);
  padding: 3px;
}

.theme-toggle__btn {
  border: none;
  background: transparent;
  color: var(--md-sys-color-on-surface-variant);
  border-radius: var(--radius-pill);
  min-height: 34px;
  padding: 0 14px;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 140ms ease, color 140ms ease;
}

.theme-toggle__btn--active {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

@media (max-width: 860px) {
  .top-app-bar__inner {
    min-height: 112px;
    padding-top: 10px;
    padding-bottom: 10px;
    flex-direction: column;
    align-items: stretch;
  }

  .brand {
    justify-content: center;
  }

  .controls {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .nav-pill {
    min-height: 34px;
    padding: 0 12px;
    font-size: 0.82rem;
  }

  .theme-toggle__btn {
    min-height: 32px;
    padding: 0 12px;
  }
}
</style>
