(function(){
  function bind(){
    const host = document.querySelector('#profile_block');
    if (!host) return;
    host.addEventListener('mouseenter', () => host.classList.add('is-hovered'));
    host.addEventListener('mouseleave', () => host.classList.remove('is-hovered'));
    host.addEventListener('focusin', () => host.classList.add('is-hovered'));
    host.addEventListener('focusout', () => host.classList.remove('is-hovered'));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind, { once: true });
  } else {
    bind();
  }
})(); 