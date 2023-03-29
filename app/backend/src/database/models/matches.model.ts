import { BOOLEAN, INTEGER, Model } from 'sequelize';
import db from '.';
import UserModel from './user.model';

class MatchesModel extends Model {
  declare id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

MatchesModel.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeamId: {
    type: INTEGER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeamId: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: BOOLEAN,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
});

/**
  * `Workaround` para aplicar as associations em TS:
  * Associations 1:N devem ficar em uma das instâncias de modelo
  * */

UserModel.belongsTo(MatchesModel, { foreignKey: 'homeTeamId', as: 'matchesUserHomeId' });
UserModel.belongsTo(MatchesModel, { foreignKey: 'awayTeamId', as: 'matchesUserAwayId' });
// OtherModel.belongsTo(Example, { foreignKey: 'campoB', as: 'campoEstrangeiroB' });

MatchesModel.hasMany(UserModel, { foreignKey: 'id', as: 'userMatchesHomeId' });
MatchesModel.hasMany(UserModel, { foreignKey: 'id', as: 'userMatchesAwayId' });
// Example.hasMany(OtherModel, { foreignKey: 'campoD', as: 'campoEstrangeiroD' });

export default MatchesModel;
