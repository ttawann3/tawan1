/* ---------- Snow Effect ---------- */
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'snow-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w, h, dpr, flakes = [];
  const FLAKE_COUNT_BASE = 120;
  let flakeCount = FLAKE_COUNT_BASE;

  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    flakeCount = Math.floor(FLAKE_COUNT_BASE * (w * h) / (1280 * 720));
    flakeCount = Math.min(400, Math.max(80, flakeCount));

    if (flakes.length < flakeCount) {
      for (let i = flakes.length; i < flakeCount; i++) {
        flakes.push(makeFlake(true));
      }
    } else if (flakes.length > flakeCount) {
      flakes.length = flakeCount;
    }
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makeFlake(spawnTop = false) {
    return {
      x: rand(0, w),
      y: spawnTop ? rand(-h, 0) : rand(0, h),
      r: rand(2.2, 8.8),
      sp: rand(1.2, 1.35),
      drift: rand(-0.6, 0.6),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.35, 0.85)
    };
  }

  function update() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.phase += 0.01;
      f.x += Math.sin(f.phase) * 0.5 + f.drift;
      f.y += f.sp;

      if (f.y - f.r > h) {
        flakes[i] = makeFlake(true);
        continue;
      }
      if (f.x < -10) f.x = w + 10;
      if (f.x > w + 10) f.x = -10;

      ctx.globalAlpha = f.alpha;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(update);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  update();
})();

/* ---------- Star Cursor Trail ---------- */
(function () {
  let lastSpawn = 0;
  const spawnInterval = 18;

  function spawnStar(x, y) {
    const e = document.createElement('div');
    e.className = 'trail-star';

    const size = 8 + Math.random() * 6;
    e.style.width = `${size}px`;
    e.style.height = `${size}px`;

    const rot = (Math.random() * 30 - 15).toFixed(1);
    e.style.transform += ` rotate(${rot}deg)`;

    e.style.left = `${x}px`;
    e.style.top = `${y}px`;

    document.body.appendChild(e);
    e.addEventListener('animationend', () => e.remove());
  }

  window.addEventListener('pointermove', (ev) => {
    const now = performance.now();
    if (now - lastSpawn >= spawnInterval) {
      lastSpawn = now;
      spawnStar(ev.clientX, ev.clientY);
    }
  }, { passive: true });

  window.addEventListener('pointerout', () => (lastSpawn = 0), { passive: true });
})();
