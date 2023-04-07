import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
// import { SignOptions } from 'jsonwebtoken';
import IUser from '../interfaces/IUser';
import UserService from '../services/user.service';

dotenv.config();

class UserController {
  public getRole = async (req: Request, res: Response) => {
    const token = req.header('Authorization') as string;
    const user = await UserService.role(token) as { type: number, message: string };

    return res.status(user.type).json({ role: user.message });
  };

  public login = async (
    req: Request<object, object, IUser>,
    res: Response,
  ) => {
    const { body } = req;
    const { email, password }: IUser = body;
    const result = await UserService.login({ email, password });
    res.status(result.type).json(result.message);
  };
}

export default UserController;
