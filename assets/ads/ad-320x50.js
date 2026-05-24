(function() {
  var container = document.getElementById('adsterra-320x50');
  if (!container || container.dataset.loaded === 'true') return;
  container.dataset.loaded = 'true';
  
  var iframe = document.createElement('iframe');
  iframe.style.cssText = 'border:0;width:320px;height:50px;display:block;margin:0 auto;';
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('frameborder', '0');
  iframe.srcdoc = '<!DOCTYPE html><html><head><style>body{margin:0;padding:0}</style></head><body><script type="text/javascript">atOptions={"key":"0f6917705c7a62c66281998a264cc413","format":"iframe","height":50,"width":320,"params":{}};</scr'+'ipt><script src="https://www.highperformanceformat.com/0f6917705c7a62c66281998a264cc413/invoke.js"></scr'+'ipt></body></html>';
  container.appendChild(iframe);
})();
