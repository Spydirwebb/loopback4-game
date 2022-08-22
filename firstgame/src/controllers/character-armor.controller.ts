import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Character,
  Armor,
} from '../models';
import {CharacterRepository} from '../repositories';

export class CharacterArmorController {
  constructor(
    @repository(CharacterRepository) protected characterRepository: CharacterRepository,
  ) { }

  @get('/characters/{id}/armor', {
    responses: {
      '200': {
        description: 'Character has one Armor',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Armor),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Armor>,
  ): Promise<Armor> {
    return this.characterRepository.armor(id).get(filter);
  }

  @post('/characters/{id}/armor', {
    responses: {
      '200': {
        description: 'Character model instance',
        content: {'application/json': {schema: getModelSchemaRef(Armor)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Character.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Armor, {
            title: 'NewArmorInCharacter',
            exclude: ['id'],
            optional: ['characterId']
          }),
        },
      },
    }) armor: Omit<Armor, 'id'>,
  ): Promise<Armor> {
    return this.characterRepository.armor(id).create(armor);
  }

  @patch('/characters/{id}/armor', {
    responses: {
      '200': {
        description: 'Character.Armor PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Armor, {partial: true}),
        },
      },
    })
    armor: Partial<Armor>,
    @param.query.object('where', getWhereSchemaFor(Armor)) where?: Where<Armor>,
  ): Promise<Count> {
    return this.characterRepository.armor(id).patch(armor, where);
  }

  @del('/characters/{id}/armor', {
    responses: {
      '200': {
        description: 'Character.Armor DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Armor)) where?: Where<Armor>,
  ): Promise<Count> {
    return this.characterRepository.armor(id).delete(where);
  }
}
