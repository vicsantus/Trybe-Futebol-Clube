import ITeams from '../interfaces/ITeams';
import TeamsModel from '../models/teams.model';

class TeamsService {
  public static async getAll(): Promise<ITeams[]> {
    const users: ITeams[] = await TeamsModel.findAll();
    return users;
  }

  public static async getById(id: string): Promise<ITeams | { message: string }> {
    const users: ITeams | null = await TeamsModel.findByPk(id);
    if (!users) return { message: 'Time não encontrado' };
    return users;
  }
}

export default TeamsService;
