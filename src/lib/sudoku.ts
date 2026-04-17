export type Difficulty = "easy" | "medium" | "hard" | "expert";

const GRID_SIZE = 9;
const BOX_SIZE = 3;

const DIFFICULTY_REMOVALS: Record<Difficulty, number> = {
  easy: 36,
  medium: 45,
  hard: 52,
  expert: 58,
};

export interface PuzzleBundle {
  puzzle: number[][];
  solution: number[][];
  locked: boolean[][];
}

function createEmptyGrid(): number[][] {
  return Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE).fill(0));
}

export function cloneGrid(grid: number[][]): number[][] {
  return grid.map((row) => [...row]);
}

function isValid(grid: number[][], row: number, col: number, num: number): boolean {
  for (let c = 0; c < GRID_SIZE; c++) {
    if (grid[row]![c] === num) return false;
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r]![col] === num) return false;
  }

  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
    for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
      if (grid[r]![c] === num) return false;
    }
  }

  return true;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

function fillGrid(grid: number[][]): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row]![col] !== 0) continue;

      const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      for (const num of numbers) {
        if (isValid(grid, row, col, num)) {
          grid[row]![col] = num;
          if (fillGrid(grid)) return true;
          grid[row]![col] = 0;
        }
      }

      return false;
    }
  }

  return true;
}

function generateSolution(): number[][] {
  const grid = createEmptyGrid();
  fillGrid(grid);
  return grid;
}

function countSolutions(grid: number[][], limit = 2): number {
  let count = 0;

  function solve() {
    if (count >= limit) return;

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row]![col] !== 0) continue;

        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row]![col] = num;
            solve();
            grid[row]![col] = 0;

            if (count >= limit) return;
          }
        }

        return;
      }
    }

    count++;
  }

  solve();
  return count;
}

function getLockedCells(puzzle: number[][]): boolean[][] {
  return puzzle.map((row) => row.map((cell) => cell !== 0));
}

export function isBoardComplete(current: number[][], solution: number[][]): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (current[row]![col] !== solution[row]![col]) return false;
    }
  }
  return true;
}

export function generatePuzzle(difficulty: Difficulty = "medium"): PuzzleBundle {
  const solution = generateSolution();
  const puzzle = cloneGrid(solution);
  const removals = DIFFICULTY_REMOVALS[difficulty];

  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9] as const),
  );

  let removed = 0;
  for (const [row, col] of positions) {
    if (removed >= removals) break;

    const backup = puzzle[row]![col]!;
    puzzle[row]![col] = 0;

    const testGrid = cloneGrid(puzzle);
    if (countSolutions(testGrid) !== 1) {
      puzzle[row]![col] = backup;
    } else {
      removed++;
    }
  }

  return {
    puzzle,
    solution,
    locked: getLockedCells(puzzle),
  };
}
