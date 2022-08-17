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
import {Character, Armor, Weapon, Skill} from '../models';
import {CharacterRepository, WeaponRepository, ArmorRepository, SkillRepository} from '../repositories';

export class UpdateCharacterController {
  constructor(
    @repository(CharacterRepository)
    public characterRepository : CharacterRepository,
    @repository(WeaponRepository)
    public weaponRepository: WeaponRepository,
    @repository(ArmorRepository)
    public armorRepository: ArmorRepository,
    @repository(SkillRepository)
    public skillRepository: SkillRepository,
  ) {}

  @patch('/updatecharacter/{id}/weapon')
  @response(200, {
    description: 'update weapon',
    content: {'application/json': {schema: Weapon}},
  })
  async updateWeapon(
    @param.path.string('id') id: string,
    @requestBody() weapon: Weapon,
  ): Promise<Weapon> {
    //equip new weapon
    let char: Character = await this.characterRepository.findById(id);
    char.attack! += weapon.attack;
    char.defense! += weapon.defense;
  
    //unequip old weapon
    let filter = {where:{"characterId":id}};
    if((await this.weaponRepository.find(filter))[0] != undefined){
      let oldWeapon: Weapon = await this.characterRepository.weapon(id).get();
      char.attack! -= oldWeapon.attack;
      char.defense! -= oldWeapon.defense;
      await this.characterRepository.weapon(id).delete();
    }
    await this.characterRepository.updateById(id, char);
    return await this.characterRepository.weapon(id).create(weapon);
  }

  @patch('/updatecharacter/{id}/armor')
  @response(200, {
    description: 'update armor',
    content: {'application/json': {schema: Armor}},
  })
  async updateArmor(
    @param.path.string('id') id: string,
    @requestBody() armor: Armor,
  ): Promise<Armor> {
    //equip new armor
    let char: Character = await this.characterRepository.findById(id);
    char.attack! += armor.attack;
    char.defense! += armor.defense;

    //unequip old armor
    let filter = {where:{"characterId":id}};
    if((await this.armorRepository.find(filter))[0] != undefined){
      let oldArmor: Armor = await this.characterRepository.armor(id).get();
      char.attack! -= oldArmor.attack;
      char.defense! -= oldArmor.defense;
      await this.characterRepository.armor(id).delete();
    }
    await this.characterRepository.updateById(id, char);
    return await this.characterRepository.armor(id).create(armor);
  }

  @patch('/updatecharacter/{id}/skill')
  @response(200, {
    description: 'update skill',
    content: {'application/json': {schema: Skill}},
  })
  async updateSkill(
    @param.path.string('id') id: string,
    @requestBody() skill: Skill,
  ): Promise<Skill> {
    //equip new skill
    let char: Character = await this.characterRepository.findById(id);

    //unequip old skill
    let filter: Filter = {where:{"characterId":id}};
    await this.characterRepository.updateById(id, char);
    return await this.characterRepository.skill(id).create(skill);
  }

  @del('/characters/{id}')
  @response(204, {
    description: 'Character DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.characterRepository.weapon(id).delete();
    await this.characterRepository.armor(id).delete();
    await this.characterRepository.skill(id).delete();
    
    await this.characterRepository.deleteById(id);
  }
}
/*

  @post('/updatecharacter')
  @response(200, {
    description: 'Character model instance',
    content: {'application/json': {schema: getModelSchemaRef(Character)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Character, {
            title: 'NewCharacter',
            exclude: ['id'],
          }),
        },
      },
    })
    character: Omit<Character, 'id'>,
  ): Promise<Character> {
    return this.characterRepository.create(character);
  }

  @get('/updatecharacter/count')
  @response(200, {
    description: 'Character model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Character) where?: Where<Character>,
  ): Promise<Count> {
    return this.characterRepository.count(where);
  }

  @get('/updatecharacter')
  @response(200, {
    description: 'Array of Character model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Character, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Character) filter?: Filter<Character>,
  ): Promise<Character[]> {
    return this.characterRepository.find(filter);
  }

  @patch('/updatecharacter')
  @response(200, {
    description: 'Character PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Character, {partial: true}),
        },
      },
    })
    character: Character,
    @param.where(Character) where?: Where<Character>,
  ): Promise<Count> {
    return this.characterRepository.updateAll(character, where);
  }

  @get('/updatecharacter/{id}')
  @response(200, {
    description: 'Character model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Character, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Character, {exclude: 'where'}) filter?: FilterExcludingWhere<Character>
  ): Promise<Character> {
    return this.characterRepository.findById(id, filter);
  }

  @patch('/updatecharacter/{id}')
  @response(204, {
    description: 'Character PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Character, {partial: true}),
        },
      },
    })
    character: Character,
  ): Promise<void> {
    await this.characterRepository.updateById(id, character);
  }

  @put('/updatecharacter/{id}')
  @response(204, {
    description: 'Character PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() character: Character,
  ): Promise<void> {
    await this.characterRepository.replaceById(id, character);
  }

  @del('/updatecharacter/{id}')
  @response(204, {
    description: 'Character DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.characterRepository.deleteById(id);
  }
}
*/