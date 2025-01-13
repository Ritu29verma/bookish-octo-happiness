const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/dbConfig');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'username_unique',
        msg: 'Username must be unique',
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'email_unique',
        msg: 'Email must be unique',
      },
      validate: { isEmail: true },
    },
    role: {
      type: DataTypes.ENUM('admin', 'customer'),
      defaultValue: 'customer',
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);


User.setAssociations = (models) => {
  User.hasMany(models.Appointment, { foreignKey: 'user_id', as: 'appointments' });
};

module.exports = User;
