(function(){
  function isListPage(){
    return !!document.querySelector('#mainContent .day') && !document.querySelector('#cnblogs_post_body');
  }
  function wrapAsCard(day){
    const titleWrap = day.querySelector('.postTitle');
    const con = day.querySelector('.postCon');
    const desc = day.querySelector('.postDesc');
    if (!titleWrap || !con || !desc) return;
    // 已包裹则跳过
    if (titleWrap.parentElement?.classList.contains('home-card') ||
        con.parentElement?.classList.contains('home-card') ||
        desc.parentElement?.classList.contains('home-card')) return;
    const card = document.createElement('div');
    card.className = 'home-card';
    // 将三段顺序移动进卡片
    titleWrap.before(card);
    card.appendChild(titleWrap);
    card.appendChild(con);
    card.appendChild(desc);
  }
  function processDays(){
    document.querySelectorAll('#mainContent .day').forEach(day => {
      const titleWrap = day.querySelector('.postTitle');
      if (titleWrap) {
        const link = titleWrap.querySelector('a.postTitle2');
        if (link) {
          const raw = (link.textContent || '').trim();
          titleWrap.innerHTML = '';
          const span = document.createElement('span');
          span.className = 'home-post-title';
          span.textContent = raw;
          titleWrap.appendChild(span);
          titleWrap.setAttribute('role','heading');
          titleWrap.setAttribute('aria-level','2');
        }
      }
      wrapAsCard(day);
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