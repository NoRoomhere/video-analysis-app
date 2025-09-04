import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';
import NodeCache from 'node-cache';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

const cache = new NodeCache({ stdTTL: 3600 });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Вспомогательные функции ---
function setJobStatus(jobId, status, progress = 0, result = null, error = null) {
  cache.set(jobId, { status, progress, result, error });
}
function getJob(jobId) {
  return cache.get(jobId);
}

// --- Извлечение кадров с помощью ffmpeg ---
async function extractKeyframes(videoPath, jobId) {
  return new Promise((resolve, reject) => {
    const framesDir = `/tmp/frames_${jobId}`;
    fs.mkdirSync(framesDir, { recursive: true });
    // ffmpeg -i input.mp4 -vf fps=1 frames_%03d.png
    ffmpeg(videoPath)
      .setFfmpegPath(ffmpegPath)
      .output(`${framesDir}/frame_%03d.png`)
      .outputOptions(['-vf', 'fps=1'])
      .on('start', () => setJobStatus(jobId, 'processing', 20))
      .on('end', () => {
        // Получаем список кадров
        const files = fs.readdirSync(framesDir)
          .filter(f => f.endsWith('.png'))
          .map(f => path.join(framesDir, f));
        resolve({ framesDir, files });
      })
      .on('error', (err) => reject(err))
      .run();
  });
}

// --- Конвертация кадров в base64 ---
function framesToBase64(files, jobId) {
  const frames = [];
  files.forEach((file, idx) => {
    const data = fs.readFileSync(file);
    const base64 = `data:image/png;base64,${data.toString('base64')}`;
    frames.push({ timestamp: idx + 1, imageBase64: base64 });
    setJobStatus(jobId, 'processing', 30 + Math.floor((idx / files.length) * 40));
  });
  return frames;
}

// --- Промпты для анализа ---
function getFramePrompt(timestamp) {
  return `Анализируй этот кадр из видео (время: ${timestamp} сек):\n\nЗАДАЧИ:\n1. Опиши что происходит на кадре\n2. Определи эмоциональное воздействие\n3. Оцени визуальную привлекательность (1-10)\n4. Предложи улучшения\n\nФОРМАТ ОТВЕТА:\n{\n  "description": "Детальное описание кадра",\n  "emotional_impact": "Какие эмоции вызывает",\n  "visual_appeal": 8,\n  "improvements": ["Улучшение 1", "Улучшение 2"],\n  "attention_grabbing": true/false\n}\n\nЕсли это первые 3 секунды (0-3 сек) - особое внимание к хукам!`;
}
const FULL_VIDEO_PROMPT = `На основе анализа всех кадров видео:\n\n1. ЧТО ПРОИСХОДИТ: Опиши общий сюжет и действия\n2. ТЕМА ВИДЕО: Определи основную тему\n3. ЦЕЛЬ ВИДЕО: Найди цель или предположи её\n\nАНАЛИЗ ПЕРВЫХ 3 СЕКУНД:\n- Есть ли визуально цепляющий элемент?\n- Если нет - предложи 3 хука по теме и цели\n\nАНАЛИЗ СОДЕРЖИМОГО:\n- Что добавить/убрать\n- Где уменьшить паузы\n- Где добавить звуковые эффекты\n- Рекомендации по субтитрам\n- Как лучше донести смысл\n\nХЕШТЕГИ:\n- По теме видео\n- По целевой аудитории\n- По местоположению (если применимо)`;

// --- Анализ кадров через OpenAI Vision ---
async function analyzeFramesWithOpenAI(frames, jobId) {
  const analyses = [];
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    setJobStatus(jobId, 'processing', 70 + Math.floor((i / frames.length) * 20));
    try {
      const prompt = getFramePrompt(frame.timestamp);
      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: frame.imageBase64 } }
            ]
          }
        ],
        max_tokens: 500
      });
      let content = response.choices[0].message.content;
      let analysis = null;
      try {
        analysis = JSON.parse(content);
      } catch {
        // Попробуем найти JSON в тексте
        const match = content.match(/\{[\s\S]*\}/);
        if (match) analysis = JSON.parse(match[0]);
      }
      analyses.push({ ...frame, analysis });
    } catch (err) {
      analyses.push({ ...frame, analysis: { error: err.message || 'Ошибка анализа кадра' } });
    }
  }
  return analyses;
}

// --- Финальный анализ видео ---
async function analyzeFullVideoWithOpenAI(keyframes, jobId) {
  // Собираем краткие описания кадров
  const summary = keyframes.map(kf => `Время: ${kf.timestamp} сек. Описание: ${kf.analysis?.description || ''}`).join('\n');
  const prompt = FULL_VIDEO_PROMPT + '\n\nКраткие описания кадров:\n' + summary;
  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      { role: 'user', content: [{ type: 'text', text: prompt }] }
    ],
    max_tokens: 800
  });
  return response.choices[0].message.content;
}

// --- Netlify handler ---
export async function handler(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod === 'POST') {
    let videoPath;
    
    // Handle file upload from form data
    if (event.body && event.isBase64Encoded) {
      const buffer = Buffer.from(event.body, 'base64');
      videoPath = `/tmp/video_${Date.now()}.mp4`;
      fs.writeFileSync(videoPath, buffer);
    } else if (event.body) {
      // Handle JSON body with base64 video data
      try {
        const body = JSON.parse(event.body);
        if (body.videoData) {
          const buffer = Buffer.from(body.videoData, 'base64');
          videoPath = `/tmp/video_${Date.now()}.mp4`;
          fs.writeFileSync(videoPath, buffer);
        } else {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'No video data provided' })
          };
        }
      } catch (error) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid JSON body' })
        };
      }
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No video data provided' })
      };
    }

    const jobId = uuidv4();
    setJobStatus(jobId, 'queued', 0);
    processVideoAsync(jobId, videoPath);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ jobId })
    };
  }
  if (event.httpMethod === 'GET') {
    // Прогресс или результат
    const jobId = event.queryStringParameters?.jobId || (event.path?.split('/')?.pop());
    const job = getJob(jobId);
    if (!job) {
      return { 
        statusCode: 404, 
        headers,
        body: JSON.stringify({ error: 'Job not found' }) 
      };
    }
    if (event.path && event.path.includes('progress')) {
      return { 
        statusCode: 200, 
        headers,
        body: JSON.stringify({ status: job.status, progress: job.progress, error: job.error }) 
      };
    }
    if (event.path && event.path.includes('results')) {
      if (job.status === 'done') {
        return { 
          statusCode: 200, 
          headers,
          body: JSON.stringify({ result: job.result }) 
        };
      } else {
        return { 
          statusCode: 202, 
          headers,
          body: JSON.stringify({ status: job.status, progress: job.progress }) 
        };
      }
    }
    return { 
      statusCode: 400, 
      headers,
      body: JSON.stringify({ error: 'Invalid request' }) 
    };
  }
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
}

// --- Асинхронная обработка видео ---
async function processVideoAsync(jobId, videoPath) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      setJobStatus(jobId, 'error', 100, null, 'OpenAI API key не задан');
      fs.unlinkSync(videoPath);
      return;
    }
    setJobStatus(jobId, 'processing', 10);
    // 1. Извлечение кадров
    const { framesDir, files } = await extractKeyframes(videoPath, jobId);
    setJobStatus(jobId, 'processing', 30);
    // 2. Конвертация кадров в base64
    const frames = framesToBase64(files, jobId);
    setJobStatus(jobId, 'processing', 60);
    // 3. Анализ кадров через OpenAI
    const keyframes = await analyzeFramesWithOpenAI(frames, jobId);
    setJobStatus(jobId, 'processing', 90);
    // 4. Финальный анализ видео
    const fullAnalysis = await analyzeFullVideoWithOpenAI(keyframes, jobId);
    setJobStatus(jobId, 'done', 100, { keyframes, fullAnalysis });
    // Очистка
    files.forEach(f => fs.unlinkSync(f));
    fs.rmdirSync(framesDir);
    fs.unlinkSync(videoPath);
  } catch (err) {
    setJobStatus(jobId, 'error', 100, null, err.message || 'Ошибка обработки видео');
    try { fs.unlinkSync(videoPath); } catch {}
  }
} 