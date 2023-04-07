import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as Jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import IUser from '../interfaces/IUser';
import UserModel from '../models/user.model';
import * as schema from './validations/validationsLogin';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'batatinha';

const JWT_CONFIG: SignOptions = {
  algorithm: 'HS256',
  expiresIn: '60m',
};

class UserService {
  static generateToken = (
    payload: IUser,
  ): string => Jwt.sign({ data: payload }, JWT_SECRET, JWT_CONFIG);

  public static async role(token: string): Promise<object> {
    const decoded = Jwt.verify(token, JWT_SECRET) as { data: { email: string } };
    const { email } = decoded.data;
    const user = await UserService.getByEmail(email) as { role: string };
    return { type: 200, message: user.role };
  }

  public static async getByEmail(email: string): Promise<IUser | { message: string }> {
    const users: IUser | null = await UserModel.findOne({ where: { email } });
    if (!users) return { message: 'Email não encontrado' };
    return users;
  }

  public static async login(login: IUser) {
    const { email } = login;
    const error = schema.validateLogin(login);
    if (error.type) return error;

    const user: IUser | null = await UserModel.findOne({ where: { email } });
    const passLocalWithBd = bcrypt.compareSync(String(login.password), String(user?.password));

    if (!user || !passLocalWithBd) {
      return { type: 401, message: { message: 'Invalid email or password' } };
    }

    const token = UserService.generateToken({ email: user.email });
    return { type: 200, message: { token } };
  }
}

export default UserService;
