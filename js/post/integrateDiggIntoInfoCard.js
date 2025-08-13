(function() {
  function ensureAvatarElement(infoCard) {
    if (!infoCard.querySelector('.postinfo-avatar')) {
      var avatar = document.createElement('div');
      avatar.className = 'postinfo-avatar';
      // 强制内联，避免被外部样式覆盖
      avatar.style.position = 'absolute';
      avatar.style.left = '12px';
      avatar.style.top = '12px';
      avatar.style.width = '72px';
      avatar.style.height = '72px';
      avatar.style.borderRadius = '50%';
      avatar.style.backgroundImage = getComputedStyle(document.documentElement).getPropertyValue('--author-avatar-url') || "url('')";
      avatar.style.backgroundSize = 'cover';
      avatar.style.backgroundPosition = 'center';
      avatar.style.backgroundColor = '#fff';
      avatar.style.border = '3px solid rgba(255,255,255,.85)';
      avatar.style.boxShadow = '0 4px 10px rgba(0,0,0,.08)';
      infoCard.appendChild(avatar);
    }
  }

  function styleInfoCard(infoCard) {
    // 强制关键外观，防止三方皮肤覆盖
    infoCard.style.position = 'relative';
    infoCard.style.float = 'right';
    infoCard.style.clear = 'right';
    infoCard.style.width = '280px';
    infoCard.style.margin = '0 0 12px 16px';
    infoCard.style.background = 'transparent';
    infoCard.style.border = '1px solid rgba(22,111,243,.16)';
    infoCard.style.borderRadius = '10px';
    infoCard.style.padding = '12px 12px 12px 104px';
    infoCard.style.lineHeight = '1.65';
  }

  function moveDiggIntoInfoCard() {
    try {
      var infoCard = document.querySelector('.post .postDesc.postinfo') || document.querySelector('.post .postDesc.post-float-right') || document.querySelector('.post .postDesc');
      if (!infoCard) return;

      styleInfoCard(infoCard);
      ensureAvatarElement(infoCard);

      var digg = document.getElementById('div_digg');
      if (digg && !infoCard.contains(digg)) {
        infoCard.appendChild(digg);
      }
      var bury = digg && digg.querySelector('.buryit');
      if (bury && bury.parentNode) bury.parentNode.removeChild(bury);
      var clearEl = digg && digg.querySelector('.clear');
      if (clearEl && clearEl.parentNode) clearEl.parentNode.removeChild(clearEl);
      var diggword = digg && digg.querySelector('.diggword');
      if (diggword && diggword.parentNode) diggword.parentNode.removeChild(diggword);

      // 正文右侧让出空间
      var postTitle = document.querySelector('.post .postTitle');
      var postBody = document.getElementById('cnblogs_post_body');
      if (postTitle) postTitle.style.marginRight = '300px';
      if (postBody) postBody.style.marginRight = '300px';
    } catch (err) {
      // no-op
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', moveDiggIntoInfoCard);
  } else {
    moveDiggIntoInfoCard();
  }

  try {
    var mo = new MutationObserver(function() { moveDiggIntoInfoCard(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  } catch (_) {}
})(); 