(function() {
  function moveDiggIntoInfoCard() {
    try {
      var infoCard = document.querySelector('.post .postDesc.postinfo') || document.querySelector('.post .postDesc');
      if (!infoCard || infoCard.dataset.diggInCard === '1') return;
      var digg = document.getElementById('div_digg');
      if (!digg) return;
      if (!infoCard.contains(digg)) {
        infoCard.appendChild(digg);
      }
      var bury = digg.querySelector('.buryit');
      if (bury && bury.parentNode) bury.parentNode.removeChild(bury);
      var clearEl = digg.querySelector('.clear');
      if (clearEl && clearEl.parentNode) clearEl.parentNode.removeChild(clearEl);
      var diggword = digg.querySelector('.diggword');
      if (diggword && diggword.parentNode) diggword.parentNode.removeChild(diggword);
      infoCard.dataset.diggInCard = '1';
    } catch (err) {
      // no-op
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', moveDiggIntoInfoCard);
  } else {
    moveDiggIntoInfoCard();
  }

  // 监听异步渲染（某些主题动态插入 digg 区域）
  try {
    var mo = new MutationObserver(function() { moveDiggIntoInfoCard(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  } catch (_) {}
})(); 