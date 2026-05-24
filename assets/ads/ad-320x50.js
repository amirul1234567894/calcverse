/* Adsterra 320x50 Banner */
(function() {
  var container = document.getElementById('adsterra-320x50');
  if (!container || container.dataset.loaded === 'true') return;
  container.dataset.loaded = 'true';

  var optionsScript = document.createElement('script');
  optionsScript.type = 'text/javascript';
  optionsScript.text = 'atOptions = {"key":"0f6917705c7a62c66281998a264cc413","format":"iframe","height":50,"width":320,"params":{}};';
  container.appendChild(optionsScript);

  var invokeScript = document.createElement('script');
  invokeScript.type = 'text/javascript';
  invokeScript.src = 'https://www.highperformanceformat.com/0f6917705c7a62c66281998a264cc413/invoke.js';
  container.appendChild(invokeScript);
})();