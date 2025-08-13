(function(){
  function moveNavIntoTitle(){
    const title = document.querySelector('#blogTitle');
    if (!title) return;

    // 清理可能的干扰元素
    title.querySelectorAll('.possible-impossible').forEach(n => n.remove());
    const oldCss = document.getElementById('possible-css');
    if (oldCss) oldCss.remove();

    const nav = document.querySelector('#navList') 
             || document.querySelector('[id*="nav"] ul') 
             || document.querySelector('header nav ul') 
             || document.querySelector('#top_nav ul') 
             || document.querySelector('.navbar ul') 
             || document.querySelector('.site_nav ul');
    if (nav && !title.contains(nav)) {
      title.appendChild(nav);
      title.setAttribute('data-nav-in-title', 'true');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', moveNavIntoTitle, { once: true });
  } else {
    moveNavIntoTitle();
  }
  const mo = new MutationObserver(() => moveNavIntoTitle());
  if (document.body) mo.observe(document.body, { childList: true, subtree: true });
})(); 