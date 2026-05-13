// ============================================
// CalcVerse - IndexNow Ping + SEO Health Check
// ============================================
// Runs: Weekly (Monday 8am IST via GitHub Actions)
// Purpose: Ping Bing/Yandex for all URLs, check site health, send Telegram report

const SITE_URL = 'https://calc.autoflowa.in';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// All 24 URLs to ping
const URLS = [
  `${SITE_URL}/`,
  `${SITE_URL}/about/`,
  `${SITE_URL}/contact/`,
  `${SITE_URL}/privacy/`,
  `${SITE_URL}/terms/`,
  `${SITE_URL}/calculators/age-calculator/`,
  `${SITE_URL}/calculators/bmi-calculator/`,
  `${SITE_URL}/calculators/loan-calculator/`,
  `${SITE_URL}/calculators/emi-calculator/`,
  `${SITE_URL}/calculators/sip-calculator/`,
  `${SITE_URL}/calculators/percentage-calculator/`,
  `${SITE_URL}/calculators/gst-calculator/`,
  `${SITE_URL}/calculators/income-tax-calculator/`,
  `${SITE_URL}/calculators/compound-interest-calculator/`,
  `${SITE_URL}/calculators/simple-interest-calculator/`,
  `${SITE_URL}/calculators/discount-calculator/`,
  `${SITE_URL}/calculators/tip-calculator/`,
  `${SITE_URL}/calculators/scientific-calculator/`,
  `${SITE_URL}/calculators/calorie-calculator/`,
  `${SITE_URL}/calculators/date-calculator/`,
  `${SITE_URL}/calculators/time-calculator/`,
  `${SITE_URL}/calculators/unit-converter/`,
  `${SITE_URL}/calculators/currency-converter/`,
  `${SITE_URL}/blog/`,
];

// ============================================
// Telegram notification helper
// ============================================
async function sendTelegram(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('⚠️  Telegram credentials missing, skipping notification');
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const data = await res.json();
    if (data.ok) {
      console.log('✅ Telegram message sent');
    } else {
      console.error('❌ Telegram error:', data.description);
    }
  } catch (err) {
    console.error('❌ Telegram fetch failed:', err.message);
  }
}

// ============================================
// IndexNow ping - Bing
// ============================================
async function pingBing() {
  const endpoint = 'https://api.indexnow.org/IndexNow';
  const payload = {
    host: 'calc.autoflowa.in',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: URLS,
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log(`📡 Bing IndexNow response: ${res.status} ${res.statusText}`);
    return { service: 'Bing', status: res.status, ok: res.status === 200 || res.status === 202 };
  } catch (err) {
    console.error('❌ Bing ping failed:', err.message);
    return { service: 'Bing', status: 0, ok: false, error: err.message };
  }
}

// ============================================
// IndexNow ping - Yandex
// ============================================
async function pingYandex() {
  const endpoint = 'https://yandex.com/indexnow';
  const payload = {
    host: 'calc.autoflowa.in',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: URLS,
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log(`📡 Yandex IndexNow response: ${res.status} ${res.statusText}`);
    return { service: 'Yandex', status: res.status, ok: res.status === 200 || res.status === 202 };
  } catch (err) {
    console.error('❌ Yandex ping failed:', err.message);
    return { service: 'Yandex', status: 0, ok: false, error: err.message };
  }
}

// ============================================
// Site health check - test all URLs
// ============================================
async function checkSiteHealth() {
  console.log('🔍 Checking site health...');
  const results = { up: 0, down: 0, errors: [] };

  for (const url of URLS) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      if (res.ok) {
        results.up++;
      } else {
        results.down++;
        results.errors.push(`${res.status} - ${url}`);
      }
    } catch (err) {
      results.down++;
      results.errors.push(`ERR - ${url}`);
    }
  }

  console.log(`✅ Up: ${results.up}/${URLS.length}, Down: ${results.down}`);
  return results;
}

// ============================================
// Main execution
// ============================================
async function main() {
  console.log('🚀 CalcVerse SEO Health Check Starting...');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log(`🌐 Site: ${SITE_URL}`);
  console.log(`📋 Total URLs: ${URLS.length}`);
  console.log('');

  // Validate environment
  if (!INDEXNOW_KEY) {
    console.error('❌ INDEXNOW_KEY missing in environment');
    process.exit(1);
  }

  // Run checks
  const health = await checkSiteHealth();
  const bing = await pingBing();
  const yandex = await pingYandex();

  // Build Telegram report
  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const healthEmoji = health.down === 0 ? '✅' : '⚠️';
  const bingEmoji = bing.ok ? '✅' : '❌';
  const yandexEmoji = yandex.ok ? '✅' : '❌';

  const message = `
<b>🚀 CalcVerse SEO Weekly Report</b>
📅 ${timestamp}

<b>📊 Site Health</b>
${healthEmoji} Up: ${health.up}/${URLS.length}
${health.down > 0 ? `❌ Down: ${health.down}\n` : ''}${health.errors.slice(0, 3).map(e => `• ${e}`).join('\n')}

<b>📡 Search Engine Pings</b>
${bingEmoji} Bing: ${bing.status}
${yandexEmoji} Yandex: ${yandex.status}

<b>🔗 Site:</b> ${SITE_URL}
<b>📝 URLs Pinged:</b> ${URLS.length}
`.trim();

  console.log('\n' + message.replace(/<\/?b>/g, ''));
  await sendTelegram(message);

  // Exit with error if anything failed
  if (health.down > 0 || !bing.ok || !yandex.ok) {
    console.log('\n⚠️  Completed with warnings');
    process.exit(0); // Don't fail the workflow, just warn
  }

  console.log('\n✅ All checks passed!');
}

main().catch(err => {
  console.error('💥 Fatal error:', err);
  sendTelegram(`❌ <b>CalcVerse SEO Check FAILED</b>\n\nError: ${err.message}`).finally(() => {
    process.exit(1);
  });
});
