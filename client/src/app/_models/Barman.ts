import { AssociationChanges, ConnectionInformation, Kommission, Role, Service } from '.';

export class Barman {

  id: number;
  lastName: string;
  firstName: string;
  nickname: string;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  facebook: string;
  dateOfBirth: Date;
  flow: string;
  leaveAt: Date;

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
