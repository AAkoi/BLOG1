(function(){
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!finePointer) return;
  const root = document.documentElement;
  const hotspotX = parseInt((getComputedStyle(root).getPropertyValue('--ico-cursor-hotspot-x')||'2').replace('px',''),10) || 0;
  const hotspotY = parseInt((getComputedStyle(root).getPropertyValue('--ico-cursor-hotspot-y')||'2').replace('px',''),10) || 0;

  const cursorEl = document.createElement('div');
  cursorEl.className = 'custom-ico-cursor is-hidden';
  document.body.appendChild(cursorEl);

  let raf = 0; let lastX = 0; let lastY = 0; let visible = false;
  const isEdge = /Edg\//.test(navigator.userAgent);
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
    lastX = e.clientX - hotspotX;
    lastY = e.clientY - hotspotY;
    if (!visible){ visible = true; cursorEl.classList.remove('is-hidden'); }
    if (!raf){ raf = requestAnimationFrame(() => { raf = 0; cursorEl.style.transform = `translate3d(${lastX}px, ${lastY}px, 0)`; }); }
    const target = e.target;
    if (FORCE_EVERYWHERE) { setUse(true); } else { setUse(!needsNativePointer(target)); }
  }

  function onLeave(){ cursorEl.classList.add('is-hidden'); visible = false; setUse(false); }
  function onEnter(){ visible = true; cursorEl.classList.remove('is-hidden'); }
  function onDown(){ cursorEl.style.transform = `translate3d(${lastX}px, ${lastY}px, 0) scale(0.96)`; }
  function onUp(){ cursorEl.style.transform = `translate3d(${lastX}px, ${lastY}px, 0)`; }

  window.addEventListener('mousemove', onMove, {passive:true});
  window.addEventListener('mousedown', onDown, {passive:true});
  window.addEventListener('mouseup', onUp, {passive:true});
  window.addEventListener('mouseleave', onLeave, {passive:true});
  window.addEventListener('mouseenter', onEnter, {passive:true});
  window.addEventListener('blur', onLeave, {passive:true});
  window.addEventListener('focus', onEnter, {passive:true});
  window.addEventListener('selectstart', () => setUse(true), {passive:true});
  document.addEventListener('selectionchange', () => setUse(true));
  window.addEventListener('contextmenu', () => setUse(true));
  window.addEventListener('copy', () => setUse(true));
  window.addEventListener('cut', () => setUse(true));
  document.addEventListener('mouseout', (e) => { if (!e.relatedTarget) onLeave(); }, {passive:true});
  document.addEventListener('mouseover', (e) => { if (!e.relatedTarget) onEnter(); }, {passive:true});

  setUse(true);
})(); 