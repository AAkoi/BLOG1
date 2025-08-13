(function () {
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const isEdge = /Edg\//.test(navigator.userAgent);
  document.body.classList.toggle('ua-edge', false);
  if (prefersReduce || !finePointer) return;

  const root = document.documentElement;
  const themeColor = getComputedStyle(root).getPropertyValue('--theme-color').trim() || '#166ff3';

  const maxNodes = 40;
  const nodes = [];

  function spawnDot(x, y) {
    const el = document.createElement('div');
    const size = 6 + Math.random() * 4;
    el.style.cssText = [
      'position:fixed',
      `left:${x}px`,
      `top:${y}px`,
      `width:${size}px`,
      `height:${size}px`,
      'border-radius:50%','pointer-events:none',
      'z-index:9999','opacity:0',
      'transform:translate(-50%,-50%) scale(1)',
      'transition:transform .45s ease, opacity .45s ease',
      `background:${themeColor}`
    ].join(';');
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.opacity = '0.45';
      el.style.transform = 'translate(-50%,-50%) scale(1)';
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translate(-50%,-50%) scale(0.65)';
      }, 16);
    });
    const t = setTimeout(() => el.remove(), 520);
    nodes.push({ el, t });
    while (nodes.length > maxNodes) {
      const n = nodes.shift();
      clearTimeout(n.t);
      n.el.remove();
    }
  }

  function spawnRing(x, y) {
    const el = document.createElement('div');
    const base = 26;
    el.style.cssText = [
      'position:fixed',
      `left:${x}px`,
      `top:${y}px`,
      `width:${base}px`,`height:${base}px`,
      'border-radius:50%','pointer-events:none',
      'z-index:9999','opacity:.35',
      'transform:translate(-50%,-50%) scale(.25)',
      'transition:transform .45s ease, opacity .45s ease',
      `border:2px solid ${themeColor}`,
      'box-sizing:border-box'
    ].join(';');
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%,-50%) scale(1.6)';
    });
    setTimeout(() => el.remove(), 520);
  }

  let last = 0;
  document.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - last < 12) return;
    last = now;
    spawnDot(e.clientX, e.clientY);
  }, { passive: true });

  document.addEventListener('click', (e) => {
    spawnRing(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('pagehide', () => {
    nodes.forEach(n => { clearTimeout(n.t); n.el.remove(); });
  });
})(); 