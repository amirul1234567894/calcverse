/* Adsterra 300x250 Banner */
(function() {
  var container = document.getElementById('adsterra-300x250');
  if (!container || container.dataset.loaded === 'true') return;
  container.dataset.loaded = 'true';

  var optionsScript = document.createElement('script');
  optionsScript.type = 'text/javascript';
  optionsScript.text = 'atOptions = {"key":"89549945004482264ccc04b9349c1480","format":"iframe","height":250,"width":300,"params":{}};';
  container.appendChild(optionsScript);

  var invokeScript = document.createElement('script');
  invokeScript.type = 'text/javascript';
  invokeScript.src = 'https://www.highperformanceformat.com/89549945004482264ccc04b9349c1480/invoke.js';
  container.appendChild(invokeScript);
})();