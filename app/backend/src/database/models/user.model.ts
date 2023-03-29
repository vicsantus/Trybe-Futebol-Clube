import { INTEGER, Model, STRING } from 'sequelize';
import db from '.';
// import MatchesModel from './matches.model';

class UserModel extends Model {
  declare id: number;
  declare username: string;
  declare role: string;
  declare email: string;
  declare password: string;
}

UserModel.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: STRING(255),
    allowNull: false,
  },
  role: {
    type: STRING(255),
    allowNull: false,
  },
  email: {
    type: STRING(255),
    allowNull: false,
  },
  password: {
    type: STRING(255),
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'users',
  timestamps: false,
});

/**
  * `Workaround` para aplicar as associations em TS:
  * Associations 1:N devem ficar em uma das instâncias de modelo
  * */

// UserModel.belongsTo(MatchesModel, {
//   foreignKey: { name: 'homeTeamId', field: 'home_team_id' },
//   as: 'user',
// });

// MatchesModel.hasOne(UserModel, { foreignKey: 'id', as: 'userMatchesHomeId' });
// MatchesModel.hasOne(UserModel, { foreignKey: 'id', as: 'userMatchesAwayId' });
// OtherModel.belongsTo(Example, { foreignKey: 'campoB', as: 'campoEstrangeiroB' });
// UserModel.belongsToMany(
//   MatchesModel,
//   { foreignKey: { name: 'homeTeamId', field: 'home_team_id' },
//     as: 'homeId',
//     through: MatchesModel },
// );
// UserModel.belongsToMany(
//   MatchesModel,
//   { foreignKey: { name: 'homeTeamGoals', field: 'home_team_goals' },
//     as: 'homeGoals',
//     through: MatchesModel },
// );
// Example.hasMany(OtherModel, { foreignKey: 'campoC', as: 'campoEstrangeiroC' });
// Example.hasMany(OtherModel, { foreignKey: 'campoD', as: 'campoEstrangeiroD' });

export default UserModel;
