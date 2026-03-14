// ── Rendering ─────────────────────────────────────────────────────────────────
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameOver && winner >= 0) {
    // Draw map dimly first
    drawTerrain(0.35);
    drawVictoryScreen();
    return;
  }

  drawTerrain(1.0);

  // Grid
  if (showGrid) {
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 0.5;
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath(); ctx.moveTo(0, r*TILE); ctx.lineTo(COLS*TILE, r*TILE); ctx.stroke();
    }
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath(); ctx.moveTo(c*TILE, 0); ctx.lineTo(c*TILE, ROWS*TILE); ctx.stroke();
    }
  }

  // Overlay (rails, stations)
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const ov = overlay[r][c];
      if (!ov) continue;
      const x = c*TILE, y = r*TILE;
      if (ov.type === 'rail') {
        drawRail(x, y, ov.player);
      } else if (ov.type === 'station') {
        drawStation(x, y, ov.player);
      }
    }
  }

  // Trains
  trains.forEach(tr => drawTrain(tr));

  // Score HUD
  drawHUD();
}

function drawTerrain(alpha) {
  ctx.globalAlpha = alpha;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const t = map[r][c];
      const isHov = hoveredCell && hoveredCell.r === r && hoveredCell.c === c;
      ctx.fillStyle = isHov ? TERRAIN_DARK[t] : TERRAIN_COLORS[t];
      ctx.fillRect(c*TILE, r*TILE, TILE, TILE);
    }
  }
  ctx.globalAlpha = 1.0;
}

function drawRail(x, y, p) {
  ctx.fillStyle = '#606060';
  ctx.fillRect(x+1, y+7, TILE-2, 2);
  ctx.fillStyle = PLAYER_COLORS[p];
  ctx.fillRect(x+2, y+6, 3, 4);
  ctx.fillRect(x+TILE-5, y+6, 3, 4);
  ctx.fillRect(x+6, y+6, 3, 4);
  ctx.fillRect(x+TILE-9, y+6, 3, 4);
}

function drawStation(x, y, p) {
  ctx.fillStyle = '#a06020';
  ctx.fillRect(x+2, y+4, TILE-4, TILE-6);
  ctx.fillStyle = PLAYER_COLORS[p];
  ctx.fillRect(x+2, y+4, TILE-4, 3);
  ctx.fillStyle = '#404040';
  ctx.fillRect(x+TILE-6, y+1, 3, 5);
}

function drawTrain(tr) {
  const x = tr.c*TILE, y = tr.r*TILE;
  ctx.fillStyle = PLAYER_COLORS[tr.player];
  ctx.fillRect(x+1, y+5, TILE-2, 6);
  ctx.fillStyle = '#202020';
  ctx.fillRect(x+TILE-6, y+4, 5, 7);
  ctx.fillStyle = '#101010';
  ctx.fillRect(x+2, y+10, 4, 3);
  ctx.fillRect(x+TILE-6, y+10, 4, 3);
  ctx.fillStyle = '#404040';
  ctx.fillRect(x+2, y+2, 2, 4);
  if ((Date.now()/400 | 0) % 2 === 0) {
    ctx.fillStyle = 'rgba(220,220,220,0.6)';
    ctx.fillRect(x+1, y, 4, 3);
  }
}

function drawHUD() {
  const hw = 210, hh = 88;
  const hx = canvas.width - hw - 4, hy = 4;
  ctx.fillStyle = 'rgba(10,10,26,0.88)';
  ctx.fillRect(hx, hy, hw, hh);
  ctx.strokeStyle = '#c8a020';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(hx, hy, hw, hh);
  ctx.font = 'bold 10px Courier New';
  ctx.fillStyle = '#f0c840';
  ctx.fillText('SCORES — WIN: $5,000,000', hx+6, hy+13);
  for (let i = 0; i < 4; i++) {
    const isActive = i === currentPlayer;
    ctx.fillStyle = isActive ? PLAYER_COLORS[i] : 'rgba(200,200,180,0.55)';
    ctx.fillRect(hx+6, hy+18+i*15, 8, 8);
    ctx.fillStyle = isActive ? '#fff' : '#a09870';
    ctx.font = (isActive ? 'bold ' : '') + '9px Courier New';
    const label = PLAYER_NAMES[i].substring(0, 12) + ': $' + scores[i].toLocaleString();
    ctx.fillText(label, hx+18, hy+26+i*15);
    // Progress bar
    const barW = hw - 26;
    const fill = Math.min(scores[i] / WIN_AMOUNT, 1) * barW;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(hx+18, hy+28+i*15, barW, 3);
    ctx.fillStyle = PLAYER_COLORS[i];
    ctx.globalAlpha = isActive ? 1.0 : 0.5;
    ctx.fillRect(hx+18, hy+28+i*15, fill, 3);
    ctx.globalAlpha = 1.0;
  }
}

// ── Victory Screen ────────────────────────────────────────────────────────────
function drawVictoryScreen() {
  const pw = 480, ph = 300;
  const px = (canvas.width - pw) / 2;
  const py = (canvas.height - ph) / 2;

  // Panel background
  ctx.fillStyle = '#0d0920';
  ctx.fillRect(px, py, pw, ph);

  // Animated border (alternating gold/player color)
  const pulse = (Date.now() / 600 | 0) % 2 === 0;
  ctx.strokeStyle = pulse ? PLAYER_COLORS[winner] : '#f0c840';
  ctx.lineWidth = 4;
  ctx.strokeRect(px, py, pw, ph);

  // Inner border
  ctx.strokeStyle = '#3a2860';
  ctx.lineWidth = 1;
  ctx.strokeRect(px+6, py+6, pw-12, ph-12);

  ctx.textAlign = 'center';

  // Trophy pixel art (simple)
  const tx = canvas.width / 2;
  ctx.fillStyle = '#f0c840';
  ctx.fillRect(tx-12, py+20, 24, 18);
  ctx.fillRect(tx-6, py+38, 12, 6);
  ctx.fillRect(tx-14, py+44, 28, 6);
  ctx.fillStyle = '#c8a020';
  ctx.fillRect(tx-8, py+22, 4, 14);
  ctx.fillRect(tx+4, py+22, 4, 14);

  // Victory title
  ctx.fillStyle = '#f0c840';
  ctx.font = 'bold 24px Courier New';
  ctx.fillText('★  VICTORY!  ★', canvas.width / 2, py + 80);

  // Winner name
  ctx.fillStyle = PLAYER_COLORS[winner];
  ctx.font = 'bold 18px Courier New';
  ctx.fillText(PLAYER_NAMES[winner], canvas.width / 2, py + 106);

  ctx.fillStyle = '#e0d8b0';
  ctx.font = '13px Courier New';
  ctx.fillText('reached $5,000,000 first!', canvas.width / 2, py + 126);

  // Divider
  ctx.strokeStyle = '#3a2860';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(px + 20, py + 138); ctx.lineTo(px + pw - 20, py + 138);
  ctx.stroke();

  // Final scores
  ctx.fillStyle = '#f0c840';
  ctx.font = 'bold 11px Courier New';
  ctx.fillText('FINAL SCORES', canvas.width / 2, py + 155);

  const order = [0,1,2,3].sort((a, b) => scores[b] - scores[a]);
  const ranks = ['1st', '2nd', '3rd', '4th'];
  order.forEach((pi, rank) => {
    const y = py + 172 + rank * 22;
    ctx.fillStyle = pi === winner ? PLAYER_COLORS[pi] : '#706850';
    ctx.font = (pi === winner ? 'bold ' : '') + '11px Courier New';
    ctx.fillText(
      `${ranks[rank]}  ${PLAYER_NAMES[pi]}: $${scores[pi].toLocaleString()}`,
      canvas.width / 2, y
    );
  });

  // Play again prompt
  const blinkOn = (Date.now() / 700 | 0) % 2 === 0;
  if (blinkOn) {
    ctx.fillStyle = '#80f080';
    ctx.font = '12px Courier New';
    ctx.fillText('[ Click NEW MAP to play again ]', canvas.width / 2, py + ph - 18);
  }

  ctx.textAlign = 'left';
}
