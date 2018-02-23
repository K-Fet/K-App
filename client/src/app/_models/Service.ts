import { Barman } from './index';

export class Service {

    id: Number;
    name: String;
    startAt: Date;
    endAt: Date;
    nbMax: Number;

    // Association

    barmen: Barman[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
