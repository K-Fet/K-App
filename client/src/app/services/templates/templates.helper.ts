import { setHours, setISODay, setMinutes } from 'date-fns';
import { TemplateDateUnit } from '../../shared/models';

export function templateDateToDate(val: TemplateDateUnit): Date {
  return setMinutes(setHours(setISODay(new Date(), val.day), val.hours), val.minutes);
}
