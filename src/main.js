const { getCurrentWindow } = window.__TAURI__.window;
const { invoke } = window.__TAURI__.core;

// 默认时间配置（秒）
const DEFAULT_TIMES = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

let phase = 'focus'; // focus | shortBreak | longBreak
let timeLeft = DEFAULT_TIMES.focus;
let isRunning = false;
let timerId = null;
let currentTimes = { ...DEFAULT_TIMES };

const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const phaseBtns = document.querySelectorAll('.phase-btn');

// 格式化时间显示
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 更新显示
function updateDisplay() {
  timeDisplay.textContent = formatTime(timeLeft);
  timeDisplay.dataset.phase = phase;
  document.title = `${formatTime(timeLeft)} - 番茄钟`;
}

// 切换阶段
function setPhase(newPhase) {
  phase = newPhase;
  timeLeft = currentTimes[newPhase];

  phaseBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.phase === newPhase);
  });

  // 更新样式
  timeDisplay.classList.remove('focus-mode', 'break-mode');
  if (phase === 'focus') {
    timeDisplay.classList.add('focus-mode');
  } else {
    timeDisplay.classList.add('break-mode');
  }

  updateDisplay();
}

// 开始/暂停
function toggleTimer() {
  isRunning = !isRunning;

  if (isRunning) {
    startBtn.textContent = '暂停';
    startBtn.classList.add('running');
    timeDisplay.classList.add('running');

    timerId = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        // 计时结束
        completeTimer();
      }
    }, 1000);
  } else {
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

  // 播放提示音
  invoke('play_alarm_sound').catch(() => {});

  alert(`${phase === 'focus' ? '专注完成！' : '休息结束！'}`);
}

// 双击进入全屏
function toggleFullscreen() {
  const win = getCurrentWindow();
  if (win.isFullscreen()) {
    win.setFullscreen(false);
  } else {
    win.setFullscreen(true);
  }
}

// 键盘快捷键
function handleKeyDown(e) {
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
    toggleTimer();
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 绑定事件
  startBtn.addEventListener('click', toggleTimer);
  resetBtn.addEventListener('click', resetTimer);

  phaseBtns.forEach(btn => {
    btn.addEventListener('click', () => setPhase(btn.dataset.phase));
  });

  document.addEventListener('dblclick', toggleFullscreen);
  document.addEventListener('keydown', handleKeyDown);

  // 设置背景色（专注时用橙色，休息时用绿色）
  document.documentElement.style.setProperty('--primary-color', '#f2a263');

  updateDisplay();
});
