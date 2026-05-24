/* Adsterra 300x250 Banner - Iframe Isolated */
(function() {
  var container = document.getElementById('adsterra-300x250');
  if (!container || container.dataset.loaded === 'true') return;
  container.dataset.loaded = 'true';

  var iframe = document.createElement('iframe');
  iframe.width = '300';
  iframe.height = '250';
  iframe.scrolling = 'no';
  iframe.frameBorder = '0';
  iframe.style.cssText = 'border:0;width:300px;height:250px;display:block;margin:0 auto';
  container.appendChild(iframe);

  var doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write('<!DOCTYPE html><html><head><style>body{margin:0;padding:0;background:transparent}</style></head><body>');
  doc.write('<script type="text/javascript">var atOptions={"key":"89549945004482264ccc04b9349c1480","format":"iframe","height":250,"width":300,"params":{}};</' + 'script>');
  doc.write('<script type="text/javascript" src="https://www.highperformanceformat.com/89549945004482264ccc04b9349c1480/invoke.js"></' + 'script>');
  doc.write('</body></html>');
  doc.close();
})();