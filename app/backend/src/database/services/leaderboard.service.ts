import { ILeaderboard, ILeaderboardMaked } from '../interfaces/IMatches';

import MatchesModel from '../models/matches.model';
import TeamsModel from '../models/teams.model';
// import * as schema from './validations/validationsMatches';

// import leadTest from './lead';

class LeaderboardService {
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

  private static makeFilterTeam(
    team: ILeaderboard,
    allProgTrue: ILeaderboard[],
    homeOrAway: boolean,
  ) {
    return homeOrAway
      ? allProgTrue.filter((t) => (t.homeTeamId === team.homeTeamId))
      : allProgTrue.filter((t) => (t.awayTeamId === team.awayTeamId));
  }

  private static makeTotalPoints(
    team: ILeaderboard,
    allProgTrue: ILeaderboard[],
    homeOrAway: boolean,
  ) {
    const leadFiltered = LeaderboardService.makeFilterTeam(team, allProgTrue, homeOrAway);
    return leadFiltered.reduce((acc, cur) => {
      const homeTest = cur.homeTeamGoals > cur.awayTeamGoals;
      const awayTest = cur.homeTeamGoals < cur.awayTeamGoals;
      if (homeOrAway ? homeTest : awayTest) return acc + 3;
      if (cur.homeTeamGoals === cur.awayTeamGoals) return acc + 1;
      return acc;
    }, 0);
  }

  private static makeTotalVictories(
    team: ILeaderboard,
    allProgTrue: ILeaderboard[],
    homeOrAway: boolean,
  ) {
    return homeOrAway
      ? allProgTrue.filter((t) => (t.homeTeamId === team.homeTeamId
        && t.homeTeamGoals > t.awayTeamGoals)).length
      : allProgTrue.filter((t) => (t.awayTeamId === team.awayTeamId
        && t.awayTeamGoals > t.homeTeamGoals)).length;
  }

  private static makeTotalDraws(
    team: ILeaderboard,
    allProgTrue: ILeaderboard[],
    homeOrAway: boolean,
  ) {
    const leadFiltered = LeaderboardService.makeFilterTeam(team, allProgTrue, homeOrAway);
    return leadFiltered
      .filter((t) => t.homeTeamGoals === t.awayTeamGoals).length;
  }

  private static makeTotalLosses(
    team: ILeaderboard,
    allProgTrue: ILeaderboard[],
    homeOrAway: boolean,
  ) {
    const leadFiltered = LeaderboardService.makeFilterTeam(team, allProgTrue, homeOrAway);
    return homeOrAway
      ? leadFiltered.filter((t) => t.homeTeamGoals < t.awayTeamGoals).length
      : leadFiltered.filter((t) => t.awayTeamGoals < t.homeTeamGoals).length;
  }

  private static makeGoalsFavor(
    team: ILeaderboard,
    allProgTrue: ILeaderboard[],
    homeOrAway: boolean,
  ) {
    const leadFiltered = LeaderboardService.makeFilterTeam(team, allProgTrue, homeOrAway);
    return homeOrAway
      ? leadFiltered.reduce((acc, cur) => cur.homeTeamGoals + acc, 0)
      : leadFiltered.reduce((acc, cur) => cur.awayTeamGoals + acc, 0);
  }

  private static makeGoalsOwn(
    team: ILeaderboard,
    allProgTrue: ILeaderboard[],
    homeOrAway: boolean,
  ) {
    const leadFiltered = LeaderboardService.makeFilterTeam(team, allProgTrue, homeOrAway);
    return homeOrAway
      ? leadFiltered.reduce((acc, cur) => cur.awayTeamGoals + acc, 0)
      : leadFiltered.reduce((acc, cur) => cur.homeTeamGoals + acc, 0);
  }

  private static makeGoalsBalance(
    team: ILeaderboard,
    allProgTrue: ILeaderboard[],
    homeOrAway: boolean,
  ) {
    const goalFavor = LeaderboardService.makeGoalsFavor(team, allProgTrue, homeOrAway);
    const goalsOwn = LeaderboardService.makeGoalsOwn(team, allProgTrue, homeOrAway);
    return goalFavor - goalsOwn;
  }

  private static makeEfficiency(
    team: ILeaderboard,
    allProgTrue: ILeaderboard[],
    homeOrAway: boolean,
  ) {
    const totalPt = LeaderboardService.makeTotalPoints(team, allProgTrue, homeOrAway);
    const filterTeam = LeaderboardService.makeFilterTeam(team, allProgTrue, homeOrAway);
    return Number(((totalPt / (filterTeam.length * 3)) * 100).toFixed(2));
  }

  private static makeTotalGames(
    team: ILeaderboard,
    allProgTrue: ILeaderboard[],
    homeOrAway: boolean,
  ) {
    const filterTeam = LeaderboardService.makeFilterTeam(team, allProgTrue, homeOrAway);
    return filterTeam.length;
  }

  protected static sortByPoints(leadboard: ILeaderboardMaked[]) {
    const sorted = leadboard.sort((a, b) => {
      if (a.totalPoints > b.totalPoints) return -1;
      if (a.totalPoints < b.totalPoints) return 1;
      return 0;
    });
    return sorted;
  }

  protected static sortLeaderboard(leadboard: ILeaderboardMaked[]) {
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

  private static makeLeadboard(leadboard: ILeaderboard[], homeOrAway: boolean) {
    return leadboard.map((team) => ({
      name: homeOrAway ? team.homeTeam.teamName : team.awayTeam.teamName,
      totalPoints: LeaderboardService.makeTotalPoints(team, leadboard, homeOrAway),
      totalGames: LeaderboardService.makeTotalGames(team, leadboard, homeOrAway),
      totalVictories: LeaderboardService.makeTotalVictories(team, leadboard, homeOrAway),
      totalDraws: LeaderboardService.makeTotalDraws(team, leadboard, homeOrAway),
      totalLosses: LeaderboardService.makeTotalLosses(team, leadboard, homeOrAway),
      goalsFavor: LeaderboardService.makeGoalsFavor(team, leadboard, homeOrAway),
      goalsOwn: LeaderboardService.makeGoalsOwn(team, leadboard, homeOrAway),
      goalsBalance: LeaderboardService.makeGoalsBalance(team, leadboard, homeOrAway),
      efficiency: LeaderboardService.makeEfficiency(team, leadboard, homeOrAway),
    }));
  }

  public static async homeLeaderboard(leadboard: ILeaderboard[]) {
    const newLeaderboard = LeaderboardService.makeLeadboard(leadboard, true);

    const reducedLeaderboard = newLeaderboard.reduce((acc: Array<{ name: string }>, cur) => {
      if (!acc.some((ele) => ele.name === cur.name)) return [...acc, cur];
      return acc;
    }, []) as ILeaderboardMaked[];

    const sortedLeadboard = LeaderboardService
      .sortLeaderboard(LeaderboardService.sortByPoints(reducedLeaderboard));
    return sortedLeadboard;
  }

  public static async awayLeaderboard(leadboard: ILeaderboard[]) {
    const newLeaderboard = LeaderboardService.makeLeadboard(leadboard, false);

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
