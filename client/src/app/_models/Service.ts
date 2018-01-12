export class Service {

        id: number;
        name: string;
        startingDate: Date;
        endingDate: Date;
        nbMax: number;
        categoryId: number;

        constructor(values: Object = {}) {
            Object.assign(this, values);
        }
    }
