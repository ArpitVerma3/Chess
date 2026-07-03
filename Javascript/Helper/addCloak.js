const times = {
  Bullet: { time: 60 },
  Blitz: { time: 60 * 3 },
  Rapid: { time: 60 * 10 },
};

class ChessClock {
  constructor(mode = 'Blitz') {
    const control = times[mode] || times.Blitz;
    this.times = { w: control.time, b: control.time };
    this.increment = 0;
    this.active = null;
    this.interval = null;
    this.onTimeout = null;
  }

  start(color) {
    if (!['w', 'b'].includes(color)) color = 'w';
    this.active = color;
    this.stop();

    this.interval = setInterval(() => {
      this.times[this.active]--;

      if (this.times[this.active] <= 0) {
        this.times[this.active] = 0;
        this.stop();
        if (this.onTimeout) this.onTimeout(this.active);
        this.updateDisplay();
        return;
      }

      this.updateDisplay();
    }, 1000);

    this.updateDisplay();
  }

  switch() {
    this.times[this.active] += this.increment;
    this.stop();
    this.start(this.active === 'w' ? 'b' : 'w');
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  reset(mode) {
    this.stop();
    const control = times[mode] || times.Blitz;
    this.increment = 0;
    this.times = { w: control.time, b: control.time };
    this.active = null;
    this.updateDisplay();
  }

  format(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  updateDisplay() {
    const whiteClock = document.getElementById('clock1');
    const blackClock = document.getElementById('clock2');

    if (whiteClock) {
      whiteClock.textContent = this.format(this.times.w);
      whiteClock.style.color = this.times.w < 10 ? 'red' : '';
    }

    if (blackClock) {
      blackClock.textContent = this.format(this.times.b);
      blackClock.style.color = this.times.b < 10 ? 'red' : '';
    }
  }
}

const clock = new ChessClock('Blitz');
clock.onTimeout = (loser) => {
  const winner = loser === 'w' ? 'Black' : 'White';
  alert(`${winner} wins on time!`);
};

const modeSelect = document.getElementById('gameMode');
if (modeSelect) {
  modeSelect.addEventListener('change', (e) => {
    clock.reset(e.target.value);
  });
}

clock.start('w');