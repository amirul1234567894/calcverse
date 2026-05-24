function() {
  var container = document.getElementById('adsterra-728x90');
  if (!container || container.dataset.loaded === 'true') return;
  container.dataset.loaded = 'true';
  
  var iframe = document.createElement('iframe');
  iframe.style.cssText = 'border:0;width:728px;height:90px;display:block;margin:0 auto;';
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('frameborder', '0');
  iframe.srcdoc = '<!DOCTYPE html><html><head><style>body{margin:0;padding:0}</style></head><body><script type="text/javascript">atOptions={"key":"6ba22cdd7c49a9ba89445df657e9a095","format":"iframe","height":90,"width":728,"params":{}};</scr'+'ipt><script src="https://www.highperformanceformat.com/6ba22cdd7c49a9ba89445df657e9a095/invoke.js"></scr'+'ipt></body></html>';
  container.appendChild(iframe);
})();
