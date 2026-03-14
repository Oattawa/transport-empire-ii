// ── Web Audio API Sound Effects ───────────────────────────────────────────────
let audioCtx = null;
let soundEnabled = true;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const ac = getAudioCtx();
    if (ac.state === 'suspended') ac.resume();
    switch (type) {
      case 'trainChug':    playTrainChug(ac);    break;
      case 'cashRegister': playCashRegister(ac); break;
      case 'construction': playConstruction(ac); break;
      case 'levelUp':      playLevelUp(ac);      break;
    }
  } catch (e) {
    // Audio not supported or blocked — silently ignore
  }
}

// Two quick "chug-chug" pulses
function playTrainChug(ac) {
  for (let i = 0; i < 2; i++) {
    const osc  = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = 'sawtooth';
    const t = ac.currentTime + i * 0.18;
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.start(t);
    osc.stop(t + 0.15);
  }
}

// Ascending C-E-G-C arpeggio (cash register)
function playCashRegister(ac) {
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    const osc  = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = 'square';
    osc.frequency.value = freq;
    const t = ac.currentTime + i * 0.075;
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
    osc.start(t);
    osc.stop(t + 0.15);
  });
}

// Short percussive noise burst (hammer hit)
function playConstruction(ac) {
  const bufSize = Math.floor(ac.sampleRate * 0.08);
  const buffer  = ac.createBuffer(1, bufSize, ac.sampleRate);
  const data    = buffer.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2);
  }
  const source = ac.createBufferSource();
  const filter = ac.createBiquadFilter();
  const gain   = ac.createGain();
  filter.type = 'bandpass';
  filter.frequency.value = 350;
  filter.Q.value = 0.8;
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ac.destination);
  gain.gain.setValueAtTime(0.5, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);
  source.start();
}

// Six-note ascending fanfare (era unlock / victory)
function playLevelUp(ac) {
  const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]; // C4 E4 G4 C5 E5 G5
  notes.forEach((freq, i) => {
    const osc  = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const t = ac.currentTime + i * 0.1;
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.start(t);
    osc.stop(t + 0.22);
  });
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('btn-sound');
  btn.textContent = soundEnabled ? '\uD83D\uDD0A Sound ON' : '\uD83D\uDD07 Sound OFF';
  btn.classList.toggle('active', soundEnabled);
}
