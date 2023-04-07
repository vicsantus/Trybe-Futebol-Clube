import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboard.service';
import LeaderboardPrincipalService from '../services/leaderboardPrincipal.service';
import statusCodes from '../statusCodes';

class MatchesController {
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
}

export default MatchesController;
