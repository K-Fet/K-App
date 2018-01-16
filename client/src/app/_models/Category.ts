import { Service } from './index';

export class Category {

    id: number;
    name: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
