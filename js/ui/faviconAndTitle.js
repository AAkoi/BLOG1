(function(){
  const cfg = {
    faviconHref: 'https://blog-static.cnblogs.com/files/blogs/846027/cursor-text.ico',
    frames: [],
    frameIntervalMs: 700,
    enableTitleEffect: true,
    titleIntervalMs: 800
  };

  function removeExistingIcons(){
    document.querySelectorAll('link[rel~="icon"]').forEach(n => n.remove());
  }
  function addIcon(href){
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = href.endsWith('.ico') ? 'image/x-icon' : '';
    link.href = href;
    document.head.appendChild(link);
    const shortcut = document.createElement('link');
    shortcut.rel = 'shortcut icon';
    shortcut.type = link.type;
    shortcut.href = href;
    document.head.appendChild(shortcut);
  }
  function setFavicon(href){
    removeExistingIcons();
    addIcon(href);
  }

  if (cfg.frames && cfg.frames.length > 0){
    let i = 0, t = 0;
    const tick = () => {
      if (document.hidden) { t = setTimeout(tick, Math.max(cfg.frameIntervalMs*3, 1500)); return; }
      setFavicon(cfg.frames[i % cfg.frames.length]);
      i++;
      t = setTimeout(tick, cfg.frameIntervalMs);
    };
    tick();
  } else if (cfg.faviconHref) {
    setFavicon(cfg.faviconHref);
  }

  if (cfg.enableTitleEffect){
    const base = document.title || 'My Blog';
    const seq = [
      `✦ ${base} ✦`,
      `✧ ${base} ✧`,
      `⋆ ${base} ⋆`,
      `✺ ${base} ✺`
    ];
    let j = 0, h = 0;
    const spin = () => {
      if (document.hidden) { h = setTimeout(spin, Math.max(cfg.titleIntervalMs*3, 2400)); return; }
      document.title = seq[j % seq.length];
      j++;
      h = setTimeout(spin, cfg.titleIntervalMs);
    };
    spin();
  }
})(); 