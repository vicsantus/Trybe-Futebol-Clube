// import { BadRequestError } from 'restify-errors';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as Jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import IUser from '../interfaces/IUser';
// import ITeams from '../interfaces/users.interface';
// import connection from '../models/connection';
import UserModel from '../models/user.model';
import * as schema from './validations/validationsLogin';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'batatinha';

const JWT_CONFIG: SignOptions = {
  algorithm: 'HS256',
  expiresIn: '15m',
};

const properties = ['email'];

class UserService {
  public model: UserModel = new UserModel();

  static validateProperties(user: IUser): [boolean, string | null] {
    for (let i = 0; i < properties.length; i += 1) {
      if (!Object.prototype.hasOwnProperty.call(user, properties[i])) {
        return [false, properties[i]];
      }
    }
    return [true, null];
  }

  static validateValues(user: IUser): [boolean, string | null] {
    const entries = Object.entries(user);
    for (let i = 0; i < entries.length; i += 1) {
      const [property, value] = entries[i];
      if (!value) {
        return [false, property];
      }
    }
    return [true, null];
  }

  static validationUser(user: IUser): void | string {
    let [valid, property] = UserService.validateProperties(user);

    if (!valid) {
      return `O campo ${property} é obrigatório.`;
    }
    [valid, property] = UserService.validateValues(user);

    if (!valid) {
      return `O campo ${property} não pode ser nulo ou vazio.`;
    }
  }

  static generateToken = (
    payload: IUser,
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
  // private async findByEmail(email: string) {
  //   console.log(this.model);
  //   return UserModel.findOne({ where: { email } });
  // }

  // public async role(autorization: string): Promise<string> {
  //   // console.log(this.model);
  //   const { email } = bcrypt.
  //   const users = await this.findByEmail(email);
  //   return users;
  // }

  // public async getById(id: string): Promise<IUser | { message: string }> {
  //   console.log(this.model);
  //   const users: IUser | null = await UserModel.findByPk(id);
  //   if (!users) return { message: 'Time não encontrado' };
  //   return users;
  // }

  public async login(login: IUser) {
    console.log(this.model?.email);
    const { email } = login;
    const error = schema.validateLogin(login);
    if (error.type) return error;

    const user: IUser | null = await UserModel.findOne({ where: { email } });
    const passLocalWithBd = bcrypt.compareSync(String(login.password), String(user?.password));

    if (!user || !passLocalWithBd) {
      return { type: 401, message: { message: 'Invalid email or password' } };
    }

    // const [{ email }] = users;
    // console.log(result.id);
    const token = UserService.generateToken({ email: user.email });
    return { type: 200, message: { token } };
  }
}

export default UserService;
