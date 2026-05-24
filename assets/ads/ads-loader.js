/* Adsterra Ads Loader - CalcVerse v4 */
(function() {
  function getPrefix() {
    var path = window.location.pathname;
    var depth = (path.match(/\//g) || []).length - 1;
    if (path.endsWith('/')) depth--;
    if (depth <= 0) return 'assets/ads/';
    var prefix = '';
    for (var i = 0; i < depth; i++) prefix += '../';
    return prefix + 'assets/ads/';
  }

  function loadAdScript(file) {
    var script = document.createElement('script');
    script.src = file;
    script.async = true;
    document.body.appendChild(script);
  }

  function init() {
    var prefix = getPrefix();
    if (document.getElementById('adsterra-728x90')) loadAdScript(prefix + 'ad-728x90.js');
    if (document.getElementById('adsterra-300x250')) loadAdScript(prefix + 'ad-300x250.js');
    if (document.getElementById('adsterra-320x50')) loadAdScript(prefix + 'ad-320x50.js');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();