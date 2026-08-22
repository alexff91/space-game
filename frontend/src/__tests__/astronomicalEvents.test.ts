/**
 * Календарь астрономических событий 2026.
 *
 * ПОЧЕМУ: даты в списке были выдуманы «на глаз». Проверка 22.08.2026 против
 * первоисточников показала, что 5 дат из 12 неверны — затмение назначено на
 * несуществующий день, противостояния Юпитера и Сатурна сдвинуты на месяцы.
 * Эталонные значения ниже сверены вручную:
 *   - затмения: NASA GSFC eclipse.gsfc.nasa.gov (декадные таблицы 2021-2030)
 *   - метеорные потоки, противостояния, равноденствия: in-the-sky.org/newscal
 * Если дату нельзя подтвердить источником — событию нет места в списке.
 */

import { describe, it, expect } from 'vitest';
import { ASTRONOMICAL_EVENTS } from '@/services/referenceData';

/** Проверено вручную по первоисточникам 22.08.2026. */
const VERIFIED_2026: Record<string, string> = {
  'Quadrantids Meteor Shower': '2026-01-03',
  'Jupiter at Opposition': '2026-01-10',
  'Annular Solar Eclipse': '2026-02-17',
  'Total Lunar Eclipse': '2026-03-03',
  'March Equinox': '2026-03-20',
  'Lyrid Meteor Shower': '2026-04-22',
  'June Solstice': '2026-06-21',
  'Total Solar Eclipse': '2026-08-12',
  'Perseid Meteor Shower': '2026-08-13',
  'Partial Lunar Eclipse': '2026-08-28',
  'Saturn at Opposition': '2026-10-04',
  'Orionid Meteor Shower': '2026-10-21',
  'Uranus at Opposition': '2026-11-25',
  'Geminid Meteor Shower': '2026-12-14',
  'December Solstice': '2026-12-21',
};

describe('даты астрономических событий 2026', () => {
  it.each(Object.entries(VERIFIED_2026))('%s — %s', (title, date) => {
    const event = ASTRONOMICAL_EVENTS.find((e) => e.title === title);
    expect(event, `событие "${title}" отсутствует в календаре`).toBeDefined();
    expect(event!.date).toBe(date);
  });

  it('в календаре нет событий сверх проверенных', () => {
    const unverified = ASTRONOMICAL_EVENTS
      .map((e) => e.title)
      .filter((t) => !(t in VERIFIED_2026));
    expect(unverified).toEqual([]);
  });

  it('у каждого события указан источник, по которому дату можно перепроверить', () => {
    const noSource = ASTRONOMICAL_EVENTS
      .filter((e) => !e.source || !/^https:\/\//.test(e.source))
      .map((e) => e.title);
    expect(noSource).toEqual([]);
  });
});
