import { AssociationChanges, ConnectionInformation, Kommission, Role, Service } from '.';

export class Barman {

  id: number;
  lastName: String;
  firstName: String;
  nickname: String;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  facebook: String;
  dateOfBirth: Date;
  flow: String;
  active: Boolean;

    // Associations

  connection: ConnectionInformation;
  godFather: Barman;
  kommissions: Kommission[];
  roles: Role[];
  services: Service[];

  _embedded: {
    godFather?: number;
    kommissions?: AssociationChanges,
    roles?: AssociationChanges,
  };

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
