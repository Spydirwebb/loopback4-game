import {Entity, model, property} from '@loopback/repository';

@model()
export class Weapon extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
  })
  attack?: number;

  @property({
    type: 'number',
  })
  defense?: number;


  constructor(data?: Partial<Weapon>) {
    super(data);
  }
}

export interface WeaponRelations {
  // describe navigational properties here
}

export type WeaponWithRelations = Weapon & WeaponRelations;
