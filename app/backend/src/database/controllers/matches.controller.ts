import { Request, Response } from 'express';
import IMatchesBD from '../interfaces/IMatches';
import MatchesService from '../services/matches.service';
import statusCodes from '../statusCodes';

class MatchesController {
  public getAll = async (req: Request, res: Response) => {
    const { inProgress } = req.query;

    let users = await MatchesService.getAll();
    if (inProgress === 'true') users = await MatchesService.getAllProgTrue();
    if (inProgress === 'false') users = await MatchesService.getAllProgFalse();
    return res.status(statusCodes.ok).json(users);
  };

  public finishPathById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await MatchesService.finishPathById(id) as { type: number, message: string };

    return res.status(result.type).json(result.message);
  };

  public updateMatch = async (req: Request, res: Response) => {
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const { id } = req.params;
    const result = await MatchesService.updateMatch(
      id,
      homeTeamGoals,
      awayTeamGoals,
    ) as { type: number, message: string };

    return res.status(result.type).json(result.message);
  };

  public create = async (req: Request, res: Response) => {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals }: IMatchesBD = req.body;
    if (homeTeamId === awayTeamId) {
      return res.status(422).json(
        { message: 'It is not possible to create a match with two equal teams' },
      );
    }
    const match = { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals };
    const result = await MatchesService.create(match) as { type: number, message: string };
    return res.status(result.type).json(result.type !== 201
      ? { message: result.message } : result.message);
  };
}

export default MatchesController;
