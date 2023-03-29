import { Request, Response } from 'express';
import IUser from '../interfaces/IUser';
// import ITeams from '../interfaces/ITeams';
import UserService from '../services/user.service';
// import statusCodes from '../statusCodes';

class UserController {
  // isBodyValid = (username: string, password: string) => username && password;
  constructor(private userService = new UserService()) { }

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

  public login = async (
    req: Request<object, object, IUser>,
    res: Response,
  ) => {
    const { body } = req;
    const { email, password }: IUser = body;
    const result = await this.userService.login({ email, password });
    res.status(result.type).json(result.message);
  };
}

export default UserController;
