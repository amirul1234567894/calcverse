/* Adsterra 728x90 Banner - Iframe Isolated */
(function() {
  var container = document.getElementById('adsterra-728x90');
  if (!container || container.dataset.loaded === 'true') return;
  container.dataset.loaded = 'true';

  var iframe = document.createElement('iframe');
  iframe.width = '728';
  iframe.height = '90';
  iframe.scrolling = 'no';
  iframe.frameBorder = '0';
  iframe.style.cssText = 'border:0;width:728px;height:90px;display:block;margin:0 auto;max-width:100%';
  container.appendChild(iframe);

  var doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write('<!DOCTYPE html><html><head><style>body{margin:0;padding:0;background:transparent}</style></head><body>');
  doc.write('<script type="text/javascript">var atOptions={"key":"6ba22cdd7c49a9ba89445df657e9a095","format":"iframe","height":90,"width":728,"params":{}};</' + 'script>');
  doc.write('<script type="text/javascript" src="https://www.highperformanceformat.com/6ba22cdd7c49a9ba89445df657e9a095/invoke.js"></' + 'script>');
  doc.write('</body></html>');
  doc.close();
})();