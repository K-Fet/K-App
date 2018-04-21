import { Service } from './index';
import { Moment } from 'moment';

export class Day {
    name: String;
    date: Moment;
    active: Boolean;
    services: Array<Service>;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
