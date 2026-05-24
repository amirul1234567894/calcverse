(function() {
  var container = document.getElementById('adsterra-300x250');
  if (!container || container.dataset.loaded === 'true') return;
  container.dataset.loaded = 'true';
  
  var iframe = document.createElement('iframe');
  iframe.style.cssText = 'border:0;width:300px;height:250px;display:block;margin:0 auto;';
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('frameborder', '0');
  iframe.srcdoc = '<!DOCTYPE html><html><head><style>body{margin:0;padding:0}</style></head><body><script type="text/javascript">atOptions={"key":"89549945004482264ccc04b9349c1480","format":"iframe","height":250,"width":300,"params":{}};</scr'+'ipt><script src="https://www.highperformanceformat.com/89549945004482264ccc04b9349c1480/invoke.js"></scr'+'ipt></body></html>';
  container.appendChild(iframe);
})();
