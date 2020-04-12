import { setHours, setISODay, setMinutes } from 'date-fns';
import { ServiceTemplateUnit } from '../../shared/models';

export function templateDateToDate(val: ServiceTemplateUnit): { startAt: Date; endAt: Date } {
  return {
    startAt: setMinutes(setHours(setISODay(new Date(), val.startDay), val.startHours), val.startMinutes),
    endAt: setMinutes(setHours(setISODay(new Date(), val.endDay), val.endHours), val.endMinutes),
  };
}

export function getUnitFromControls(controls): ServiceTemplateUnit {
  return {
    nbMax: controls.nbMaxFormControl.value,
    startDay: controls.startDayFormControl.value,
    startHours: controls.startFormControl.value.split(':')[0],
    startMinutes: controls.startFormControl.value.split(':')[1],
    endDay: controls.endDayFormControl.value,
    endHours: controls.endFormControl.value.split(':')[0],
    endMinutes: controls.endFormControl.value.split(':')[1],
  };
}
