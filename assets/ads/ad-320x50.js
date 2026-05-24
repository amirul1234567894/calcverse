/* Adsterra 320x50 Banner - Iframe Isolated */
(function() {
  var container = document.getElementById('adsterra-320x50');
  if (!container || container.dataset.loaded === 'true') return;
  container.dataset.loaded = 'true';

  var iframe = document.createElement('iframe');
  iframe.width = '320';
  iframe.height = '50';
  iframe.scrolling = 'no';
  iframe.frameBorder = '0';
  iframe.style.cssText = 'border:0;width:320px;height:50px;display:block;margin:0 auto';
  container.appendChild(iframe);

  var doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write('<!DOCTYPE html><html><head><style>body{margin:0;padding:0;background:transparent}</style></head><body>');
  doc.write('<script type="text/javascript">var atOptions={"key":"0f6917705c7a62c66281998a264cc413","format":"iframe","height":50,"width":320,"params":{}};</' + 'script>');
  doc.write('<script type="text/javascript" src="https://www.highperformanceformat.com/0f6917705c7a62c66281998a264cc413/invoke.js"></' + 'script>');
  doc.write('</body></html>');
  doc.close();
})();