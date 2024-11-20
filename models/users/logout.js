import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import User from './user.js';

const BlacklistedToken = sequelize.define(
  'BlacklistedTokens',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
      allowNull: false,
      onDelete: 'CASCADE', // for sinhronisation
      onUpdate: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'BlacklistedTokens',
    timestamps: false,
  }
);


User.hasMany(BlacklistedToken, { foreignKey: 'userId' });
BlacklistedToken.belongsTo(User, { foreignKey: 'userId' });

export default BlacklistedToken;

