(function(){
  if (window.__KEEP_IMPOSSIBLE__) return;
  function purge(){
    const title = document.querySelector('#blogTitle');
    if (!title) return;
    title.querySelectorAll('.possible-impossible').forEach(n => n.remove());
    const css = document.getElementById('possible-css');
    if (css) css.remove();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', purge, { once: true });
  } else {
    purge();
  }
  window.addEventListener('load', purge, { once: true });
})(); 