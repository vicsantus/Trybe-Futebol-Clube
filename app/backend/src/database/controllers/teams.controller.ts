import { Request, Response } from 'express';
import TeamsService from '../services/teams.service';
import statusCodes from '../statusCodes';

class TeamsController {
  public getAll = async (_req: Request, res: Response) => {
    const users = await TeamsService.getAll();
    res.status(statusCodes.ok).json(users);
  };

  public getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const users = await TeamsService.getById(id);
    res.status(statusCodes.ok).json(users);
  };
}

export default TeamsController;
