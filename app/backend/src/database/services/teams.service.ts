// import { BadRequestError } from 'restify-errors';
import * as dotenv from 'dotenv';
import * as Jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import ITeams from '../interfaces/ITeams';
// import ITeams from '../interfaces/users.interface';
// import connection from '../models/connection';
import TeamsModel from '../models/teams.model';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'batatinha';

const JWT_CONFIG: SignOptions = {
  algorithm: 'HS256',
  expiresIn: '15m',
};

const properties = ['username', 'vocation', 'level', 'password'];

class TeamsService {
  public model: TeamsModel | undefined;

  // constructor() {
  //   this.model = new TeamsModel();
  // }

  static validateProperties(user: ITeams): [boolean, string | null] {
    for (let i = 0; i < properties.length; i += 1) {
      if (!Object.prototype.hasOwnProperty.call(user, properties[i])) {
        return [false, properties[i]];
      }
    }
    return [true, null];
  }

  static validateValues(user: ITeams): [boolean, string | null] {
    const entries = Object.entries(user);
    for (let i = 0; i < entries.length; i += 1) {
      const [property, value] = entries[i];
      if (!value) {
        return [false, property];
      }
    }
    return [true, null];
  }

  static validationUser(user: ITeams): void | string {
    let [valid, property] = TeamsService.validateProperties(user);

    if (!valid) {
      return `O campo ${property} é obrigatório.`;
    }
    [valid, property] = TeamsService.validateValues(user);

    if (!valid) {
      return `O campo ${property} não pode ser nulo ou vazio.`;
    }
  }

  static generateToken = (
    payload: ITeams,
  ): string => Jwt.sign(payload, JWT_SECRET, JWT_CONFIG);

  // public async create(user: IUser): Promise<{ token: string } | Error> {
  //   const isValidUser = TeamsService.validationUser(user);

  //   if (typeof isValidUser === 'string') {
  //     throw new Error(isValidUser);
  //   }

  //   const { id, teamName } = await TeamsModel.create(user);
  //   console.log(teamName);

  //   const token = TeamsService.generateToken({ id, username, vocation, level });
  //   return { token };
  // }

  public async getAll(): Promise<ITeams[]> {
    console.log(this.model);
    const users: ITeams[] = await TeamsModel.findAll();
    return users;
  }

  // public async login(login: ITeams) {
  //   const { username: usernameFromLogin, password: passwordFromLogin } = login;
  //   if (!usernameFromLogin) return { status: 400, message: { message: '"username" is required' } };
  //   if (!passwordFromLogin) return { status: 400, message: { message: '"password" is required' } };
  //   const users = await this.model.login(login);
  //   if (users.length === 0 || users[0].password !== login.password) {
  //     return { status: 401, message: { message: 'Username or password invalid' } };
  //   }
  //   const [{ id, username, vocation, level }] = users;
  //   // console.log(result.id);
  //   const token = TeamsService.generateToken({ id, username, vocation, level });
  //   return { status: 200, message: { token } };
  // }
}

export default TeamsService;
