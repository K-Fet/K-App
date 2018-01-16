export class Kommission {

    id: number;
    name: string;
    description: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
