export interface ServiceTemplateUnit {
  nbMax?: number;

  startDay: number;
  startHours: number;
  startMinutes: number;

  endDay: number;
  endHours: number;
  endMinutes: number;
}

export interface ServicesTemplate {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  services: ServiceTemplateUnit[];
}
