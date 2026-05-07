// 默认时间配置（秒）
const DEFAULT_TIMES = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

// 状态
let phase = 'focus'; // focus | shortBreak | longBreak
let timeLeft = DEFAULT_TIMES.focus;
let isRunning = false;
let timerId = null;
let currentTimes = { ...DEFAULT_TIMES };
let isMuted = false;
let cycleCount = 0;

// DOM 元素
const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const phaseBtns = document.querySelectorAll('.phase-btn');
const cycleCountEl = document.getElementById('cycle-count');
const body = document.body;

// 创建音频上下文（用于生成提示音）
let audioContext = null;

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playBeep(frequency = 800, duration = 200) {
  if (isMuted || !audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}

function playAlarm() {
  initAudio();
  playBeep(800, 200);
  setTimeout(() => playBeep(1000, 200), 250);
  setTimeout(() => playBeep(1200, 400), 500);
}

// 格式化时间显示
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 更新显示
function updateDisplay() {
  timeDisplay.textContent = formatTime(timeLeft);

  // 更新时间轴（进度条效果）
  const totalTime = currentTimes[phase];
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  timeDisplay.style.background = `linear-gradient(90deg, var(--${phase === 'focus' ? 'focus' : 'break'}-color) ${progress}%, rgba(255,255,255,0.1) ${progress}%)`;

  document.title = `${formatTime(timeLeft)} - 番茄钟`;
  document.documentElement.style.setProperty('--primary-color', phase === 'focus' ? '#f2a263' : '#7ae7c7');
}

// 切换阶段
function setPhase(newPhase) {
  clearInterval(timerId);
  isRunning = false;
  startBtn.textContent = '开始';
  startBtn.classList.remove('running');
  timeDisplay.classList.remove('running');

  phase = newPhase;
  timeLeft = currentTimes[newPhase];

  phaseBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.phase === newPhase);
  });

  // 更新页面主题
  body.classList.remove('focus-mode', 'break-mode');
  if (phase === 'focus') {
    body.classList.add('focus-mode');
  } else {
    body.classList.add('break-mode');
  }

  updateDisplay();
}

// 开始/暂停
function toggleTimer() {
  if (!isRunning) {
    initAudio();
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }

    isRunning = true;
    startBtn.textContent = '暂停';
    startBtn.classList.add('running');
    timeDisplay.classList.add('running');

    timerId = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        completeTimer();
      }
    }, 1000);
  } else {
    isRunning = false;
    startBtn.textContent = '继续';
    startBtn.classList.remove('running');
    timeDisplay.classList.remove('running');
    clearInterval(timerId);
  }
}

// 重置
function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  startBtn.textContent = '开始';
  startBtn.classList.remove('running');
  timeDisplay.classList.remove('running');
  timeLeft = currentTimes[phase];
  updateDisplay();
}

// 完成计时
function completeTimer() {
  clearInterval(timerId);
  isRunning = false;
  startBtn.textContent = '开始';
  startBtn.classList.remove('running');
  timeDisplay.classList.remove('running');

  playAlarm();

  const phaseName = phase === 'focus' ? '专注完成！' : '休息结束！';
  alert(`${phaseName}\n${phase === 'focus' ? '休息一下吧！' : '准备开始新的专注！'}`);

  if (phase === 'focus') {
    cycleCount++;
    cycleCountEl.textContent = cycleCount;
  }
}

// 切换全屏
let isFullscreen = false;

function toggleFullscreen() {
  if (!isFullscreen) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => {
        isFullscreen = true;
        body.classList.add('fullscreen');
      }).catch(err => console.log('Fullscreen error:', err));
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        isFullscreen = false;
        body.classList.remove('fullscreen');
      });
    }
  }
}

// 键盘快捷键
function handleKeyDown(e) {
  switch (e.code) {
    case 'Space':
      e.preventDefault();
      toggleTimer();
      break;
    case 'KeyM':
      e.preventDefault();
      isMuted = !isMuted;
      console.log(isMuted ? '已静音' : '已取消静音');
      break;
    case 'Enter':
      e.preventDefault();
      toggleFullscreen();
      break;
  }
}

// 加载保存的数据
function loadState() {
  try {
    const saved = localStorage.getItem('pomodoroState');
    if (saved) {
      const state = JSON.parse(saved);
      cycleCount = state.cycleCount || 0;
      cycleCountEl.textContent = cycleCount;
    }
  } catch (e) {
    console.log('Failed to load state');
  }
}

// 保存状态
function saveState() {
  try {
    localStorage.setItem('pomodoroState', JSON.stringify({
      cycleCount
    }));
  } catch (e) {
    console.log('Failed to save state');
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  loadState();

  // 绑定事件
  startBtn.addEventListener('click', toggleTimer);
  resetBtn.addEventListener('click', resetTimer);

  phaseBtns.forEach(btn => {
    btn.addEventListener('click', () => setPhase(btn.dataset.phase));
  });

  timeDisplay.addEventListener('click', toggleFullscreen);
  document.addEventListener('keydown', handleKeyDown);

  // 周期性保存
  setInterval(saveState, 5000);

  updateDisplay();
});
