(function(){
  function injectBadge(){
    const title = document.querySelector('#blogTitle');
    if (!title) return false;

    title.querySelectorAll('.header-name-chip').forEach(el => el.remove());
    document.body && document.body.removeAttribute('data-title-name-chip');

    const exist = title.querySelector('.welcome-badge');
    const welcome = exist || document.createElement('span');
    if (!exist) welcome.className = 'welcome-badge';
    welcome.innerHTML = '';
    const pre = document.createTextNode('欢迎来到');
    const link = document.createElement('a');
    link.href = 'https://www.cnblogs.com/blueaoi';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = '蓝色的aoi';
    const suf = document.createTextNode('的博客');
    welcome.appendChild(pre);
    welcome.appendChild(link);
    welcome.appendChild(suf);
    if (!exist) title.appendChild(welcome);

    // 移除 POSSIBLE 注入
    title.querySelectorAll('.possible-impossible').forEach(el => el.remove());
    const oldPossibleStyle = document.getElementById('possible-css');
    if (oldPossibleStyle) oldPossibleStyle.remove();

    (function injectProfileImpossible(){
      const host = document.querySelector('#profile_block');
      if (!host || host.querySelector('.profile-impossible')) return;
      const layer = document.createElement('div');
      layer.className = 'profile-impossible';
      layer.setAttribute('aria-hidden', 'true');
      layer.innerHTML = '<div class="im-wrap"><h1><span>I</span>M<span>POSSIBLE</span></h1></div>';
      host.style.position = host.style.position || 'relative';
      host.appendChild(layer);

      if (!document.getElementById('profile-impossible-css')){
        const s = document.createElement('style');
        s.id = 'profile-impossible-css';
        s.textContent = `
#profile_block { overflow: hidden; }
#profile_block .profile-impossible { position: absolute; inset: 0; pointer-events: none; display: grid; place-items: center; z-index: 0; }
#profile_block .profile-impossible .im-wrap { width: 100%; height: 100%; display: grid; place-items: center; background: radial-gradient(80% 60% at 50% 50%, rgb(from var(--theme-color) r g b / .08), transparent 60%); }
#profile_block .profile-impossible h1 { margin: 0; font-family: monospace; font-weight: 900; font-size: clamp(28px, 8vw, 64px); letter-spacing: 6px; color: rgb(from var(--theme-color) r g b / .20); text-shadow: 0 0 20px rgb(from var(--theme-color) r g b / .15), 0 0 40px rgb(from var(--main-green) r g b / .10); transition: color .3s ease, text-shadow .3s ease; }
#profile_block .profile-impossible h1 span { transition: .45s ease; }
#profile_block:hover .profile-impossible h1 span:nth-child(1), #profile_block.is-hovered .profile-impossible h1 span:nth-child(1) { margin-right: 4px; }
#profile_block:hover .profile-impossible h1 span:nth-child(1)::after, #profile_block.is-hovered .profile-impossible h1 span:nth-child(1)::after { content: "'"; color: var(--theme-color); }
#profile_block:hover .profile-impossible h1 span:nth-child(2), #profile_block.is-hovered .profile-impossible h1 span:nth-child(2) { margin-left: 14px; }
#profile_block:hover .profile-impossible h1 span, #profile_block.is-hovered .profile-impossible h1 span { color: rgb(from var(--theme-color) r g b / .85); text-shadow: 0 0 8px rgb(from var(--theme-color) r g b / .55), 0 0 18px rgb(from var(--theme-color) r g b / .35), 0 0 26px rgb(from var(--main-green) r g b / .25); }
#profile_block .profile-impossible::after { content: ""; position: absolute; left: 18px; right: 18px; bottom: 10px; height: 3px; border-radius: 3px; background: linear-gradient(90deg, var(--theme-color), var(--main-green)); opacity: .35; filter: blur(.5px); }
#profile_block > *:not(.profile-impossible) { position: relative; z-index: 1; }
        `;
        document.head.appendChild(s);
      }
    })();

    return true;
  }
  if (!injectBadge()) {
    document.addEventListener('DOMContentLoaded', injectBadge, { once: true });
    window.addEventListener('load', injectBadge, { once: true });
    const mo = new MutationObserver(() => { if (injectBadge()) mo.disconnect(); });
    if (document.body) mo.observe(document.body, { childList: true, subtree: true });
  }
})(); 