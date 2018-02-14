import { Barman, SpecialAccount } from './index';

export class ConnectedUser {

    barman: Barman;
    specialAccount: SpecialAccount;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
