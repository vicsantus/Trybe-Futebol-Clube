import { Request, Response } from 'express';
// import ITeams from '../interfaces/ITeams';
import MatchesService from '../services/matches.service';
import statusCodes from '../statusCodes';

class MatchesController {
  constructor(private userService = new MatchesService()) { }

  // public create = async (req: Request, res: Response) => {
  //   const user = req.body;

  //   const userCreated = await this.userService.create(user);
  //   res.status(statusCodes.CREATED).json(userCreated);
  // };

  public getAll = async (req: Request, res: Response) => {
    const { inProgress } = req.query;

    let users = await MatchesService.getAll();
    if (inProgress === 'true') users = await MatchesService.getAllProgTrue();
    if (inProgress === 'false') users = await MatchesService.getAllProgFalse();
    res.status(statusCodes.ok).json(users);
  };

  // public getById = async (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   const users = await this.userService.getById(id);
  //   res.status(statusCodes.ok).json(users);
  // };

  // public login = async (
  //   req: Request<object, object, ITeams>,
  //   res: Response,
  // ) => {
  //   const { body } = req;
  //   const result = await this.userService.login(body);
  //   res.status(result.status).json(result.message);
  // };
}

export default MatchesController;
