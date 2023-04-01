import { Request, Response } from 'express';
// import IMatchesBD from '../interfaces/IMatches';
import LeaderboardService from '../services/leaderboard.service';
import LeaderboardPrincipalService from '../services/leaderboardPrincipal.service';
// import ITeams from '../interfaces/ITeams';
import MatchesService from '../services/matches.service';
import statusCodes from '../statusCodes';

class MatchesController {
  constructor(private userService = new MatchesService()) { }

  // public getAll = async (req: Request, res: Response) => {
  //   const { inProgress } = req.query;

  //   let users = await MatchesService.getAll();
  //   if (inProgress === 'true') users = await MatchesService.getAllProgTrue();
  //   if (inProgress === 'false') users = await MatchesService.getAllProgFalse();
  //   return res.status(statusCodes.ok).json(users);
  // };

  // public finishPathById = async (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   const result = await MatchesService.finishPathById(id) as { type: number, message: string };

  //   return res.status(result.type).json(result.message);
  // };

  // public updateMatch = async (req: Request, res: Response) => {
  //   const { homeTeamGoals, awayTeamGoals } = req.body;
  //   const { id } = req.params;
  //   const result = await MatchesService.updateMatch(
  //     id,
  //     homeTeamGoals,
  //     awayTeamGoals,
  //   ) as { type: number, message: string };

  //   return res.status(result.type).json(result.message);
  // };

  // public create = async (req: Request, res: Response) => {
  //   const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals }: IMatchesBD = req.body;
  //   if (homeTeamId === awayTeamId) {
  //     return res.status(422).json(
  //       { message: 'It is not possible to create a match with two equal teams' },
  //     );
  //   }
  //   const match = { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals };
  //   const result = await MatchesService.create(match) as { type: number, message: string };
  //   return res.status(result.type).json(result.type !== 201
  //     ? { message: result.message } : result.message);
  // };

  public getLeaderboardHome = async (_req: Request, res: Response) => {
    const matchesProgFalse = await LeaderboardService.getAllProgFalse();
    const leadboard = await LeaderboardService.homeLeaderboard(matchesProgFalse);
    return res.status(statusCodes.ok).json(leadboard);
  };

  public getLeaderboardAway = async (_req: Request, res: Response) => {
    const matchesProgFalse = await LeaderboardService.getAllProgFalse();
    const leadboard = await LeaderboardService.awayLeaderboard(matchesProgFalse);
    return res.status(statusCodes.ok).json(leadboard);
  };

  public getLeaderboar = async (_req: Request, res: Response) => {
    const matchesProgFalse = await LeaderboardService.getAllProgFalse();
    const leadboardAway = await LeaderboardService.awayLeaderboard(matchesProgFalse);
    const leadboardHome = await LeaderboardService.homeLeaderboard(matchesProgFalse);
    const leadboard = await LeaderboardPrincipalService.leaderboard(leadboardHome, leadboardAway);
    return res.status(statusCodes.ok).json(leadboard);
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
