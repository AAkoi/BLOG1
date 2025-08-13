(function(){
  function cleanup(){
    // 删除“关注”按钮
    document.querySelectorAll('#p_b_follow').forEach(el => el.remove());
    // 删除 Header1_HeaderTitle 元素
    document.querySelectorAll('#Header1_HeaderTitle, .Header1_HeaderTitle').forEach(el => el.remove());
    // 删除 leftcontentcontainer 内容并隐藏
    document.querySelectorAll('#leftcontentcontainer, .leftcontentcontainer').forEach(el => {
      el.innerHTML = '';
      el.style.display = 'none';
    });
    // 删除“退出”链接（注销）
    document.querySelectorAll('a[onclick*="account.logout"]').forEach(el => el.remove());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanup, { once: true });
  } else {
    cleanup();
  }
})(); 