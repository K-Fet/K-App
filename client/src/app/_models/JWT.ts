export class JWT {

    id: string;

    constructor(obj: JWT) {
        this.id = obj.id;
    }

    static fromJSONArray(array: Array<JWT>): JWT[] {
      return array.map(obj => new JWT(obj));
    }

    static fromJSON(obj: JWT): JWT {
        return new JWT(obj);
    }
}
