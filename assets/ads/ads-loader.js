/* Adsterra Ads Loader - CalcVerse v3 (Sequential + Lazy) */
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
    return new Promise(function(resolve) {
      var script = document.createElement('script');
      script.src = file;
      script.async = true;
      script.onload = function() { resolve(true); };
      script.onerror = function() { resolve(false); };
      document.body.appendChild(script);
    });
  }

  function sleep(ms) {
    return new Promise(function(r) { setTimeout(r, ms); });
  }

  function isVisible(el) {
    if (!el) return false;
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight + 300 && rect.bottom > -300;
  }

  async function init() {
    var prefix = getPrefix();
    
    // Step 1: Load top banner immediately (728x90)
    if (document.getElementById('adsterra-728x90')) {
      await loadAdScript(prefix + 'ad-728x90.js');
      await sleep(1500); // wait 1.5s before next
    }
    
    // Step 2: Load sticky mobile banner (320x50)
    if (document.getElementById('adsterra-320x50')) {
      await loadAdScript(prefix + 'ad-320x50.js');
      await sleep(1500);
    }
    
    // Step 3: Lazy-load middle ad (300x250) when visible
    var middleAd = document.getElementById('adsterra-300x250');
    if (middleAd) {
      if (isVisible(middleAd)) {
        await loadAdScript(prefix + 'ad-300x250.js');
      } else {
        // Wait for scroll
        var loaded = false;
        var scrollHandler = function() {
          if (!loaded && isVisible(middleAd)) {
            loaded = true;
            loadAdScript(prefix + 'ad-300x250.js');
            window.removeEventListener('scroll', scrollHandler);
          }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
        // Fallback: load after 5s anyway
        setTimeout(function() {
          if (!loaded) {
            loaded = true;
            loadAdScript(prefix + 'ad-300x250.js');
            window.removeEventListener('scroll', scrollHandler);
          }
        }, 5000);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();