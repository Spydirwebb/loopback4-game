import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Armor, Character} from '../models';
import {ArmorRepository} from '../repositories';

export class ArmorController {
  constructor(
    @repository(ArmorRepository)
    public armorRepository : ArmorRepository,
  ) {}

  @post('/armors')
  @response(200, {
    description: 'Armor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Armor)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Armor, {
            title: 'NewArmor',
            exclude: ['id'],
          }),
        },
      },
    })
    armor: Omit<Armor, 'id'>,
  ): Promise<Armor> {
    return this.armorRepository.create(armor);
  }

  @get('/armors/count')
  @response(200, {
    description: 'Armor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Armor) where?: Where<Armor>,
  ): Promise<Count> {
    return this.armorRepository.count(where);
  }

  @get('/armors')
  @response(200, {
    description: 'Array of Armor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Armor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Armor) filter?: Filter<Armor>,
  ): Promise<Armor[]> {
    return this.armorRepository.find(filter);
  }

  @patch('/armors')
  @response(200, {
    description: 'Armor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Armor, {partial: true}),
        },
      },
    })
    armor: Armor,
    @param.where(Armor) where?: Where<Armor>,
  ): Promise<Count> {
    return this.armorRepository.updateAll(armor, where);
  }

  @get('/armors/{id}')
  @response(200, {
    description: 'Armor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Armor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Armor, {exclude: 'where'}) filter?: FilterExcludingWhere<Armor>
  ): Promise<Armor> {
    return this.armorRepository.findById(id, filter);
  }

  @patch('/armors/{id}')
  @response(204, {
    description: 'Armor PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Armor, {partial: true}),
        },
      },
    })
    armor: Armor,
  ): Promise<void> {
    await this.armorRepository.updateById(id, armor);
  }

  @put('/armors/{id}')
  @response(204, {
    description: 'Armor PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() armor: Armor,
  ): Promise<void> {
    await this.armorRepository.replaceById(id, armor);
  }

  @del('/armors/{id}')
  @response(204, {
    description: 'Armor DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.armorRepository.deleteById(id);
  }

  @get('/armors/{id}/character', {
    responses: {
      '200': {
        description: 'Character belonging to Armor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Character)},
          },
        },
      },
    },
  })
  async getCharacter(
    @param.path.string('id') id: typeof Armor.prototype.id,
  ): Promise<Character> {
    return this.armorRepository.character(id);
  }
}
