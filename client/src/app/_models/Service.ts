import { Category } from './index';

export class Service {

    id: Number;
    name: String;
    startingDate: Date;
    endingDate: Date;
    nbMax: Number;
    categoryId: Number;

    // Association

    category: Category;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
