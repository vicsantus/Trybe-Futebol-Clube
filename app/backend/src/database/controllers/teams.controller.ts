import { Request, Response } from 'express';
// import ITeams from '../interfaces/ITeams';
import TeamsService from '../services/teams.service';
import statusCodes from '../statusCodes';

class UserController {
  constructor(private userService = new TeamsService()) { }

  // public create = async (req: Request, res: Response) => {
  //   const user = req.body;

  //   const userCreated = await this.userService.create(user);
  //   res.status(statusCodes.CREATED).json(userCreated);
  // };

  public getAll = async (_req: Request, res: Response) => {
    const users = await this.userService.getAll();
    res.status(statusCodes.ok).json(users);
  };

  // public login = async (
  //   req: Request<object, object, ITeams>,
  //   res: Response,
  // ) => {
  //   const { body } = req;
  //   const result = await this.userService.login(body);
  //   res.status(result.status).json(result.message);
  // };
}

export default UserController;
