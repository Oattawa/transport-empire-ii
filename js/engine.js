// ── Constants ─────────────────────────────────────────────────────────────────
const COLS = 50, ROWS = 32, TILE = 16;
const TERRAIN = { PLAINS:0, FOREST:1, MOUNTAIN:2, WATER:3, DESERT:4 };
const TERRAIN_COLORS = ['#5a8a3a','#3a6e2a','#8a7850','#2060b0','#c8c060'];
const TERRAIN_DARK   = ['#4a7a2a','#2a5e1a','#7a6840','#1050a0','#b8b050'];

const PLAYER_COLORS = ['#e04040','#40a0e0','#40c060','#e0c040'];
const PLAYER_NAMES  = ['Red Rail Co.','Blue Express','Green Lines','Gold Transit'];

const WIN_AMOUNT = 5000000;

// Rail/build costs (earnings)
const EARN_RAIL    = 1000;
const EARN_STATION = 5000;
const EARN_TRAIN   = 10000;
const EARN_PER_TRAIN_PER_YEAR = 25000;

// ── State ─────────────────────────────────────────────────────────────────────
let map = [], overlay = [], trains = [];
let currentPlayer = 0, year = 1850, showGrid = true;
let tool = 'rail';
let scores = [0, 0, 0, 0];
let hoveredCell = null;
let gameOver = false, winner = -1;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ── Era helper ────────────────────────────────────────────────────────────────
function getEra(y) {
  if (y < 1880) return 'Steam Age';
  if (y < 1920) return 'Golden Age of Rail';
  if (y < 1960) return 'Diesel Era';
  if (y < 1980) return 'Electric Age';
  return 'Modern Rail';
}

// ── Map Generation ────────────────────────────────────────────────────────────
function newMap() {
  map = []; overlay = []; trains = [];
  scores = [0, 0, 0, 0];
  year = 1850;
  gameOver = false;
  winner = -1;
  currentPlayer = 0;
  document.getElementById('year-val').textContent = year;

  for (let r = 0; r < ROWS; r++) {
    map[r] = [];
    overlay[r] = [];
    for (let c = 0; c < COLS; c++) {
      overlay[r][c] = null;
      const n = Math.random();
      const edgeFactor = Math.min(c, COLS-1-c, r, ROWS-1-r) / 5;
      if (edgeFactor < 0.5 && Math.random() < 0.35) {
        map[r][c] = TERRAIN.WATER;
      } else if (n < 0.28) map[r][c] = TERRAIN.FOREST;
      else if (n < 0.55) map[r][c] = TERRAIN.PLAINS;
      else if (n < 0.68) map[r][c] = TERRAIN.MOUNTAIN;
      else if (n < 0.80) map[r][c] = TERRAIN.DESERT;
      else map[r][c] = TERRAIN.PLAINS;
    }
  }

  // Smooth pass
  for (let pass = 0; pass < 2; pass++) {
    for (let r = 1; r < ROWS-1; r++) {
      for (let c = 1; c < COLS-1; c++) {
        if (map[r][c] === TERRAIN.WATER) continue;
        const neighbors = [map[r-1][c], map[r+1][c], map[r][c-1], map[r][c+1]];
        const counts = [0, 0, 0, 0, 0];
        neighbors.forEach(t => counts[t]++);
        const maxTerrain = counts.indexOf(Math.max(...counts));
        if (counts[maxTerrain] >= 3) map[r][c] = maxTerrain;
      }
    }
  }

  render();
  updatePlayerUI();
  setStatus('New map generated! Red Rail Co. starts. First to $5,000,000 wins!');
}

// ── Advance Year ──────────────────────────────────────────────────────────────
function advanceYear() {
  if (gameOver) return;
  const prevEra = getEra(year);
  year = Math.min(2000, year + 10);
  document.getElementById('year-val').textContent = year;
  const era = getEra(year);

  trains.forEach(tr => {
    scores[tr.player] += EARN_PER_TRAIN_PER_YEAR;
  });

  trains.forEach(tr => {
    tr.c = (tr.c + 1 + COLS) % COLS;
  });

  playSound('trainChug');

  if (era !== prevEra) {
    playSound('levelUp');
    setStatus(`Year ${year} — New Era: ${era}! Each train earned $${EARN_PER_TRAIN_PER_YEAR.toLocaleString()}`);
  } else {
    setStatus(`Year ${year} — ${era}. Each of your trains earned $${EARN_PER_TRAIN_PER_YEAR.toLocaleString()}`);
  }

  checkAllWin();
  updatePlayerUI();
  render();
}

// ── Win Check ─────────────────────────────────────────────────────────────────
function checkAllWin() {
  if (gameOver) return;
  for (let i = 0; i < 4; i++) {
    if (scores[i] >= WIN_AMOUNT) {
      gameOver = true;
      winner = i;
      playSound('levelUp');
      render();
      return;
    }
  }
}
