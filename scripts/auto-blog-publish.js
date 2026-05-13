// ============================================
// CalcVerse - AI Blog Auto-Publisher
// ============================================
// Runs: Weekly (Wednesday 10am IST via GitHub Actions)
// Purpose: Generate blog using Gemini AI, push to GitHub, ping IndexNow, notify Telegram

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const SITE_URL = 'https://calc.autoflowa.in';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// 12 calculator-focused blog topics (rotates weekly)
const BLOG_TOPICS = [
  { keyword: 'BMI calculator guide', title: 'How to Use a BMI Calculator: Complete Guide for 2026', calculator: 'bmi-calculator' },
  { keyword: 'EMI calculation tips', title: 'EMI Calculator Explained: Master Your Loan Payments', calculator: 'emi-calculator' },
  { keyword: 'SIP investment planning', title: 'SIP Calculator: Plan Your Mutual Fund Investment Like a Pro', calculator: 'sip-calculator' },
  { keyword: 'GST calculation India', title: 'GST Calculator Guide: Calculate GST Easily in 2026', calculator: 'gst-calculator' },
  { keyword: 'income tax planning', title: 'Income Tax Calculator: Save Money with Smart Planning', calculator: 'income-tax-calculator' },
  { keyword: 'compound interest power', title: 'Compound Interest Calculator: The 8th Wonder of the World', calculator: 'compound-interest-calculator' },
  { keyword: 'percentage calculation tricks', title: 'Percentage Calculator: 10 Hacks for Daily Life', calculator: 'percentage-calculator' },
  { keyword: 'age calculator uses', title: 'Age Calculator: More Useful Than You Think', calculator: 'age-calculator' },
  { keyword: 'calorie tracking weight loss', title: 'Calorie Calculator: Your First Step to Weight Loss', calculator: 'calorie-calculator' },
  { keyword: 'discount shopping smart', title: 'Discount Calculator: Shop Smart and Save More', calculator: 'discount-calculator' },
  { keyword: 'currency conversion travel', title: 'Currency Converter Guide for Smart Travelers', calculator: 'currency-converter' },
  { keyword: 'unit conversion daily', title: 'Unit Converter: The Tool You Use Without Knowing', calculator: 'unit-converter' },
];

// ============================================
// Pick topic based on week number (rotates yearly)
// ============================================
function pickTopic() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
  const topic = BLOG_TOPICS[week % BLOG_TOPICS.length];
  console.log(`📌 Week ${week} → Topic: ${topic.title}`);
  return topic;
}

// ============================================
// Generate slug from title
// ============================================
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ============================================
// Telegram notification helper
// ============================================
async function sendTelegram(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
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
    if (data.ok) console.log('✅ Telegram sent');
    else console.error('❌ Telegram:', data.description);
  } catch (err) {
    console.error('❌ Telegram error:', err.message);
  }
}

// ============================================
// Gemini AI: Generate blog content
// ============================================
async function generateBlog(topic) {
  console.log(`🤖 Generating blog with Gemini AI...`);

  const prompt = `You are an SEO content writer for CalcVerse (calc.autoflowa.in), a free online calculator website.

Write a complete, SEO-optimized blog post on this topic:
TITLE: ${topic.title}
KEYWORD: ${topic.keyword}
CALCULATOR LINK: ${SITE_URL}/calculators/${topic.calculator}/

Requirements:
- Word count: 1200-1500 words
- Format: Clean HTML (no <html>, <body> tags - just content)
- Use <h2> for main sections (4-6 sections)
- Use <h3> for sub-sections
- Use <p>, <ul>, <ol>, <strong> tags appropriately
- Include the keyword "${topic.keyword}" naturally 5-7 times
- Add 2-3 internal links to ${SITE_URL}/calculators/${topic.calculator}/
- Include a "Try Our Free Calculator" CTA section
- Add FAQ section with 4-5 questions using <h3> for questions
- Write in conversational, helpful tone
- Target audience: Indian users (mention rupees, India context where relevant)
- End with strong CTA to use the calculator

Output ONLY the HTML content. No markdown code blocks, no explanations.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
        },
      }),
    });

    const data = await res.json();
    if (!data.candidates || !data.candidates[0]) {
      throw new Error('No content generated: ' + JSON.stringify(data));
    }

    let content = data.candidates[0].content.parts[0].text;
    // Clean up markdown code blocks if present
    content = content.replace(/^```html\s*/i, '').replace(/```\s*$/, '').trim();
    console.log(`✅ Blog generated (${content.length} chars)`);
    return content;
  } catch (err) {
    console.error('❌ Gemini API error:', err.message);
    throw err;
  }
}

// ============================================
// Create HTML page from template
// ============================================
function buildHTML(topic, content) {
  const slug = slugify(topic.title);
  const date = new Date().toISOString().split('T')[0];
  const dateReadable = new Date().toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const description = `${topic.title}. Learn everything about ${topic.keyword} with our complete guide. Use our free online calculator.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic.title} | CalcVerse</title>
<meta name="description" content="${description}">
<meta name="keywords" content="${topic.keyword}, calculator, free online calculator, calcverse">
<link rel="canonical" href="${SITE_URL}/blog/${slug}/">

<!-- Open Graph -->
<meta property="og:title" content="${topic.title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${SITE_URL}/blog/${slug}/">
<meta property="og:type" content="article">
<meta property="article:published_time" content="${date}">

<!-- Schema.org Article -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${topic.title}",
  "description": "${description}",
  "datePublished": "${date}",
  "dateModified": "${date}",
  "author": { "@type": "Organization", "name": "CalcVerse" },
  "publisher": { "@type": "Organization", "name": "CalcVerse", "url": "${SITE_URL}" },
  "mainEntityOfPage": "${SITE_URL}/blog/${slug}/"
}
</script>

<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.7; color: #333; }
h1 { color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px; }
h2 { color: #202124; margin-top: 30px; }
h3 { color: #5f6368; }
a { color: #1a73e8; text-decoration: none; }
a:hover { text-decoration: underline; }
.meta { color: #5f6368; font-size: 14px; margin-bottom: 30px; }
.cta { background: #e8f0fe; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center; }
.cta a { background: #1a73e8; color: white; padding: 12px 24px; border-radius: 6px; display: inline-block; margin-top: 10px; }
.back { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
</style>
</head>
<body>
<nav><a href="/">Home</a> &raquo; <a href="/blog/">Blog</a> &raquo; ${topic.title}</nav>

<article>
<h1>${topic.title}</h1>
<p class="meta">Published on ${dateReadable} | CalcVerse Team</p>

${content}

</article>

<div class="back">
<a href="/blog/">&larr; Back to Blog</a> | <a href="/">Home</a>
</div>
</body>
</html>`;
}

// ============================================
// Save blog file locally (for GitHub Actions to commit)
// ============================================
function saveBlogFile(topic, html) {
  const slug = slugify(topic.title);
  const blogDir = join(process.cwd(), '..', 'blog', slug);

  mkdirSync(blogDir, { recursive: true });
  const filePath = join(blogDir, 'index.html');
  writeFileSync(filePath, html, 'utf8');

  console.log(`✅ Blog saved: ${filePath}`);
  return { slug, filePath, url: `${SITE_URL}/blog/${slug}/` };
}

// ============================================
// Ping IndexNow for the new blog URL
// ============================================
async function pingIndexNow(blogUrl) {
  const urls = [blogUrl, `${SITE_URL}/blog/`, `${SITE_URL}/`];
  const payload = {
    host: 'calc.autoflowa.in',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const results = [];
  for (const endpoint of ['https://api.indexnow.org/IndexNow', 'https://yandex.com/indexnow']) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const service = endpoint.includes('yandex') ? 'Yandex' : 'Bing';
      console.log(`📡 ${service}: ${res.status}`);
      results.push({ service, status: res.status, ok: res.status === 200 || res.status === 202 });
    } catch (err) {
      console.error(`❌ Ping failed:`, err.message);
    }
  }
  return results;
}

// ============================================
// Main execution
// ============================================
async function main() {
  console.log('🚀 CalcVerse Auto-Blog Publisher Starting...');
  console.log(`📅 ${new Date().toISOString()}`);

  // Validate env
  if (!GEMINI_API_KEY) { console.error('❌ GEMINI_API_KEY missing'); process.exit(1); }
  if (!INDEXNOW_KEY) { console.error('❌ INDEXNOW_KEY missing'); process.exit(1); }

  try {
    // 1. Pick topic
    const topic = pickTopic();

    // 2. Generate content with AI
    const content = await generateBlog(topic);

    // 3. Build HTML page
    const html = buildHTML(topic, content);

    // 4. Save file
    const { slug, url } = saveBlogFile(topic, html);

    // 5. Ping IndexNow
    const pings = await pingIndexNow(url);

    // 6. Telegram notification
    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short',
    });
    const pingStatus = pings.map(p => `${p.ok ? '✅' : '❌'} ${p.service}`).join(', ');

    await sendTelegram(`
<b>📝 New Blog Published!</b>
📅 ${timestamp}

<b>📌 Title:</b> ${topic.title}
<b>🔑 Keyword:</b> ${topic.keyword}
<b>🔗 URL:</b> ${url}
<b>📊 Length:</b> ${content.length} chars

<b>📡 IndexNow:</b>
${pingStatus}

Auto-committed to GitHub by Actions.
    `.trim());

    console.log('\n✅ Blog publishing complete!');
    console.log(`🔗 ${url}`);

  } catch (err) {
    console.error('💥 Fatal error:', err);
    await sendTelegram(`❌ <b>Blog Publish FAILED</b>\n\nError: ${err.message}`);
    process.exit(1);
  }
}

main();
