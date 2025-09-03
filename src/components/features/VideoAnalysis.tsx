import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Video as VideoIcon, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = '/api/analyze-video';
const PROGRESS_URL = '/api/analysis-progress/';
const RESULT_URL = '/api/analysis-results/';

const steps = [
  'Извлечение кадров...',
  'Анализ содержимого...',
  'Генерация рекомендаций...'
];

// --- helpers ---
function parseFullAnalysis(fullAnalysis: any): any {
  // Пытаемся распарсить JSON из ответа OpenAI, иначе возвращаем текст
  if (!fullAnalysis) return {};
  try {
    if (typeof fullAnalysis === 'object') return fullAnalysis;
    const match = fullAnalysis.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return { text: fullAnalysis };
  } catch {
    return { text: fullAnalysis };
  }
}

const VideoAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [info, setInfo] = useState<any>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [step, setStep] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Drag & drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setInfo({
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
      type: f.type
    });
    setResult(null);
    setError(null);
    setStatus('idle');
  };
  const handleBrowse = () => inputRef.current?.click();

  // Upload & analyze
  const handleAnalyze = async () => {
    if (!file) return;
    setStatus('uploading');
    setProgress(0);
    setStep(0);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('video', file);
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });
      let data;
      try {
        data = await res.json();
      } catch (e) {
        setError('Server returned invalid JSON. Please try again later.');
        setStatus('error');
        return;
      }
      if (!res.ok) {
        setError(data?.error || 'Upload failed');
        setStatus('error');
        return;
      }
      if (!data?.jobId) {
        setError('No jobId returned from server');
        setStatus('error');
        return;
      }
      setJobId(data.jobId);
      setStatus('processing');
      pollProgress(data.jobId);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
      setStatus('error');
    }
  };

  // Poll progress
  const pollProgress = async (jobId: string) => {
    let done = false;
    while (!done) {
      await new Promise(r => setTimeout(r, 1200));
      const res = await fetch(PROGRESS_URL + jobId);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setStatus('error');
        return;
      }
      setProgress(data.progress);
      setStep(Math.floor((data.progress / 100) * steps.length));
      if (data.status === 'done') {
        done = true;
        fetchResult(jobId);
      }
      if (data.status === 'error') {
        setError(data.error || 'Ошибка анализа');
        setStatus('error');
        return;
      }
    }
  };

  // Fetch result
  const fetchResult = async (jobId: string) => {
    const res = await fetch(RESULT_URL + jobId);
    const data = await res.json();
    setResult(data.result);
    setStatus('done');
  };

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <VideoIcon className="w-7 h-7 text-blue-500" /> Анализ видео
        </h1>
        {/* Drag & Drop */}
        <div
          className="border-2 border-dashed border-blue-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 mb-6"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={handleBrowse}
        >
          <Upload className="w-10 h-10 text-blue-400 mb-2" />
          <p className="text-blue-700 font-semibold">Перетащите видео или кликните для выбора</p>
          <input
            type="file"
            accept="video/mp4,video/avi,video/mov,video/mkv"
            className="hidden"
            ref={inputRef}
            onChange={e => e.target.files && handleFile(e.target.files[0])}
          />
              </div>
        {/* Preview & Info */}
        {file && (
          <div className="mb-6 flex gap-4 items-center">
            {preview && (
              <video src={preview} controls className="w-40 rounded-lg shadow" />
            )}
            <div>
              <div className="font-medium">{info?.name}</div>
              <div className="text-sm text-gray-500">{info?.size} | {info?.type}</div>
                        </div>
                      </div>
                    )}
        {/* Analyze Button */}
        {file && status === 'idle' && (
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition mb-4"
            onClick={handleAnalyze}
          >
            Начать анализ
          </button>
        )}
        {/* Progress Bar */}
        {status === 'uploading' && (
          <div className="mb-4 text-blue-600">Загрузка видео...</div>
        )}
        {status === 'processing' && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-700 font-semibold">{steps[step] || steps[0]}</span>
              <span className="text-gray-500">({progress}%)</span>
                    </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
                  </div>
                </div>
        )}
        {/* Error */}
        {status === 'error' && (
          <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
                </div>
              )}
        {/* Result */}
        {status === 'done' && result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <div className="flex items-center gap-2 mb-4 text-green-600">
              <CheckCircle className="w-6 h-6" /> Анализ завершён!
            </div>
            {/* Новый красивый вывод */}
            {((): JSX.Element => {
              const parsed = parseFullAnalysis(result.fullAnalysis);
              return (
                <div className="video-analysis-results space-y-8">
                  {/* Общая информация */}
                  <section className="video-overview">
                    <h2 className="text-xl font-bold mb-2">Общий анализ видео</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="card bg-blue-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-1">Что происходит</h3>
                        <p>{parsed.whatHappening || parsed['ЧТО ПРОИСХОДИТ'] || parsed.text}</p>
                  </div>
                      <div className="card bg-purple-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-1">Тема видео</h3>
                        <p>{parsed.videoTopic || parsed['ТЕМА ВИДЕО']}</p>
                </div>
                      <div className="card bg-green-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-1">Цель видео</h3>
                        <p>{parsed.videoGoal || parsed['ЦЕЛЬ ВИДЕО']}</p>
              </div>
                </div>
                  </section>

                  {/* Анализ хуков */}
                  <section className="hook-analysis">
                    <h2 className="text-xl font-bold mb-2">Анализ первых 3 секунд</h2>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p>{parsed.first3seconds || parsed['АНАЛИЗ ПЕРВЫХ 3 СЕКУНД']}</p>
                      {parsed.suggestedHooks || parsed['хуки'] ? (
                        <div className="hook-suggestions mt-2">
                          <h3 className="font-semibold">🎯 Предлагаемые хуки:</h3>
                          <ul className="list-disc ml-6">
                            {((parsed.suggestedHooks || parsed['хуки']) as any[]).map((hook: any, i: number) => (
                              <li key={i}>{hook}</li>
                    ))}
                  </ul>
                </div>
                      ) : null}
                </div>
                  </section>

                  {/* Рекомендации по контенту */}
                  <section className="content-improvements">
                    <h2 className="text-xl font-bold mb-2">Рекомендации по улучшению</h2>
                    <div className="timeline space-y-2">
                      {((parsed.improvements || parsed['АНАЛИЗ СОДЕРЖИМОГО']) as any[]).map((imp: any, i: number) => (
                        <div className="improvement-item flex gap-2 items-center" key={i}>
                          <span className="timestamp text-xs text-gray-500">{imp.timestamp || ''}</span>
                          <span className="type text-xs bg-blue-100 rounded px-2 py-0.5">{imp.type || ''}</span>
                          <p className="ml-2">{imp.suggestion || imp}</p>
                  </div>
                      ))}
                </div>
                  </section>

                  {/* Хештеги */}
                  <section className="hashtag-suggestions">
                    <h2 className="text-xl font-bold mb-2">Рекомендуемые хештеги</h2>
                    <div className="hashtag-categories flex flex-wrap gap-6">
                      <div className="category">
                        <h3 className="font-semibold mb-1">По теме</h3>
                        <div className="hashtags flex flex-wrap gap-2">
                          {((parsed.topicBased || parsed['ХЕШТЕГИ']) as any[]).map((tag: any, i: number) => (
                            <span className="hashtag bg-blue-100 rounded px-2" key={i}>{tag}</span>
                          ))}
                </div>
                </div>
                      <div className="category">
                        <h3 className="font-semibold mb-1">По местоположению</h3>
                        <div className="hashtags flex flex-wrap gap-2">
                          {((parsed.locationBased || []) as any[]).map((tag: any, i: number) => (
                            <span className="hashtag bg-green-100 rounded px-2" key={i}>{tag}</span>
                          ))}
                </div>
                </div>
                      <div className="category">
                        <h3 className="font-semibold mb-1">По целевой аудитории</h3>
                        <div className="hashtags flex flex-wrap gap-2">
                          {((parsed.targetAudience || []) as any[]).map((tag: any, i: number) => (
                            <span className="hashtag bg-purple-100 rounded px-2" key={i}>{tag}</span>
                          ))}
                </div>
            </div>
                      </div>
                  </section>

                  {/* Кадры и их анализ */}
                  <section className="keyframes-analysis">
                    <h2 className="text-xl font-bold mb-2">Ключевые кадры и их анализ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(result.keyframes as any[] | undefined)?.map((kf: any, i: number) => (
                        <div key={i} className="bg-white rounded-lg shadow p-3 flex gap-3 items-start">
                          <img src={kf.imageBase64} alt={`Кадр ${kf.timestamp}`} className="w-24 h-16 object-cover rounded" />
                          <div>
                            <div className="text-xs text-gray-500 mb-1">{kf.timestamp} сек</div>
                            <div className="text-sm font-semibold mb-1">{kf.analysis?.description}</div>
                            <div className="text-xs text-gray-600 mb-1">Эмоции: {kf.analysis?.emotional_impact}</div>
                            <div className="text-xs text-gray-600 mb-1">Визуальная привлекательность: {kf.analysis?.visual_appeal}</div>
                            <div className="text-xs text-gray-600 mb-1">Внимание: {kf.analysis?.attention_grabbing ? 'Да' : 'Нет'}</div>
                            <div className="text-xs text-gray-600">Улучшения: {(kf.analysis?.improvements || []).join(', ')}</div>
              </div>
                </div>
                      ))}
              </div>
                  </section>
              </div>
              );
            })()}
          </motion.div>
        )}
                        </div>
    </div>
  );
};

export default VideoAnalysis;