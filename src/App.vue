<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
</script>

<template>
    <div class="app-shell">
        <NavBar />
        <main class="app-main">
            <RouterView />
        </main>
    </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 14px 0 26px;
}

@media (max-width: 760px) {
  .app-main {
    padding-bottom: calc(102px + env(safe-area-inset-bottom));
  }
}
</style>
