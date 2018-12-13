import { addWeeks, endOfWeek, startOfWeek } from 'date-fns';
import { DEFAULT_WEEK_SWITCH } from '../../constants';

export function getFirstDayOfNextWeek(): Date {
  const currentWeek = startOfWeek(new Date(), { weekStartsOn: DEFAULT_WEEK_SWITCH });

  return addWeeks(currentWeek, 1);
}

export function getCurrentWeek(): { start: Date, end: Date } {
  return {
    start: startOfWeek(new Date(), { weekStartsOn: DEFAULT_WEEK_SWITCH }),
    end: endOfWeek(new Date(), { weekStartsOn: DEFAULT_WEEK_SWITCH }),
  };
}
