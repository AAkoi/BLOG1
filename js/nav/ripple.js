(function(){
  if (window.__NAV_RIPPLE_INIT__) return; window.__NAV_RIPPLE_INIT__ = true;
  const STYLE_ID = 'nav-ripple-style-external';
  const QUEUE = [];
  let nav;

  function injectStyle(){
    if (document.getElementById(STYLE_ID)) return;
    const css = `
#navList a.menu{ position:relative !important; overflow:hidden !important; z-index:3; }
#navList a.menu::after{
  content:""; position:absolute; left:var(--r-x,50%); top:var(--r-y,50%);
  width:0;height:0;border-radius:50%;
  transform:translate(-50%,-50%); pointer-events:none; opacity:0; z-index:3;
  background:radial-gradient(circle, rgba(255,255,255,.9) 0%, rgba(173,216,230,.35) 40%, rgba(255,255,255,0) 75%);
  box-shadow: 0 0 0 2px rgba(255,255,255,.35);
  will-change:width,height,opacity,transform;
}
#navList a.menu.ripple-active::after{ animation: nav-ripple 1400ms ease-out; }
@keyframes nav-ripple{
  0%{ width:0; height:0; opacity:1; box-shadow: 0 0 0 0 rgba(160,210,255,.45); transform:translate(-50%,-50%) scale(1); }
  30%{ width:220px; height:220px; opacity:.75; box-shadow: 0 0 0 6px rgba(160,210,255,.30); transform:translate(-50%,-50%) scale(1.05); }
  60%{ width:360px; height:360px; opacity:.40; box-shadow: 0 0 0 3px rgba(255,255,255,.22); transform:translate(-50%,-50%) scale(1.02); }
  100%{ width:520px; height:520px; opacity:0; box-shadow: 0 0 0 0 rgba(255,255,255,0); transform:translate(-50%,-50%) scale(1); }
}
#navList a.menu .nav-ripple{ position:absolute; left:0; top:0; width:0; height:0; border-radius:50%; transform:translate(-50%,-50%); pointer-events:none; opacity:.85; background:radial-gradient(circle, rgba(255,255,255,.85) 0%, rgba(173,216,230,.35) 40%, rgba(255,255,255,0) 75%); transition: width 1.2s ease-out, height 1.2s ease-out, opacity 1.2s ease-out; z-index:3; }
`;
    const style = document.createElement('style'); style.id = STYLE_ID; style.textContent = css; document.head.appendChild(style);
  }

  function sendWave(clientX, clientY, strength){
    if (window.NavOcean && typeof window.NavOcean.spawnWaveClient === 'function'){
      window.NavOcean.spawnWaveClient(clientX, clientY, strength);
      return true;
    }
    // 未就绪则排队
    QUEUE.push({ clientX, clientY, strength, ts: performance.now() });
    if (!window.__NAV_RIPPLE_TIMER__){
      window.__NAV_RIPPLE_TIMER__ = setInterval(() => {
        if (window.NavOcean && typeof window.NavOcean.spawnWaveClient === 'function'){
          clearInterval(window.__NAV_RIPPLE_TIMER__);
          window.__NAV_RIPPLE_TIMER__ = 0;
          while (QUEUE.length){
            const it = QUEUE.shift(); window.NavOcean.spawnWaveClient(it.clientX, it.clientY, it.strength);
          }
        }
      }, 200);
    }
    return false;
  }

  function bindAnchor(a){
    if (!a || a.dataset.rippleBound === '1') return;
    const cs = getComputedStyle(a);
    if (cs.position === 'static') a.style.position = 'relative';
    if (cs.overflow !== 'hidden') a.style.overflow = 'hidden';

    // 防重复触发：记录上次触发时间
    let lastTriggerTime = 0;
    const MIN_TRIGGER_INTERVAL = 800; // 最小触发间隔800ms

    a.addEventListener('mouseenter', () => { 
      const now = performance.now();
      if (a.classList.contains('ripple-active') || (now - lastTriggerTime) < MIN_TRIGGER_INTERVAL) return; 
      
      lastTriggerTime = now;
      a.classList.add('ripple-active'); 
      setTimeout(()=>a.classList.remove('ripple-active'), 1400);
      
      const rect = a.getBoundingClientRect();
      const cx = rect.width / 2; const cy = rect.height / 2;
      a.style.setProperty('--r-x', `${cx}px`); a.style.setProperty('--r-y', `${cy}px`);
      
      // 元素版兜底
      if (!a.__hoverRipple){
        const span = document.createElement('span'); span.className = 'nav-ripple';
        span.style.left = `${cx}px`; span.style.top = `${cy}px`; a.appendChild(span);
        requestAnimationFrame(()=>{ span.style.width = '520px'; span.style.height = '520px'; span.style.opacity = '0.15'; });
        setTimeout(()=>{ span.remove(); a.__hoverRipple = null; }, 1200);
        a.__hoverRipple = span;
      }
      
      // 传导海浪
      sendWave(rect.left + cx, rect.top + cy, 0.9);
    });

    const update = (e) => {
      const rect = a.getBoundingClientRect();
      const x = (e.clientX ?? rect.left + rect.width/2) - rect.left;
      const y = (e.clientY ?? rect.top + rect.height/2) - rect.top;
      a.style.setProperty('--r-x', `${x}px`); a.style.setProperty('--r-y', `${y}px`);
    };
    a.addEventListener('pointermove', update, { passive: true });
    a.addEventListener('mousemove', update, { passive: true });

    a.addEventListener('click', (e) => { 
      const now = performance.now();
      if (a.classList.contains('ripple-active') || (now - lastTriggerTime) < MIN_TRIGGER_INTERVAL) return; 
      
      lastTriggerTime = now;
      a.classList.add('ripple-active'); 
      setTimeout(()=>a.classList.remove('ripple-active'), 1400);
      
      const rect = a.getBoundingClientRect();
      const lx = e.clientX - rect.left; const ly = e.clientY - rect.top;
      const span = document.createElement('span'); span.className = 'nav-ripple';
      span.style.left = `${lx}px`; span.style.top = `${ly}px`; a.appendChild(span);
      requestAnimationFrame(()=>{ span.style.width = '520px'; span.style.height = '520px'; span.style.opacity = '0.15'; });
      setTimeout(()=> span.remove(), 1200);
      
      // 传导海浪
      sendWave(e.clientX, e.clientY, 1.2);
    });

    a.dataset.rippleBound = '1';
  }

  function ensure(){
    injectStyle();
    nav = document.getElementById('navList'); if (!nav) return false;
    nav.querySelectorAll('a.menu').forEach(bindAnchor);
    
    // 移除全局事件监听，确保只在按钮上触发
    // if (!nav.dataset.rippleDelegated){
    //   nav.addEventListener('pointerover', (e) => {
    //     const a = e.target && e.target.closest && e.target.closest('a.menu'); if (!a) return;
    //     const rect = a.getBoundingClientRect(); sendWave(rect.left + rect.width/2, rect.top + rect.height/2, .7);
    //   }, true);
    //   nav.dataset.rippleDelegated = '1';
    // }
    
    return true;
  }

  function boot(){ if (ensure()) return; const mo = new MutationObserver(() => { if (ensure()) mo.disconnect(); }); mo.observe(document.documentElement, { childList: true, subtree: true }); }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot, { once:true }); } else { boot(); }
})(); 