<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getActiveTheme, setTheme, type ThemeMode } from "@/lib/theme";

const theme = ref<ThemeMode>("light");

const themeGlyph = computed(() => (theme.value === "dark" ? "☾" : "☀"));
const themeLabel = computed(() =>
  theme.value === "dark" ? "Switch to light mode" : "Switch to dark mode",
);

function toggleTheme() {
  const next: ThemeMode = theme.value === "dark" ? "light" : "dark";
  theme.value = next;
  setTheme(next);
}

onMounted(() => {
  theme.value = getActiveTheme();
});
</script>

<template>
  <header class="app-header">
    <div class="app-header__bar container">
      <RouterLink to="/" class="brand">
        <span class="brand__glyph">◧</span>
        <span class="brand__text">Sudoku</span>
      </RouterLink>

      <button
        class="theme-btn"
        type="button"
        :aria-label="themeLabel"
        @click="toggleTheme"
      >
        <span class="theme-btn__glyph">{{ themeGlyph }}</span>
      </button>
    </div>

    <div class="desktop-nav container">
      <RouterLink to="/" class="desktop-nav__item">Play</RouterLink>
      <RouterLink to="/dashboard" class="desktop-nav__item">
        Dashboard
      </RouterLink>
    </div>
  </header>

  <nav class="mobile-nav">
    <RouterLink to="/" class="mobile-nav__item">
      <span class="mobile-nav__icon">⌂</span>
      <span class="mobile-nav__label">Play</span>
    </RouterLink>
    <RouterLink to="/dashboard" class="mobile-nav__item">
      <span class="mobile-nav__icon">≡</span>
      <span class="mobile-nav__label">Dashboard</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  background: color-mix(in srgb, var(--md-sys-color-surface) 86%, transparent);
}

.app-header__bar {
  min-height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--md-sys-color-on-surface);
  text-decoration: none;
  font-size: 1.08rem;
  font-weight: 700;
}

.brand__glyph {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--md-sys-color-on-primary-container);
  background: var(--md-sys-color-primary-container);
}

.theme-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--md-sys-color-outline-variant);
  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.02rem;
}

.desktop-nav {
  min-height: 52px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.desktop-nav__item {
  min-height: 36px;
  padding: 0 16px;
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.86rem;
  font-weight: 600;
  text-decoration: none;
}

.desktop-nav__item.router-link-active {
  border-color: var(--md-sys-color-primary-container);
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.mobile-nav {
  display: none;
}

@media (max-width: 760px) {
  .desktop-nav {
    display: none;
  }

  .app-header {
    border-bottom: none;
  }

  .mobile-nav {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom));
    z-index: 110;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    border-radius: 20px;
    padding: 8px;
    border: 1px solid var(--md-sys-color-outline-variant);
    background: color-mix(in srgb, var(--md-sys-color-surface-container-high) 92%, transparent);
    backdrop-filter: blur(12px);
    box-shadow: var(--elev-4);
  }

  .mobile-nav__item {
    min-height: 46px;
    border-radius: 14px;
    color: var(--md-sys-color-on-surface-variant);
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    text-decoration: none;
  }

  .mobile-nav__icon {
    font-size: 1rem;
    line-height: 1;
  }

  .mobile-nav__label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  .mobile-nav__item.router-link-active {
    background: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
  }
}
</style>
