export interface Registration {
  createdAt: Date;
  year: number;
}

export interface Member {
  _id?: string;
  lastName: string;
  firstName: string;
  school: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  registrations: Registration[];
}
