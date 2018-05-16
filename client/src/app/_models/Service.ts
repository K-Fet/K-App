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

    isPasted(): Boolean {
        const now = new Date();
        return (this.startAt < now);
    }
}
