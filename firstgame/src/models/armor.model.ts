import {Entity, model, property} from '@loopback/repository';

@model()
export class Armor extends Entity {
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


  constructor(data?: Partial<Armor>) {
    super(data);
  }
}

export interface ArmorRelations {
  // describe navigational properties here
}

export type ArmorWithRelations = Armor & ArmorRelations;
