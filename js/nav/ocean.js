(function(){
  if (window.__NAV_OCEAN_INIT__) return; window.__NAV_OCEAN_INIT__ = true;
  const STYLE_ID = 'nav-ocean-style-external';
  const CANVAS_CLASS = 'ocean-canvas';
  const READY_FLAG = '__nav_ocean_ready__';

  const cfg = {
    maxFishes: 4,
    waveLifeMs: 1800,
    waveSpeedPxPerMs: 0.18,
    baseRadius: 46,
    fishSpeedScale: 6,
    gradientTop: 'rgba(210,233,248,0.95)',
    gradientBottom: 'rgba(210, 240, 255, 0.92)',
    waveLineColor: 'rgba(255,255,255,',
    waveLineWidth: 3
  };

  function injectStyle(){
    if (document.getElementById(STYLE_ID)) return;
    const css = `
#navList { position: relative !important; overflow: hidden !important; border-radius: 14px; background: transparent !important; isolation: isolate; }
#navList::before { content:""; position:absolute; inset:0; background: linear-gradient(180deg, ${cfg.gradientTop}, ${cfg.gradientBottom}); z-index: 0; pointer-events: none; filter: blur(2px) saturate(1.05); opacity: 1 !important; }
#navList .${CANVAS_CLASS} { position:absolute; left:0; top:0; width:100%; height:100%; z-index: 1; pointer-events: none; filter: saturate(1.05) contrast(1.02); mix-blend-mode: normal; opacity: .9; }
#navList > *:not(.${CANVAS_CLASS}) { position: relative; z-index: 3; }
`;
    const style = document.createElement('style'); style.id = STYLE_ID; style.textContent = css; document.head.appendChild(style);
  }

  function onceReady(cb){ if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', cb, { once: true }); } else cb(); }

  function init(){
    injectStyle();
    const host = document.getElementById('navList'); if (!host) return false;

    const canvas = document.createElement('canvas'); canvas.className = CANVAS_CLASS; host.insertBefore(canvas, host.firstChild);
    const ctx = canvas.getContext('2d', { alpha: true });

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    function fit(){ const r = host.getBoundingClientRect(); const w = Math.max(200, Math.floor(r.width)); const h = Math.max(56, Math.floor(r.height)); canvas.width = Math.floor(w * DPR); canvas.height = Math.floor(h * DPR); canvas.style.width = w + 'px'; canvas.style.height = h + 'px'; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
    fit(); new ResizeObserver(fit).observe(host);

    const fishes = []; const waves = []; let waveSeq = 0;
    function rand(a,b){ return a + Math.random()*(b-a); }

    function spawnFish(){ 
      const r = host.getBoundingClientRect(); 
      const size = rand(10, 18); 
      const y = rand(size*1.8, Math.max(size*1.8, r.height - size*1.8)); 
      const dir = Math.random() < .5 ? -1 : 1; 
      // 去掉白色鱼，只保留彩色鱼
      const colors = ['#0b63b6','#0a84ff','#ff7b00','#ffd166','#08c2ff'];
      fishes.push({ 
        x: dir<0 ? r.width + rand(0, 60) : -rand(0, 60), 
        y, 
        vx: dir * rand(0.6, 1.2), 
        vy: rand(-0.15, 0.15), 
        size, 
        color: colors[Math.floor(Math.random()*colors.length)] 
      }); 
    }
    for (let i=0;i<cfg.maxFishes;i++) setTimeout(spawnFish, i*180);

    function drawFish(f){ 
      const s = f.size; 
      // shadow under fish (lift effect)
      const ctx = canvas.getContext('2d', { alpha: true });
      ctx.save(); 
      ctx.translate(f.x, f.y);
      const lift = (f.lift||0);
      ctx.save(); 
      ctx.globalAlpha = 0.18 * lift; 
      ctx.scale(1, 0.6);
      ctx.beginPath(); 
      ctx.arc(0, s*1.4, s*0.8*(1+lift*0.2), 0, Math.PI*2); 
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; 
      ctx.fill(); 
      ctx.restore();
      // apply lift: slight upward translation and scale
      ctx.translate(0, -lift * 4);
      const ang = Math.atan2(f.vy, f.vx); 
      ctx.rotate(ang);
      ctx.scale(1 + lift*0.06, 1 + lift*0.06);
      ctx.fillStyle = f.color; 
      ctx.beginPath(); 
      ctx.ellipse(0, 0, s, s*0.55, 0, 0, Math.PI*2); 
      ctx.fill();
      ctx.beginPath(); 
      ctx.moveTo(-s, 0); 
      ctx.lineTo(-s- s*0.9, s*0.45); 
      ctx.lineTo(-s- s*0.7, 0); 
      ctx.lineTo(-s- s*0.9, -s*0.45); 
      ctx.closePath(); 
      ctx.fill();
      // 眼睛 - 使用深色而不是白色
      ctx.fillStyle = '#2a4a6b'; 
      ctx.beginPath(); 
      ctx.arc(s*0.45, -s*0.1, s*0.12, 0, Math.PI*2); 
      ctx.fill(); 
      ctx.fillStyle = '#0008'; 
      ctx.beginPath(); 
      ctx.arc(s*0.5, -s*0.1, s*0.06, 0, Math.PI*2); 
      ctx.fill(); 
      ctx.restore(); 
    }

    function spawnWaveLocal(x, y, strength=1){ const id = ++waveSeq; waves.push({ id, x, y, t0: performance.now(), life: cfg.waveLifeMs, strength, deform: (0.8 + Math.random()*0.4) }); if (waves.length > 18) waves.shift(); }
    function spawnWaveClient(clientX, clientY, strength=1){ const r = host.getBoundingClientRect(); spawnWaveLocal(clientX - r.left, clientY - r.top, strength); }

    window.NavOcean = { spawnWaveLocal, spawnWaveClient, isReady: () => true }; window[READY_FLAG] = true;

    function step(dtMs){ 
      const r = host.getBoundingClientRect(); 
      const W = r.width, H = r.height; 
      const dt = Math.min(dtMs, 32) / 16.6667; 
      for (const f of fishes){ 
        const now = performance.now(); 
        // 找到最新的一道波（只受一次影响）
        let w = null; 
        for (let i = waves.length - 1; i >= 0; i--) { 
          const candidate = waves[i]; 
          const age = now - candidate.t0; 
          if (age <= candidate.life) { 
            w = candidate; 
            break; 
          } 
        }
        if (w && f._lastWaveId !== w.id) { 
          const age = now - w.t0; 
          const radius = cfg.baseRadius + age * cfg.waveSpeedPxPerMs * (1 + (w.deform||1)*0.08*Math.sin(age/120)); 
          const dx = f.x - w.x, dy = f.y - w.y; 
          const d = Math.hypot(dx, dy); 
          if (d < radius + f.size*2){ 
            f._lastWaveId = w.id; 
            const edge = Math.max(0, 1 - d / (radius + 1)); 
            const push = (w.strength || 1) * edge * 0.6; // 更柔和
            
            // 给鱼一个"抬升"量，随后逐帧衰减
            f.lift = Math.min(1, (f.lift||0) + 0.35 * edge);
            setTimeout(()=>{ f.lift = Math.max(0, (f.lift||0) - 0.35*edge); }, 400);

            // 径向阻尼：计算"目标速度"并进行二阶平滑，进一步消除抖动
            const radial = (dx / (d||1)) * f.vx + (dy / (d||1)) * f.vy;
            const slowK = 0.7 - Math.min(0.2, Math.max(0, radial) * 0.08); // 更强的阻尼感
            const targetVx = f.vx * slowK; 
            const targetVy = f.vy * slowK;
            f.vx += (targetVx - f.vx) * 0.18; 
            f.vy += (targetVy - f.vy) * 0.18; // 一阶
            f.vx = f.vx*0.90 + targetVx*0.10; 
            f.vy = f.vy*0.90 + targetVy*0.10;  // 二阶
            
            // 极少鱼改变方向（0.5%），且推力更小
            if (Math.random() < 0.005 && d > 1){ 
              f.vx += (dx / d) * push * dt * 0.4; 
              f.vy += (dy / d) * push * dt * 0.4; 
            } 
            const tang = 0.02 * (Math.random() - 0.5) * edge; // 切向微扰更小
            f.vx += -dy * 0.00018 * tang; 
            f.vy += dx * 0.00018 * tang;
            
            const sp = Math.hypot(f.vx, f.vy), maxSp = 1.6; 
            if (sp > maxSp){ 
              f.vx = f.vx / sp * maxSp; 
              f.vy = f.vy / sp * maxSp; 
            } 
          } 
        } 
        f.vy += rand(-0.015, 0.015) * dt; 
        if (Math.random() < 0.015) f.vx += rand(-0.04, 0.04); 
        f.x += f.vx * cfg.fishSpeedScale * dt; 
        f.y += f.vy * cfg.fishSpeedScale * dt; 
        if (f.x < -40 || f.x > W + 40 || f.y < -30 || f.y > H + 30){ 
          const i = fishes.indexOf(f); 
          if (i >= 0) fishes.splice(i, 1); 
          spawnFish(); 
        } 
        const cx = W/2, cy = H/2; 
        f.vx += (cx - f.x) * 0.00003 * dt; 
        f.vy += (cy - f.y) * 0.00003 * dt; 
      } 
    }

    function draw(){ 
      const r = host.getBoundingClientRect(); 
      const ctx = canvas.getContext('2d', { alpha: true });
      ctx.clearRect(0, 0, r.width, r.height); 
      const g = ctx.createLinearGradient(0, 0, 0, r.height); 
      g.addColorStop(0, 'rgba(255,255,255,0.20)'); 
      g.addColorStop(1, 'rgba(255,255,255,0.05)'); 
      ctx.fillStyle = g; 
      ctx.fillRect(0, 0, r.width, r.height); 
      const now = performance.now(); 
      for (const w of waves){ 
        const age = now - w.t0; 
        if (age > w.life) continue; 
        const t = age / w.life; 
        const radius = cfg.baseRadius + age * cfg.waveSpeedPxPerMs * (1 + (w.deform||1)*0.10*Math.sin(age/160)); 
        const alpha = Math.max(0, 1 - t) * 0.60; 
        ctx.beginPath(); 
        // 多样性：叠加轻微噪声扰动
        const k = 1 + (w.deform||1)*0.10*Math.sin(age/180);
        const rot = (w.deform||1)*0.15*Math.sin(age/220);
        ctx.save(); 
        ctx.translate(w.x, w.y); 
        ctx.rotate(rot);
        ctx.ellipse(0, 0, radius*k, radius*(2-k), 0, 0, Math.PI*2);
        ctx.restore(); 
        ctx.strokeStyle = `rgba(200,225,255,${alpha})`; 
        ctx.lineWidth = cfg.waveLineWidth; 
        ctx.stroke();
        // 叠加一层细白高光，增强浅蓝+白的质感
        ctx.beginPath(); 
        ctx.ellipse(w.x, w.y, radius*(k*0.98), radius*((2-k)*0.98), 0, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(255,255,255,${alpha*0.35})`; 
        ctx.lineWidth = 1; 
        ctx.stroke(); 
      } 
      for (const f of fishes) drawFish(f); 
    }

    let last = performance.now();
    function loop(){ const now = performance.now(); step(now - last); last = now; draw(); requestAnimationFrame(loop); }
    loop();

    // 移除全局事件监听，只在按钮上触发
    // host.addEventListener('pointerover', e => spawnWaveClient(e.clientX, e.clientY, 0.55), { passive: true });
    // host.addEventListener('pointermove', e => spawnWaveClient(e.clientX, e.clientY, 0.20), { passive: true });
    // host.addEventListener('pointerdown', e => spawnWaveClient(e.clientX, e.clientY, 0.90), { passive: true });

    return true;
  }

  function boot(){ if (init()) return; const mo = new MutationObserver(() => { if (init()) mo.disconnect(); }); mo.observe(document.documentElement, { childList: true, subtree: true }); }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot, { once: true }); } else { boot(); }
})(); 