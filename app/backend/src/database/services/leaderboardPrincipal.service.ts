import { ILeaderboardMaked } from '../interfaces/IMatches';
import LeaderboardService from './leaderboard.service';

class LeaderboardPrincipalService extends LeaderboardService {
  private static principalTotalPoints(team: ILeaderboardMaked, ldb: ILeaderboardMaked[]) {
    return ldb.reduce((acc, cur) => (cur.name === team.name
      ? cur.totalPoints + team.totalPoints : acc), 0);
  }

  private static principalTotalGames(team: ILeaderboardMaked, ldb: ILeaderboardMaked[]) {
    return ldb.reduce((acc, cur) => (cur.name === team.name
      ? cur.totalGames + team.totalGames : acc), 0);
  }

  private static principalTotalVictories(team: ILeaderboardMaked, ldb: ILeaderboardMaked[]) {
    return ldb.reduce((acc, cur) => (cur.name === team.name
      ? cur.totalVictories + team.totalVictories : acc), 0);
  }

  private static principalTotalDraws(team: ILeaderboardMaked, ldb: ILeaderboardMaked[]) {
    return ldb.reduce((acc, cur) => (cur.name === team.name
      ? cur.totalDraws + team.totalDraws : acc), 0);
  }

  private static principalTotalLosses(team: ILeaderboardMaked, ldb: ILeaderboardMaked[]) {
    return ldb.reduce((acc, cur) => (cur.name === team.name
      ? cur.totalLosses + team.totalLosses : acc), 0);
  }

  private static principalGoalsFavor(team: ILeaderboardMaked, ldb: ILeaderboardMaked[]) {
    return ldb.reduce((acc, cur) => (cur.name === team.name
      ? cur.goalsFavor + team.goalsFavor : acc), 0);
  }

  private static principalGoalsOwn(team: ILeaderboardMaked, ldb: ILeaderboardMaked[]) {
    return ldb.reduce((acc, cur) => (cur.name === team.name
      ? cur.goalsOwn + team.goalsOwn : acc), 0);
  }

  private static principalGoalsBalance(team: ILeaderboardMaked, ldb: ILeaderboardMaked[]) {
    return ldb.reduce((acc, cur) => (cur.name === team.name
      ? cur.goalsBalance + team.goalsBalance : acc), 0);
  }

  public static makeLeaderboard(
    leaderboard1: ILeaderboardMaked[],
    leaderboard2: ILeaderboardMaked[],
  ) {
    return leaderboard1.map((team) => ({
      name: team.name,
      totalPoints: LeaderboardPrincipalService.principalTotalPoints(team, leaderboard2),
      totalGames: LeaderboardPrincipalService.principalTotalGames(team, leaderboard2),
      totalVictories: LeaderboardPrincipalService.principalTotalVictories(team, leaderboard2),
      totalDraws: LeaderboardPrincipalService.principalTotalDraws(team, leaderboard2),
      totalLosses: LeaderboardPrincipalService.principalTotalLosses(team, leaderboard2),
      goalsFavor: LeaderboardPrincipalService.principalGoalsFavor(team, leaderboard2),
      goalsOwn: LeaderboardPrincipalService.principalGoalsOwn(team, leaderboard2),
      goalsBalance: LeaderboardPrincipalService.principalGoalsBalance(team, leaderboard2),
      efficiency: team.efficiency,
    }));
  }

  public static async leaderboard(
    leaderboard1: ILeaderboardMaked[],
    leaderboard2: ILeaderboardMaked[],
  ) {
    const leaderboard = LeaderboardPrincipalService.makeLeaderboard(leaderboard1, leaderboard2);
    const newLeaderboard = leaderboard.map((team) => ({
      ...team,
      efficiency: Number(((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2)),
    }));
    return LeaderboardService
      .sortLeaderboard(LeaderboardService.sortByPoints(newLeaderboard));
  }
}

export default LeaderboardPrincipalService;
