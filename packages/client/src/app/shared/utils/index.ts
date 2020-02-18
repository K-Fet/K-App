import { addDays, addWeeks, endOfWeek, startOfDay, startOfWeek } from 'date-fns';
import { DEFAULT_WEEK_SWITCH } from '../../constants';
import { HttpParams } from '@angular/common/http';

export function getFirstDayOfNextWeek(): Date {
  const currentWeek = startOfWeek(new Date(), { weekStartsOn: DEFAULT_WEEK_SWITCH });

  return addWeeks(currentWeek, 1);
}

export function getCurrentWeek(): { start: Date, end: Date } {
  return {
    start: startOfWeek(new Date(), { weekStartsOn: DEFAULT_WEEK_SWITCH }),
    end: startOfDay(addDays(endOfWeek(new Date(), { weekStartsOn: DEFAULT_WEEK_SWITCH }), 1)),
  };
}

export function createHttpParams(params: { [key: string]: string | Date | number | boolean | undefined }): HttpParams {
  return Object
    .entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .reduce((params, [key, value]) => params.set(key, value.toString()), new HttpParams());
}
