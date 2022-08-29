import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  model,
  property,
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
  getFilterSchemaFor,
  HttpErrors,
  SchemaObject,
} from '@loopback/rest';
import {Character} from '../models';
import {CharacterRepository} from '../repositories';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import { authenticate } from '@loopback/authentication'
import { PermissionKey } from '../authorization/permission-key';
import {
        TokenService,
        AuthenticationBindings,
} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  User,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt'
import { Getter, inject } from '@loopback/core';
import { MyUserProfile, UserProfileSchema, UserRequestBody } from '../authorization/types';

@model()
export class NewCharacterRequest extends Character {
  @property({
    type: 'string',
    required: true,
  })
  password?: string;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class CharacterController {
  constructor(
    @repository(CharacterRepository)
    public characterRepository : CharacterRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<MyUserProfile>,
  ) {}

  @post('/characters')
  @response(200, {
    description: 'Character model instance',
    //content: {'application/json': {schema: getModelSchemaRef(Character)}},
    content: {'application/json': {schema: {'x-ts-type': Character}}},
  })
  async create(
    //@requestBody(UserRequestBody)
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Character, {
            title: 'NewCharacter',
            
          }),
        },
      },
    })
    character: Character,
  ): Promise<Character> {
      character.permissions = [ PermissionKey.ViewOwnUser,
                                PermissionKey.CreateUser,
                                PermissionKey.UpdateOwnUser,
                                PermissionKey.DeleteOwnUser];
      if (await this.characterRepository.exists(character.email)){
        throw new HttpErrors.BadRequest(`This email already exists`);
      }
      else {
        const savedCharacter = await this.characterRepository.create(character);
        delete savedCharacter.password;
      return savedCharacter;
      };
  }

  @post('/characters/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }
  
  @authenticate('jwt')
  @get('/characters/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  async printCurrentUser(
  ): Promise<MyUserProfile> {
    return this.getCurrentUser();
  }

  /**
   * show current character
   */
  @authenticate('jwt')
  @get('/characters', {
    responses: {
      '200': {
        description: 'Character model instance',
        content: {'application/json': {schema: {'x-ts-type': Character}}},
      },
    },
  })
  async findById(
  ): Promise<Character> {
    const currentUser = await this.getCurrentUser();
    return await this.characterRepository.findById(currentUser.email);
  }

  /**
   * delete current character
   */
  @del('/characters', {
    responses: {
      '204': {
        description: 'Character DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(
  ): Promise<void> {
    const currentUser = await this.getCurrentUser();
    //delete weapon, armor, and skill
    await this.characterRepository.weapon(currentUser.email).delete();
    await this.characterRepository.armor(currentUser.email).delete();
    await this.characterRepository.skill(currentUser.email).delete();
    ///
    await this.characterRepository.deleteById(currentUser.email);
  }
}