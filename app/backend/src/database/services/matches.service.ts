import IMatchesBD from '../interfaces/IMatches';
import MatchesModel from '../models/matches.model';
import TeamsModel from '../models/teams.model';
import * as schema from './validations/validationsMatches';

class MatchesService {
  public static async getAll(): Promise<IMatchesBD[]> {
    const allMatches: IMatchesBD[] = await MatchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: ['teamName'] },
        { model: TeamsModel, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
    return allMatches;
  }

  public static async getAllProgTrue(): Promise<IMatchesBD[]> {
    const allMatches: IMatchesBD[] = await MatchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: ['teamName'] },
        { model: TeamsModel, as: 'awayTeam', attributes: ['teamName'] },
      ],
      where: { inProgress: true },
    });
    return allMatches;
  }

  public static async getAllProgFalse(): Promise<IMatchesBD[]> {
    const allMatches: IMatchesBD[] = await MatchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: ['teamName'] },
        { model: TeamsModel, as: 'awayTeam', attributes: ['teamName'] },
      ],
      where: { inProgress: false },
    });
    return allMatches;
  }

  public static async finishPathById(id: string): Promise<object> {
    const error = schema.validateId(id);
    if (error.type) return error;
    await MatchesModel.update(
      { inProgress: false },
      { where: { id } },
    );

    return { type: 200, message: { message: 'Finished' } };
  }

  public static async updateMatch(id: string, home: number, away: number): Promise<object> {
    const error = schema.validateId(id);
    if (error.type) return error;

    await MatchesModel.update(
      { homeTeamGoals: home, awayTeamGoals: away },
      { where: { id } },
    );

    return { type: 200, message: { message: 'Finished' } };
  }

  public static async create(match: IMatchesBD): Promise<object> {
    const homeTeam = await TeamsModel.findByPk(match.homeTeamId);
    const awayTeam = await TeamsModel.findByPk(match.awayTeamId);
    if (!homeTeam || !awayTeam) {
      return { type: 404, message: 'There is no team with such id!' };
    }
    const teamCreated = await MatchesModel.create({
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      homeTeamGoals: match.homeTeamGoals,
      awayTeamGoals: match.awayTeamGoals,
      inProgress: true });

    return { type: 201, message: teamCreated };
  }
}

export default MatchesService;
