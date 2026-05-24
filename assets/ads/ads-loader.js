* Adsterra Ads Loader - CalcVerse */
(function() {
  function loadAd(file) {
    var script = document.createElement('script');
    script.src = file;
    script.async = true;
    document.body.appendChild(script);
  }
  
  function init() {
    // Determine path prefix based on current location
    var path = window.location.pathname;
    var prefix = '';
    if (path.indexOf('/calculators/') !== -1 || path.indexOf('/blog/') !== -1) {
      prefix = '../assets/ads/';
    } else {
      prefix = 'assets/ads/';
    }
    
    if (document.getElementById('adsterra-300x250')) loadAd(prefix + 'ad-300x250.js');
    if (document.getElementById('adsterra-728x90')) loadAd(prefix + 'ad-728x90.js');
    if (document.getElementById('adsterra-320x50')) loadAd(prefix + 'ad-320x50.js');
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
