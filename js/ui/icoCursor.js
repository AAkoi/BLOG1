(function(){
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  // 不阻断：即便是 coarse，也不强制 return，避免误判导致系统指针被其他样式影响时无恢复手段
  const root = document.documentElement;
  const hotspotX = parseInt((getComputedStyle(root).getPropertyValue('--ico-cursor-hotspot-x')||'2').replace('px',''),10) || 0;
  const hotspotY = parseInt((getComputedStyle(root).getPropertyValue('--ico-cursor-hotspot-y')||'2').replace('px',''),10) || 0;

  const cursorEl = document.createElement('div');
  cursorEl.className = 'custom-ico-cursor is-hidden';
  document.body.appendChild(cursorEl);

  let raf = 0; let lastX = 0; let lastY = 0; let visible = false; let activated = false;
  const FORCE_EVERYWHERE = true;

  function setUse(enabled){
    document.documentElement.classList.toggle('use-ico-cursor', enabled);
    document.body.classList.toggle('use-ico-cursor', enabled);
    cursorEl.classList.toggle('is-hidden', !enabled);
  }

  function needsNativePointer(target){
    return !!(target && (
      target.closest('input, textarea, select, pre, code, [contenteditable="true"], .CodeMirror, .monaco-editor')
    ));
  }

  function onMove(e){
    // 首次激活：此时才隐藏系统指针并显示自定义指针，避免加载瞬间出现“无指针”
    if (!activated) {
      activated = true;
      if (FORCE_EVERYWHERE) { setUse(true); } else { setUse(!needsNativePointer(e.target)); }
    }
    lastX = e.clientX - hotspotX;
    lastY = e.clientY - hotspotY;
    if (!visible){ visible = true; cursorEl.classList.remove('is-hidden'); }
    if (!raf){ raf = requestAnimationFrame(() => { raf = 0; cursorEl.style.transform = `translate3d(${lastX}px, ${lastY}px, 0)`; }); }
    const target = e.target;
    if (!FORCE_EVERYWHERE) { setUse(!needsNativePointer(target)); }
  }

  function onLeave(){ cursorEl.classList.add('is-hidden'); visible = false; if (activated) setUse(false); }
  function onEnter(){ if (activated) { visible = true; cursorEl.classList.remove('is-hidden'); } }
  function onDown(){ cursorEl.style.transform = `translate3d(${lastX}px, ${lastY}px, 0) scale(0.96)`; }
  function onUp(){ cursorEl.style.transform = `translate3d(${lastX}px, ${lastY}px, 0)`; }

  window.addEventListener('mousemove', onMove, {passive:true});
  window.addEventListener('mousedown', onDown, {passive:true});
  window.addEventListener('mouseup', onUp, {passive:true});
  window.addEventListener('mouseleave', onLeave, {passive:true});
  window.addEventListener('mouseenter', onEnter, {passive:true});
  window.addEventListener('blur', onLeave, {once:false});
  window.addEventListener('focus', onEnter, {once:false});
  window.addEventListener('selectstart', () => { if (activated) setUse(true); }, {passive:true});
  document.addEventListener('selectionchange', () => { if (activated) setUse(true); });
  window.addEventListener('contextmenu', () => { if (activated) setUse(true); });
  window.addEventListener('copy', () => { if (activated) setUse(true); });
  window.addEventListener('cut', () => { if (activated) setUse(true); });
  document.addEventListener('mouseout', (e) => { if (!e.relatedTarget) onLeave(); }, {passive:true});
  document.addEventListener('mouseover', (e) => { if (!e.relatedTarget) onEnter(); }, {passive:true});

  // 自检：若 2 秒内没有任何 mousemove 激活且页面被设置为隐藏系统指针，则恢复系统指针
  setTimeout(() => {
    const hiddenSystem = document.documentElement.classList.contains('use-ico-cursor') || document.body.classList.contains('use-ico-cursor');
    if (!activated && hiddenSystem) setUse(false);
  }, 2000);
})(); 