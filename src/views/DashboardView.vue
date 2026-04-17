<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Difficulty } from "@/lib/sudoku";
import {
  getUserStats,
  queryLeaderboard,
  type LeaderboardMode,
  type LocalLeaderboardEntry,
  type UserStats,
} from "@/lib/localDb";

const activeTab = ref<string>("all");
const leaderboardMode = ref<LeaderboardMode>("global");
const leaderboard = ref<LocalLeaderboardEntry[]>([]);
const myStats = ref<UserStats | null>(null);
const loadingBoard = ref(false);

const difficulties = ["all", "easy", "medium", "hard", "expert"];
const statDifficulties: Difficulty[] = ["easy", "medium", "hard", "expert"];

const difficultyColors: Record<string, string> = {
  easy: "#4caf50",
  medium: "#ffa726",
  hard: "#ef5350",
  expert: "#ab47bc",
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function fetchLeaderboard(difficulty?: string) {
  loadingBoard.value = true;
  leaderboard.value = queryLeaderboard({
    mode: leaderboardMode.value,
    difficulty,
    limit: 50,
  });
  loadingBoard.value = false;
}

function fetchMyStats() {
  myStats.value = getUserStats();
}

function switchTab(tab: string) {
  activeTab.value = tab;
  fetchLeaderboard(tab);
}

function switchMode(mode: LeaderboardMode) {
  leaderboardMode.value = mode;
  fetchLeaderboard(activeTab.value);
}

onMounted(() => {
  fetchLeaderboard();
  fetchMyStats();
});
</script>

<template>
  <div class="dashboard container">
    <h2 class="page-title">Dashboard</h2>

    <section class="stats-section" v-if="myStats">
      <h3 class="section-title">Progress</h3>
      <div class="stats-grid">
        <div class="stat-card card">
          <span class="stat-number">{{ myStats.totalCompleted }}</span>
          <span class="stat-label">Completed</span>
        </div>
        <div class="stat-card card">
          <span class="stat-number">{{ myStats.totalPlayed }}</span>
          <span class="stat-label">Played</span>
        </div>
      </div>

      <div class="difficulty-stats">
        <div
          v-for="diff in statDifficulties"
          :key="diff"
          class="diff-stat card"
        >
          <div class="diff-stat-header">
            <span
              class="diff-stat-dot"
              :style="{ background: difficultyColors[diff] }"
            ></span>
            <span class="diff-stat-name">{{ diff }}</span>
          </div>
          <div class="diff-stat-body">
            <div class="diff-stat-item">
              <span class="diff-stat-label">Played</span>
              <span class="diff-stat-value">
                {{ myStats.byDifficulty[diff]?.played ?? 0 }}
              </span>
            </div>
            <div class="diff-stat-item">
              <span class="diff-stat-label">Best</span>
              <span class="diff-stat-value mono">
                {{
                  myStats.byDifficulty[diff]?.bestTime != null
                    ? formatTime(myStats.byDifficulty[diff].bestTime!)
                    : "--:--"
                }}
              </span>
            </div>
            <div class="diff-stat-item">
              <span class="diff-stat-label">Average</span>
              <span class="diff-stat-value mono">
                {{
                  myStats.byDifficulty[diff]?.avgTime != null
                    ? formatTime(myStats.byDifficulty[diff].avgTime!)
                    : "--:--"
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="leaderboard-section card">
      <div class="leaderboard-header">
        <h3 class="section-title section-title--no-gap">Best Times</h3>
        <div class="mode-toggle">
          <button
            class="mode-btn"
            :class="{ 'mode-btn--active': leaderboardMode === 'global' }"
            @click="switchMode('global')"
          >
            Global
          </button>
          <button
            class="mode-btn"
            :class="{ 'mode-btn--active': leaderboardMode === 'daily' }"
            @click="switchMode('daily')"
          >
            Daily
          </button>
        </div>
      </div>

      <div class="tabs">
        <button
          v-for="tab in difficulties"
          :key="tab"
          class="tab"
          :class="{ 'tab--active': activeTab === tab }"
          @click="switchTab(tab)"
        >
          {{ tab === "all" ? "All" : tab }}
        </button>
      </div>

      <div class="leaderboard-table-wrap">
        <table class="leaderboard-table" v-if="leaderboard.length > 0">
          <thead>
            <tr>
              <th>#</th>
              <th>Difficulty</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, i) in leaderboard" :key="entry.gameId">
              <td class="rank">{{ i + 1 }}</td>
              <td>
                <span
                  class="difficulty-pill"
                  :style="{
                    color: difficultyColors[entry.difficulty],
                    borderColor: difficultyColors[entry.difficulty],
                  }"
                >
                  {{ entry.difficulty }}
                </span>
              </td>
              <td class="mono">{{ formatTime(entry.time) }}</td>
            </tr>
          </tbody>
        </table>

        <p v-else class="empty-state">
          {{ loadingBoard ? "Loading..." : "No entries yet. Start a puzzle to populate the board." }}
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  padding-top: 12px;
  padding-bottom: 20px;
}

.page-title {
  font-size: clamp(1.35rem, 3vw, 1.9rem);
  font-weight: 700;
  margin-bottom: 16px;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--md-sys-color-on-surface);
  margin-bottom: 12px;
}

.section-title--no-gap {
  margin-bottom: 0;
}

.stats-section {
  margin-bottom: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.stat-card {
  text-align: center;
  padding: 22px 16px;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--md-sys-color-primary);
}

.stat-label {
  display: block;
  margin-top: 2px;
  font-size: 0.78rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--md-sys-color-on-surface-variant);
}

.difficulty-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.diff-stat {
  padding: 14px;
}

.diff-stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.diff-stat-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.diff-stat-name {
  font-size: 0.92rem;
  font-weight: 600;
  text-transform: capitalize;
  color: var(--md-sys-color-on-surface);
}

.diff-stat-body {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.diff-stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
}

.diff-stat-label {
  color: var(--md-sys-color-on-surface-variant);
}

.diff-stat-value {
  font-weight: 700;
  color: var(--md-sys-color-on-surface);
}

.leaderboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
}

.mode-toggle {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: var(--radius-pill);
  background: var(--md-sys-color-surface-container-high);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.mode-btn {
  border: none;
  border-radius: var(--radius-pill);
  min-height: 34px;
  padding: 0 14px;
  background: transparent;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}

.mode-btn--active {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tab {
  border-radius: var(--radius-pill);
  border: 1px solid var(--md-sys-color-outline);
  background: var(--md-sys-color-surface-container-lowest);
  color: var(--md-sys-color-on-surface-variant);
  min-height: 34px;
  padding: 0 14px;
  text-transform: capitalize;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease, color 120ms ease;
}

.tab--active {
  background: var(--md-sys-color-secondary-container);
  border-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.leaderboard-table-wrap {
  background: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.leaderboard-table th {
  text-align: left;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 11px 14px;
  color: var(--md-sys-color-on-surface-variant);
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  background: var(--md-sys-color-surface-container-high);
}

.leaderboard-table td {
  padding: 11px 14px;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  color: var(--md-sys-color-on-surface);
}

.leaderboard-table tr:last-child td {
  border-bottom: none;
}

.rank {
  width: 44px;
  color: var(--md-sys-color-on-surface-variant);
  font-weight: 700;
}

.difficulty-pill {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  border-radius: var(--radius-pill);
  border: 1px solid;
  padding: 0 10px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.empty-state {
  padding: 36px 16px;
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.92rem;
}

@media (max-width: 900px) {
  .difficulty-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .stats-grid,
  .difficulty-stats {
    grid-template-columns: 1fr;
  }

  .leaderboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .leaderboard-table th,
  .leaderboard-table td {
    padding: 10px 11px;
  }
}
</style>
