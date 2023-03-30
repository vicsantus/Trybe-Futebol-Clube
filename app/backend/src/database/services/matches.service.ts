// import { BadRequestError } from 'restify-errors';
// import * as dotenv from 'dotenv';
// import * as Jwt from 'jsonwebtoken';
// import { SignOptions } from 'jsonwebtoken';
import IMatchesBD from '../interfaces/IMatches';
// import ITeams from '../interfaces/users.interface';
// import connection from '../models/connection';
import MatchesModel from '../models/matches.model';
import TeamsModel from '../models/teams.model';
import * as schema from './validations/validationsMatches';

// dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET || 'batatinha';

// const JWT_CONFIG: SignOptions = {
//   algorithm: 'HS256',
//   expiresIn: '15m',
// };

// const properties = ['username', 'vocation', 'level', 'password'];

class MatchesService {
  // public model: MatchesModel | undefined;

  // constructor() {
  //   this.model = new TeamsModel();
  // }

  // static validateProperties(user: IMatchesBD): [boolean, string | null] {
  //   for (let i = 0; i < properties.length; i += 1) {
  //     if (!Object.prototype.hasOwnProperty.call(user, properties[i])) {
  //       return [false, properties[i]];
  //     }
  //   }
  //   return [true, null];
  // }

  // static validateValues(user: IMatchesBD): [boolean, string | null] {
  //   const entries = Object.entries(user);
  //   for (let i = 0; i < entries.length; i += 1) {
  //     const [property, value] = entries[i];
  //     if (!value) {
  //       return [false, property];
  //     }
  //   }
  //   return [true, null];
  // }

  // static validationUser(user: IMatchesBD): void | string {
  //   let [valid, property] = MatchesService.validateProperties(user);

  //   if (!valid) {
  //     return `O campo ${property} é obrigatório.`;
  //   }
  //   [valid, property] = MatchesService.validateValues(user);

  //   if (!valid) {
  //     return `O campo ${property} não pode ser nulo ou vazio.`;
  //   }
  // }

  // static generateToken = (
  //   payload: IMatchesBD,
  // ): string => Jwt.sign(payload, JWT_SECRET, JWT_CONFIG);

  // public async create(user: IUser): Promise<{ token: string } | Error> {
  //   const isValidUser = TeamsService.validationUser(user);

  //   if (typeof isValidUser === 'string') {
  //     throw new Error(isValidUser);
  //   }

  //   const { id, teamName } = await TeamsModel.create(user);
  //   console.log(teamName);

  //   const token = TeamsService.generateToken({ id, username, vocation, level });
  //   return { token };
  // }

  public static async getAll(): Promise<IMatchesBD[]> {
    // console.log(this.model);
    const allMatches: IMatchesBD[] = await MatchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: ['teamName'] },
        { model: TeamsModel, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
    return allMatches;
  }

  public static async getAllProgTrue(): Promise<IMatchesBD[]> {
    // console.log(this.model);
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
    // console.log(this.model);
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
    // console.log(this.model);
    const error = schema.validateId(id);
    if (error.type) return error;

    // const result: IMatchesBD | null = await MatchesModel.findOne({
    //   where: { id },
    // });
    // if (!result) return { type: 401, message: 'Token must be a valid token' };
    await MatchesModel.update(
      { inProgress: false },
      { where: { id } },
    );

    return { type: 200, message: { message: 'Finished' } };
  }

  public static async updateMatch(id: string, home: number, away: number): Promise<object> {
    // console.log(this.model);
    const error = schema.validateId(id);
    if (error.type) return error;

    // const result: IMatchesBD | null = await MatchesModel.findOne({
    //   where: { id },
    // });
    // if (!result) return { type: 401, message: 'Token must be a valid token' };

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

  // public async getById(id: string): Promise<IMatchesBD | { message: string }> {
  //   console.log(this.model);
  //   const users: IMatchesBD | null = await MatchesModel.findByPk(id);
  //   if (!users) return { message: 'Time não encontrado' };
  //   return users;
  // }

  // public async login(login: ITeams) {
  //   const { username: usernameFromLogin, password: passwordFromLogin } = login;
  //   if (!usernameFromLogin) return { status: 400, message: { message: '"username" is required' } };
  //   if (!passwordFromLogin) return { status: 400, message: { message: '"password" is required' } };
  //   const users = await this.model.login(login);
  //   if (users.length === 0 || users[0].password !== login.password) {
  //     return { status: 401, message: { message: 'Username or password invalid' } };
  //   }
  //   const [{ id, username, vocation, level }] = users;
  //   // console.log(result.id);
  //   const token = TeamsService.generateToken({ id, username, vocation, level });
  //   return { status: 200, message: { token } };
  // }
}

export default MatchesService;
