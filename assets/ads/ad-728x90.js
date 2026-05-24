/* Adsterra 728x90 Banner */
(function() {
  var container = document.getElementById('adsterra-728x90');
  if (!container || container.dataset.loaded === 'true') return;
  container.dataset.loaded = 'true';

  var optionsScript = document.createElement('script');
  optionsScript.type = 'text/javascript';
  optionsScript.text = 'atOptions = {"key":"6ba22cdd7c49a9ba89445df657e9a095","format":"iframe","height":90,"width":728,"params":{}};';
  container.appendChild(optionsScript);

  var invokeScript = document.createElement('script');
  invokeScript.type = 'text/javascript';
  invokeScript.src = 'https://www.highperformanceformat.com/6ba22cdd7c49a9ba89445df657e9a095/invoke.js';
  container.appendChild(invokeScript);
})();