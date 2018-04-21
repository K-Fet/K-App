import { Barman } from './index';

export class Service {

    id?: Number;
    startAt: Date;
    endAt: Date;
    nbMax: Number;

    // Association

    barmen?: Array<Barman>;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
