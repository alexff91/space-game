/**
 * NASA Astronomy Picture of the Day.
 *
 * ПОЧЕМУ переписано: раньше «галерея NASA» была списком из 17 зашитых ссылок
 * вида apod.nasa.gov/apod/image/2401/Horsehead_Hubble_960.jpg. Проверка
 * 22.08.2026 показала: все 17 отдают 404 — имена файлов были придуманы.
 * Теперь снимки берутся у самого NASA, а если NASA недоступно, сервис
 * возвращает ошибку и страница честно пишет «нет данных». Подставлять
 * что-то своё вместо ответа NASA нельзя: это и было источником вранья.
 */

export const NASA_APOD_ENDPOINT = 'https://api.nasa.gov/planetary/apod';

export interface APODItem {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  copyright?: string;
}

/**
 * DEMO_KEY — публичный ключ NASA из их же документации (api.nasa.gov):
 * лимит порядка 30 запросов в час на IP. Для собственного ключа —
 * VITE_NASA_API_KEY.
 */
export function getNasaApiKey(): string {
  return import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
}

export async function fetchApod(count = 12): Promise<APODItem[]> {
  const url = `${NASA_APOD_ENDPOINT}?api_key=${encodeURIComponent(getNasaApiKey())}&count=${count}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NASA APOD API responded ${response.status}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('NASA APOD API returned an unexpected payload');
  }
  return (data as APODItem[]).filter((item) => item.media_type === 'image');
}
