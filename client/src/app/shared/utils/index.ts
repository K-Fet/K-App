import { addWeeks, endOfWeek, startOfDay, startOfWeek } from 'date-fns';
import { DEFAULT_WEEK_SWITCH } from '../../constants';

export function getFirstDayOfNextWeek(): Date {
  const currentWeek = startOfWeek(new Date(), { weekStartsOn: DEFAULT_WEEK_SWITCH });

  return addWeeks(currentWeek, 1);
}

export function getCurrentWeek(): { start: Date, end: Date } {
  return {
    start: startOfWeek(new Date(), { weekStartsOn: DEFAULT_WEEK_SWITCH }),
    // @ts-ignore
    end: startOfDay(endOfWeek(new Date(), { weekStartsOn: DEFAULT_WEEK_SWITCH + 1 })),
  };
}
