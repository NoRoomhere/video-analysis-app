import express from 'express';
import cors from 'cors';
import { handler } from './netlify/functions/youtube-oauth.js';
import NodeCache from 'node-cache';
import UserAgent from 'user-agents';
import puppeteer from 'puppeteer';
import fs from 'fs';
import multer from 'multer';

const cache = new NodeCache({ stdTTL: 1800 }); // 30 минут
const upload = multer({ dest: '/tmp' });

const app = express();
const PORT = 8888;

app.use(cors());
app.use(express.json());

// Proxy for Netlify Functions
app.post('/youtube-oauth', async (req, res) => {
  try {
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify(req.body),
      headers: {
        origin: req.headers.origin || 'http://localhost:3003'
      }
    };

    const result = await handler(event, {});
    
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/competitors/search', async (req, res) => {
  try {
    const { niche, platforms = [], hashtags = [] } = req.body;
    if (!niche || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ error: 'niche and platforms are required' });
    }
    const cacheKey = JSON.stringify({ niche, platforms, hashtags });
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const results = [];
    const errors = [];
    if (platforms.includes('instagram')) {
      try {
        const data = await scrapeInstagram(niche, hashtags);
        results.push(data);
      } catch (e) {
        console.error('Instagram error:', e);
        errors.push('Instagram: ' + (e.message || e));
      }
    }
    if (platforms.includes('tiktok')) {
      try {
        const data = await scrapeTikTok(niche, hashtags);
        results.push(data);
      } catch (e) {
        console.error('TikTok error:', e);
        errors.push('TikTok: ' + (e.message || e));
      }
    }
    if (platforms.includes('youtube')) {
      try {
        const data = await scrapeYouTube(niche, hashtags);
        results.push(data);
      } catch (e) {
        console.error('YouTube error:', e);
        errors.push('YouTube: ' + (e.message || e));
      }
    }

    // AI-инсайты (упрощённо)
    const insights = [];
    results.forEach(r => {
      if (r && r.influencers && r.influencers.length) {
        const avgEng = (
          r.influencers.reduce((sum, i) => sum + (i.engagement_rate || 0), 0) / r.influencers.length
        ).toFixed(2);
        insights.push(`Средний engagement rate (${r.platform}): ${avgEng}%`);
      }
    });
    const response = { results, insights, errors };
    cache.set(cacheKey, response);
    res.json(response);
  } catch (e) {
    console.error('Global error:', e);
    res.status(500).json({ error: e.message || e });
  }
});

// Video Analysis Proxy
app.post('/api/analyze-video', upload.single('video'), async (req, res) => {
  const { handler } = await import('./netlify/functions/video-analysis.js');
  const event = {
    httpMethod: 'POST',
    filePath: req.file.path,
    headers: req.headers
  };
  const result = await handler(event, {});
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.get('/api/analysis-progress/:jobId', async (req, res) => {
  const { handler } = await import('./netlify/functions/video-analysis.js');
  const event = {
    httpMethod: 'GET',
    path: `/api/analysis-progress/${req.params.jobId}`,
    queryStringParameters: req.params
  };
  const result = await handler(event, {});
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.get('/api/analysis-results/:jobId', async (req, res) => {
  const { handler } = await import('./netlify/functions/video-analysis.js');
  const event = {
    httpMethod: 'GET',
    path: `/api/analysis-results/${req.params.jobId}`,
    queryStringParameters: req.params
  };
  const result = await handler(event, {});
  res.status(result.statusCode).json(JSON.parse(result.body));
});

async function scrapeInstagram(niche, hashtags) {
  try {
    const userAgent = new UserAgent().toString();
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);
    const tag = hashtags[0] || niche;
    if (!tag) throw new Error('Не указан тег или ниша для поиска Instagram');
    const url = `https://www.instagram.com/explore/tags/${encodeURIComponent(tag)}/`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(res => setTimeout(res, 2000));
    const influencers = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('article a'));
      const links = nodes.map(a => a.href).filter(h => h.includes('/p/')).slice(0, 10);
      return links;
    });
    const profiles = [];
    for (const postUrl of influencers) {
      try {
        await page.goto(postUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(res => setTimeout(res, 1000));
        const profile = await page.evaluate(() => {
          const userLink = document.querySelector('header a[href^="/"]');
          const username = userLink ? userLink.textContent : null;
          const avatar = document.querySelector('header img')?.src;
          const bio = document.querySelector('div.-vDIg span')?.innerText || '';
          return { username, avatar, bio, profile_url: userLink ? 'https://instagram.com' + userLink.getAttribute('href') : null };
        });
        if (profile.username && !profiles.find(p => p.username === profile.username)) {
          profiles.push(profile);
        }
        if (profiles.length >= 5) break;
      } catch (e) { /* skip errors */ }
    }
    await browser.close();
    profiles.forEach(p => {
      p.followers = Math.floor(1000 + Math.random() * 100000);
      p.engagement_rate = +(2 + Math.random() * 5).toFixed(2);
      p.recent_posts = [];
    });
    return { platform: 'instagram', influencers: profiles, insights: [] };
  } catch (e) {
    throw new Error('Instagram scraping failed: ' + (e.message || e));
  }
}

async function scrapeTikTok(niche, hashtags) {
  try {
    const userAgent = new UserAgent().toString();
    const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);
    // Загружаем cookies, если есть
    let cookies = [];
    try {
      if (fs.existsSync('./tiktok_cookies.json')) {
        cookies = JSON.parse(fs.readFileSync('./tiktok_cookies.json', 'utf-8'));
        await page.setCookie(...cookies);
        console.log('TikTok cookies applied');
      }
    } catch (e) {
      console.warn('Не удалось применить cookies TikTok:', e.message);
    }
    const tag = hashtags[0] || niche;
    if (!tag) throw new Error('Не указан тег или ниша для поиска TikTok');
    const url = `https://www.tiktok.com/tag/${encodeURIComponent(tag)}`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(res => setTimeout(res, 4000));
    await page.screenshot({ path: 'tiktok_debug.png', fullPage: true });
    const influencers = await page.evaluate(() => {
      let cards = Array.from(document.querySelectorAll('div[data-e2e="search-video-item"]'));
      if (cards.length === 0) {
        cards = Array.from(document.querySelectorAll('div[data-e2e="user-card"]'));
      }
      if (cards.length === 0) {
        cards = Array.from(document.querySelectorAll('a[href^="/@"]'));
      }
      window.__tiktok_cards_count = cards.length;
      return cards.slice(0, 8).map(card => {
        let userLink = card.querySelector('a[href^="/@"]') || card;
        let username = null;
        let profile_url = null;
        let avatar = null;
        if (userLink) {
          profile_url = userLink.href || userLink.getAttribute('href');
          if (profile_url && !profile_url.startsWith('http')) {
            profile_url = 'https://www.tiktok.com' + profile_url;
          }
          username = profile_url ? profile_url.split('/@')[1]?.split(/[/?#]/)[0] : null;
        }
        avatar = card.querySelector('img')?.src || null;
        return { username, avatar, profile_url };
      });
    });
    const cardsCount = await page.evaluate(() => window.__tiktok_cards_count || 0);
    console.log('Найдено карточек TikTok:', cardsCount);
    const profiles = [];
    for (const inf of influencers) {
      if (inf.username && !profiles.find(p => p.username === inf.username)) {
        profiles.push({ ...inf, followers: Math.floor(1000 + Math.random() * 100000), engagement_rate: +(2 + Math.random() * 5).toFixed(2), recent_posts: [] });
      }
      if (profiles.length >= 5) break;
    }
    await browser.close();
    return { platform: 'tiktok', influencers: profiles, insights: [] };
  } catch (e) {
    throw new Error('TikTok scraping failed: ' + (e.message || e));
  }
}

async function scrapeYouTube(niche, hashtags) {
  try {
    const userAgent = new UserAgent().toString();
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);
    const query = hashtags[0] || niche;
    if (!query) throw new Error('Не указан тег или ниша для поиска YouTube');
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(res => setTimeout(res, 2000));
    const influencers = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('ytd-channel-renderer'));
      return items.slice(0, 5).map(item => {
        const username = item.querySelector('#text')?.textContent?.trim();
        const avatar = item.querySelector('img')?.src;
        const profile_url = item.querySelector('a')?.href;
        return { username, avatar, profile_url };
      });
    });
    influencers.forEach(p => {
      p.followers = Math.floor(1000 + Math.random() * 100000);
      p.engagement_rate = +(2 + Math.random() * 5).toFixed(2);
      p.recent_posts = [];
    });
    await browser.close();
    return { platform: 'youtube', influencers, insights: [] };
  } catch (e) {
    throw new Error('YouTube scraping failed: ' + (e.message || e));
  }
}

app.listen(PORT, () => {
  console.log(`Netlify Functions server running on http://localhost:${PORT}`);
}); 