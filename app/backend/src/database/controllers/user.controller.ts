import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
// import { SignOptions } from 'jsonwebtoken';
import IUser from '../interfaces/IUser';
// import ITeams from '../interfaces/ITeams';
import UserService from '../services/user.service';
// import statusCodes from '../statusCodes';
dotenv.config();
// const JWT_SECRET = process.env.JWT_SECRET || 'batatinha';

// const JWT_CONFIG: SignOptions = {
//   algorithm: 'HS256',
//   expiresIn: '15m',
// };
class UserController {
  // isBodyValid = (username: string, password: string) => username && password;
  // constructor(private userService = new UserService()) { }

  // public create = async (req: Request, res: Response) => {
  //   const user = req.body;

  //   const userCreated = await this.userService.create(user);
  //   res.status(statusCodes.CREATED).json(userCreated);
  // };

  // public getAll = async (_req: Request, res: Response) => {
  //   const users = await this.userService.getAll();
  //   res.status(statusCodes.ok).json(users);
  // };

  // public getById = async (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   const users = await this.userService.getById(id);
  //   res.status(statusCodes.ok).json(users);
  // };

  public getRole = async (req: Request, res: Response) => {
    const token = req.header('Authorization') as string;
    // const response = Jwt.verify(token, JWT_SECRET);
    const user = await UserService.role(token) as { type: number, message: string };

    return res.status(user.type).json({ role: user.message });
    // const { id } = req.params;
    // const users = await this.userService.role(id);
    // res.status(statusCodes.ok).json(users);
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
