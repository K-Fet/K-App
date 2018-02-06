import { Category } from './index';

export class Service {

    id: number;
    name: string;
    startingDate: Date;
    endingDate: Date;
    nbMax: number;
    categoryId: number;

    // Association

    category: Category;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
