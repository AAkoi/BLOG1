(function(){
  if (window.__KOI_BG_INIT__) return; window.__KOI_BG_INIT__ = true;
  function inject(){
    if (document.getElementById('koi-background')) return;
    const wrap = document.createElement('div');
    wrap.id = 'koi-background';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = [
      '<div class="fish">',
        '<div class="koiCoil"></div>'.repeat(15),
      '</div>',
      '<div class="fish">',
        '<div class="koiCoil"></div>'.repeat(15),
      '</div>',
      '<div class="seaLevel"></div>'
    ].join('');
    document.body.appendChild(wrap);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject, { once: true });
  } else {
    inject();
  }
})(); 