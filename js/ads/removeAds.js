(function(){
  const selectors = [
    '#cnblogs_ch', '#cnblogs_c1', '#cnblogs_c2', '#blog_c1', '#blog_c2', '#cnblogs_space_ad',
    '.under-post-card', '.ad-box', '.ad_box', '.google-adsense', '[id^="ad_"]', '[class*="ad-" i]'
  ];
  function hideAdsIn(root){
    try {
      selectors.forEach(sel => root.querySelectorAll(sel).forEach(n => n.remove()));
    } catch(e){}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => hideAdsIn(document), { once: true });
  } else {
    hideAdsIn(document);
  }
  const mo = new MutationObserver(muts => {
    for (const m of muts){
      if (m.addedNodes && m.addedNodes.length){
        m.addedNodes.forEach(n => { if (n.nodeType === 1) hideAdsIn(n); });
      }
    }
  });
  if (document.body) mo.observe(document.body, { childList: true, subtree: true });
})(); 