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
  padding: 18px 0 28px;
}
</style>
