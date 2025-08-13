(function(){
  document.addEventListener('DOMContentLoaded', function () {
    const postBody = document.querySelector('#cnblogs_post_body');
    const postContainer = postBody ? postBody.closest('.post') : null;
    const hasTitle = !!(postContainer && postContainer.querySelector('.postTitle'));
    const isDetailUrl = /\/p\/\d+/.test(location.pathname) || !!document.getElementById('post_detail');
    const notListPage = !document.querySelector('#mainContent .day');
    let box = document.querySelector('.post .postDesc');
    if (!postBody || !postContainer || !hasTitle || !isDetailUrl || !notListPage || !box || box.dataset.processed === '1') {
      if (box) { box.classList.remove('post-float-right', 'postinfo'); }
      return;
    }

    // 右侧悬浮到导航下沿（不影响正文）
    box.classList.add('post-float-right');
    document.body.setAttribute('data-nav-right-anchor', 'true');

    const nav = document.querySelector('#navList') 
             || document.querySelector('[id*="nav"] ul') 
             || document.querySelector('header nav ul') 
             || document.querySelector('#top_nav ul') 
             || document.querySelector('.navbar ul') 
             || document.querySelector('.site_nav ul');

    const extraOffset = 12;
    let topPx = 100;
    if (nav) {
      const r = nav.getBoundingClientRect();
      topPx = Math.max(60, Math.round(r.bottom + window.scrollY + extraOffset));
    }
    box.style.top = topPx + 'px';

    // 采集原内容
    const rawText = box.textContent.replace(/\s+/g, ' ').trim();
    const anchors = Array.from(box.querySelectorAll('a'));
    anchors.filter(a => /举报/.test(a.textContent)).forEach(a => a.remove());

    const mDate = rawText.match(/(\d{4})[-\/年](\d{1,2})[-\/月](\d{1,2})/);
    const dateStr = mDate ? `${mDate[1].padStart(4,'0')}-${mDate[2].padStart(2,'0')}-${mDate[3].padStart(2,'0')}` : '';

    const mRead = rawText.match(/阅读\s*[（(]\s*(\d+)\s*[)）]/);
    const mCmnt = rawText.match(/评论\s*[（(]\s*(\d+)\s*[)）]/);
    const readStr = mRead ? `阅读(${mRead[1]})` : '';
    const cmntStr = mCmnt ? `评论(${mCmnt[1]})` : '';

    const isFunc = a => /^(MD|Md|md)$/.test(a.textContent.trim()) || /编辑|收藏|举报/.test(a.textContent);
    let nameLink = anchors.find(a => /cnblogs\.com/.test(a.href)) || anchors.find(a => !isFunc(a));
    if (nameLink) nameLink = nameLink.cloneNode(true);

    const mdLink   = anchors.find(a => /^(MD|Md|md)$/.test(a.textContent.trim()))?.cloneNode(true) || null;
    const editLink = anchors.find(a => /编辑/.test(a.textContent))?.cloneNode(true) || null;
    const favLink  = anchors.find(a => /收藏/.test(a.textContent))?.cloneNode(true) || null;

    // 重排为三行
    box.innerHTML = '';
    box.classList.add('postinfo');

    if (nameLink) {
      const nameWrap = document.createElement('div');
      nameWrap.className = 'postinfo-name';
      nameWrap.appendChild(nameLink);
      box.appendChild(nameWrap);
    }
    if (dateStr) {
      const row1 = document.createElement('div');
      row1.className = 'postinfo-date';
      row1.textContent = dateStr;
      box.appendChild(row1);
    }
    if (readStr || cmntStr) {
      const row2 = document.createElement('div');
      row2.className = 'postinfo-stats';
      row2.textContent = [readStr, cmntStr].filter(Boolean).join('    ');
      box.appendChild(row2);
    }
    const row3 = document.createElement('div');
    row3.className = 'postinfo-actions';
    [mdLink, editLink, favLink].filter(Boolean).forEach(a => row3.appendChild(a));
    box.appendChild(row3);

    const gc = document.querySelector('#green_channel');
    const digg = document.querySelector('#div_digg');
    if (gc && !box.contains(gc)) box.appendChild(gc);
    if (digg && !box.contains(digg)) box.appendChild(digg);

    const notice = document.querySelector('#blog-news');
    if (notice) {
      const wrap = document.createElement('div');
      wrap.className = 'postinfo-notice';
      const body = document.createElement('div');
      body.className = 'notice-body';
      body.appendChild(notice);
      wrap.appendChild(body);
      box.appendChild(wrap);
    }

    // 标记
    box.dataset.processed = '1';

    // 兜底清理
    const stillValid = document.querySelector('#cnblogs_post_body') && document.querySelector('.post .postTitle');
    if (!stillValid) {
      box.classList.remove('post-float-right');
      box.classList.remove('postinfo');
    }

    // 楼层链接排序 + 动态类名
    setTimeout(() => {
      const floorLinks = document.querySelectorAll('a.layer');
      if (floorLinks.length > 0) {
        const containers = new Set();
        floorLinks.forEach(link => { if (link.parentElement) containers.add(link.parentElement); });
        containers.forEach(container => {
          const floors = Array.from(container.querySelectorAll('a.layer'));
          if (floors.length > 1) {
            floors.sort((a, b) => {
              const aText = a.textContent || a.innerText || '';
              const bText = b.textContent || b.innerText || '';
              const aNum = parseInt(aText.match(/#(\d+)楼/)?.[1] || aText.match(/#(\d+)/)?.[1] || '0');
              const bNum = parseInt(bText.match(/#(\d+)楼/)?.[1] || bText.match(/#(\d+)/)?.[1] || '0');
              return aNum - bNum;
            });
            floors.forEach(floor => { if (floor.parentElement === container) container.appendChild(floor); });
            floors.forEach((floor) => {
              const floorText = floor.textContent || floor.innerText || '';
              const floorNum = parseInt(floorText.match(/#(\d+)楼/)?.[1] || floorText.match(/#(\d+)/)?.[1] || '0');
              if (floorNum > 0 && floorNum <= 5) floor.classList.add(`floor-${floorNum}`);
            });
          }
        });
      }
    }, 1000);
  });
})(); 