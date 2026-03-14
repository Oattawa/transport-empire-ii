// ── Cell helper ───────────────────────────────────────────────────────────────
function cellAt(evt) {
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const sy = canvas.height / rect.height;
  const mx = (evt.clientX - rect.left) * sx;
  const my = (evt.clientY - rect.top)  * sy;
  return { c: Math.floor(mx / TILE), r: Math.floor(my / TILE) };
}

// ── Canvas Events ─────────────────────────────────────────────────────────────
canvas.addEventListener('mousemove', evt => {
  const { c, r } = cellAt(evt);
  if (c >= 0 && c < COLS && r >= 0 && r < ROWS) {
    hoveredCell = { c, r };
    const terrainNames = ['Plains','Forest','Mountain','Water','Desert'];
    const t  = map[r][c];
    const ov = overlay[r][c];
    if (!gameOver) {
      setStatus(
        `[${c},${r}] ${terrainNames[t]}` +
        (ov ? ` · ${ov.type} (P${ov.player+1})` : '') +
        ` — Tool: ${tool} — ${PLAYER_NAMES[currentPlayer]}`
      );
    }
  } else {
    hoveredCell = null;
  }
  render();
});

canvas.addEventListener('mouseleave', () => { hoveredCell = null; render(); });

canvas.addEventListener('click', evt => {
  if (gameOver) return;
  const { c, r } = cellAt(evt);
  if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return;

  if (tool === 'erase') {
    overlay[r][c] = null;
    trains = trains.filter(t => !(t.r === r && t.c === c));
    setStatus(`Erased cell [${c},${r}].`);
    render();
    return;
  }

  if (map[r][c] === TERRAIN.WATER) {
    setStatus('Cannot build on water!');
    return;
  }

  if (tool === 'rail') {
    overlay[r][c] = { type: 'rail', player: currentPlayer };
    scores[currentPlayer] += EARN_RAIL;
    playSound('construction');
    setStatus(`Rail laid at [${c},${r}] for ${PLAYER_NAMES[currentPlayer]}. +$${EARN_RAIL.toLocaleString()}`);
  } else if (tool === 'station') {
    overlay[r][c] = { type: 'station', player: currentPlayer };
    scores[currentPlayer] += EARN_STATION;
    playSound('construction');
    setStatus(`Station built at [${c},${r}] for ${PLAYER_NAMES[currentPlayer]}. +$${EARN_STATION.toLocaleString()}`);
  } else if (tool === 'train') {
    if (overlay[r][c] && overlay[r][c].type === 'rail') {
      trains.push({ r, c, player: currentPlayer });
      scores[currentPlayer] += EARN_TRAIN;
      playSound('cashRegister');
      setStatus(`Train placed at [${c},${r}] for ${PLAYER_NAMES[currentPlayer]}. +$${EARN_TRAIN.toLocaleString()}`);
    } else {
      setStatus('Trains can only be placed on rail tracks!');
      return;
    }
  }

  checkAllWin();
  updatePlayerUI();
  render();
});

// ── Controls ──────────────────────────────────────────────────────────────────
function setTool(t) {
  tool = t;
  ['rail','station','train','erase'].forEach(id => {
    document.getElementById('btn-' + id).classList.toggle('active', id === t);
  });
  setStatus('Tool: ' + t);
}

function nextPlayer() {
  if (gameOver) return;
  currentPlayer = (currentPlayer + 1) % 4;
  updatePlayerUI();
  setStatus(`Now playing: ${PLAYER_NAMES[currentPlayer]}`);
  render();
}

function toggleGrid() {
  showGrid = !showGrid;
  render();
}

function updatePlayerUI() {
  for (let i = 0; i < 4; i++) {
    const el = document.getElementById('p' + (i+1) + 'tag');
    el.style.opacity     = i === currentPlayer ? '1' : '0.45';
    el.style.fontWeight  = i === currentPlayer ? 'bold' : 'normal';
  }
}

function setStatus(msg) {
  document.getElementById('status').textContent = msg;
}

// ── Notification Toast ────────────────────────────────────────────────────────
function showNotification(msg) {
  const notif = document.getElementById('notification');
  notif.textContent = msg;
  notif.classList.add('show');
  clearTimeout(notif._timer);
  notif._timer = setTimeout(() => notif.classList.remove('show'), 2200);
}

// ── Save / Load ───────────────────────────────────────────────────────────────
function saveGame() {
  const state = {
    map, overlay, trains, scores,
    currentPlayer, year, showGrid, tool,
    gameOver, winner
  };
  try {
    localStorage.setItem('ironRailsSave', JSON.stringify(state));
    showNotification('Game Saved!');
    playSound('cashRegister');
  } catch (e) {
    setStatus('Save failed (storage may be full).');
  }
}

function loadGame() {
  const raw = localStorage.getItem('ironRailsSave');
  if (!raw) {
    setStatus('No saved game found.');
    return;
  }
  try {
    const s = JSON.parse(raw);
    map           = s.map;
    overlay       = s.overlay;
    trains        = s.trains;
    scores        = s.scores;
    currentPlayer = s.currentPlayer;
    year          = s.year;
    showGrid      = s.showGrid;
    gameOver      = s.gameOver;
    winner        = s.winner;
    document.getElementById('year-val').textContent = year;
    setTool(s.tool || 'rail');
    updatePlayerUI();
    render();
    showNotification('Game Loaded!');
  } catch (e) {
    setStatus('Load failed — save data may be corrupted.');
  }
}

// Auto-save every 60 seconds
setInterval(() => {
  if (map.length > 0) {
    try {
      const state = { map, overlay, trains, scores, currentPlayer, year, showGrid, tool, gameOver, winner };
      localStorage.setItem('ironRailsSave', JSON.stringify(state));
    } catch (e) {}
  }
}, 60000);

// ── Train Animation Loop ──────────────────────────────────────────────────────
setInterval(() => {
  if (trains.length > 0 || gameOver) render();
}, 400);

// ── Init ──────────────────────────────────────────────────────────────────────
newMap();
updatePlayerUI();
