<script setup lang="ts">
</script>

<template>
  <nav class="navbar">
    <div class="navbar-inner container">
      <RouterLink to="/" class="logo">
        <span class="logo-icon">◧</span>
        <span class="logo-text">Sudoku</span>
      </RouterLink>

      <div class="nav-links">
        <RouterLink to="/" class="nav-link">Play</RouterLink>
        <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: 0 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
}

.logo-icon {
  font-size: 1.4rem;
  color: var(--accent);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  transition: color var(--transition);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text-primary);
}
</style>
