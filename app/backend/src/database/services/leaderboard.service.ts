import { ILeaderboard, ILeaderboardMaked } from '../interfaces/IMatches';

import MatchesModel from '../models/matches.model';
import TeamsModel from '../models/teams.model';
// import * as schema from './validations/validationsMatches';

// import leadTest from './lead';

class LeaderboardService {
  // public static async getAll(): Promise<IMatchesBD[]> {
  //   const allMatches: IMatchesBD[] = await MatchesModel.findAll({
  //     include: [
  //       { model: TeamsModel, as: 'homeTeam', attributes: ['teamName'] },
  //       { model: TeamsModel, as: 'awayTeam', attributes: ['teamName'] },
  //     ],
  //   });
  //   return allMatches;
  // }

  // public static async getAllProgTrue(): Promise<IMatchesBD[]> {
  //   const allMatches: IMatchesBD[] = await MatchesModel.findAll({
  //     include: [
  //       { model: TeamsModel, as: 'homeTeam', attributes: ['teamName'] },
  //       { model: TeamsModel, as: 'awayTeam', attributes: ['teamName'] },
  //     ],
  //     where: { inProgress: true },
  //   });
  //   return allMatches;
  // }

  public static async getAllProgFalse(): Promise<ILeaderboard[]> {
    const allMatches: ILeaderboard[] = await MatchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: ['teamName'] },
        { model: TeamsModel, as: 'awayTeam', attributes: ['teamName'] },
      ],
      where: { inProgress: false },
    }) as [];

    return allMatches;
  }

  // public static async finishPathById(id: string): Promise<object> {
  //   const error = schema.validateId(id);
  //   if (error.type) return error;

  //   await MatchesModel.update(
  //     { inProgress: false },
  //     { where: { id } },
  //   );

  //   return { type: 200, message: { message: 'Finished' } };
  // }

  // public static async updateMatch(id: string, home: number, away: number): Promise<object> {
  //   const error = schema.validateId(id);
  //   if (error.type) return error;

  //   await MatchesModel.update(
  //     { homeTeamGoals: home, awayTeamGoals: away },
  //     { where: { id } },
  //   );

  //   return { type: 200, message: { message: 'Finished' } };
  // }

  // public static async create(match: IMatchesBD): Promise<object> {
  //   const homeTeam = await TeamsModel.findByPk(match.homeTeamId);
  //   const awayTeam = await TeamsModel.findByPk(match.awayTeamId);
  //   if (!homeTeam || !awayTeam) {
  //     return { type: 404, message: 'There is no team with such id!' };
  //   }
  //   const teamCreated = await MatchesModel.create({
  //     homeTeamId: match.homeTeamId,
  //     awayTeamId: match.awayTeamId,
  //     homeTeamGoals: match.homeTeamGoals,
  //     awayTeamGoals: match.awayTeamGoals,
  //     inProgress: true });

  //   return { type: 201, message: teamCreated };
  // }

  private static makeFilterTeam(team: ILeaderboard, allProgTrue: ILeaderboard[]) {
    return allProgTrue.filter((t) => (t.homeTeamId === team.homeTeamId));
  }

  private static makeTotalPoints(team: ILeaderboard, allProgTrue: ILeaderboard[]) {
    const leadFiltered = LeaderboardService.makeFilterTeam(team, allProgTrue);
    const total = leadFiltered
      .reduce((acc, cur) => {
        if (cur.homeTeamGoals > cur.awayTeamGoals) return acc + 3;
        if (cur.homeTeamGoals === cur.awayTeamGoals) return acc + 1;
        return acc;
      }, 0);
    return total;
  }

  private static makeTotalVictories(team: ILeaderboard, allProgTrue: ILeaderboard[]) {
    return allProgTrue.filter((t) => (t.homeTeamId === team.homeTeamId
      && t.homeTeamGoals > t.awayTeamGoals)).length;
  }

  private static makeTotalDraws(team: ILeaderboard, allProgTrue: ILeaderboard[]) {
    const leadFiltered = LeaderboardService.makeFilterTeam(team, allProgTrue);
    return leadFiltered
      .filter((t) => t.homeTeamGoals === t.awayTeamGoals).length;
  }

  private static makeTotalLosses(team: ILeaderboard, allProgTrue: ILeaderboard[]) {
    const leadFiltered = LeaderboardService.makeFilterTeam(team, allProgTrue);
    return leadFiltered
      .filter((t) => t.homeTeamGoals < t.awayTeamGoals).length;
  }

  private static makeGoalsFavor(team: ILeaderboard, allProgTrue: ILeaderboard[]) {
    const leadFiltered = LeaderboardService.makeFilterTeam(team, allProgTrue);
    return leadFiltered
      .reduce((acc, cur) => cur.homeTeamGoals + acc, 0);
  }

  private static makeGoalsOwn(team: ILeaderboard, allProgTrue: ILeaderboard[]) {
    const leadFiltered = LeaderboardService.makeFilterTeam(team, allProgTrue);
    return leadFiltered
      .reduce((acc, cur) => cur.awayTeamGoals + acc, 0);
  }

  private static makeGoalsBalance(team: ILeaderboard, allProgTrue: ILeaderboard[]) {
    const goalFavor = LeaderboardService.makeGoalsFavor(team, allProgTrue);
    const goalsOwn = LeaderboardService.makeGoalsOwn(team, allProgTrue);
    return goalFavor - goalsOwn;
  }

  private static makeEfficiency(team: ILeaderboard, allProgTrue: ILeaderboard[]) {
    const totalPt = LeaderboardService.makeTotalPoints(team, allProgTrue);
    const filterTeam = LeaderboardService.makeFilterTeam(team, allProgTrue);
    return Number(((totalPt / (filterTeam.length * 3)) * 100).toFixed(2));
  }

  private static makeTotalGames(team: ILeaderboard, allProgTrue: ILeaderboard[]) {
    const filterTeam = LeaderboardService.makeFilterTeam(team, allProgTrue);
    return filterTeam.length;
  }

  private static sortByPoints(leadboard: ILeaderboardMaked[]) {
    const sorted = leadboard.sort((a, b) => {
      if (a.totalPoints > b.totalPoints) return -1;
      if (a.totalPoints < b.totalPoints) return 1;
      return 0;
    });
    return sorted;
  }

  private static sortLeaderboard(leadboard: ILeaderboardMaked[]) {
    return leadboard.sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) return 0;
      if (a.totalVictories > b.totalVictories) return -1;
      if (a.totalVictories < b.totalVictories) return 1;
      return 0;
    }).sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) return 0;
      if (a.totalVictories !== b.totalVictories) return 0;
      if (a.goalsBalance > b.goalsBalance) return -1;
      if (a.goalsBalance < b.goalsBalance) return 1;
      return 0;
    }).sort((a, b) => {
      if (a.totalVictories !== b.totalVictories) return 0;
      if (a.goalsBalance !== b.goalsBalance || a.totalPoints !== b.totalPoints) return 0;
      if (a.goalsFavor > b.goalsFavor) return -1;
      if (a.goalsFavor < b.goalsFavor) return 1;
      return 0;
    });
  }

  private static makeLeadboard(leadboard: ILeaderboard[]) {
    return leadboard.map((team) => ({
      name: team.homeTeam.teamName,
      totalPoints: LeaderboardService.makeTotalPoints(team, leadboard),
      totalGames: LeaderboardService.makeTotalGames(team, leadboard),
      totalVictories: LeaderboardService.makeTotalVictories(team, leadboard),
      totalDraws: LeaderboardService.makeTotalDraws(team, leadboard),
      totalLosses: LeaderboardService.makeTotalLosses(team, leadboard),
      goalsFavor: LeaderboardService.makeGoalsFavor(team, leadboard),
      goalsOwn: LeaderboardService.makeGoalsOwn(team, leadboard),
      goalsBalance: LeaderboardService.makeGoalsBalance(team, leadboard),
      efficiency: LeaderboardService.makeEfficiency(team, leadboard),
    }));
  }

  public static async homeLeaderboard(leadboard: ILeaderboard[]) {
    const newLeaderboard = LeaderboardService.makeLeadboard(leadboard);

    const reducedLeaderboard = newLeaderboard.reduce((acc: Array<{ name: string }>, cur) => {
      if (!acc.some((ele) => ele.name === cur.name)) return [...acc, cur];
      return acc;
    }, []) as ILeaderboardMaked[];

    const sortedLeadboard = LeaderboardService
      .sortLeaderboard(LeaderboardService.sortByPoints(reducedLeaderboard));
    return sortedLeadboard;
  }
}

// console.log(LeaderboardService.homeLeaderboard(leadTest));

export default LeaderboardService;
