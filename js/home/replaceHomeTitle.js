(function(){
  function isListPage(){
    return !!document.querySelector('#mainContent .day') && !document.querySelector('#cnblogs_post_body');
  }
  function processDays(){
    document.querySelectorAll('#mainContent .day').forEach(day => {
      const titleWrap = day.querySelector('.postTitle');
      if (!titleWrap) return;
      const link = titleWrap.querySelector('a.postTitle2');
      if (!link) return;
      const raw = (link.textContent || '').trim();
      titleWrap.innerHTML = '';
      const span = document.createElement('span');
      span.className = 'home-post-title';
      span.textContent = raw;
      titleWrap.appendChild(span);
      titleWrap.setAttribute('role','heading');
      titleWrap.setAttribute('aria-level','2');
    });
  }
  if (isListPage()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', processDays, { once: true });
    } else {
      processDays();
    }
    const mo = new MutationObserver(() => { if (isListPage()) processDays(); });
    mo.observe(document.body, { childList: true, subtree: true });
  }
})(); 