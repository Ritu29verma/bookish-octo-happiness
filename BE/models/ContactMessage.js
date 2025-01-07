const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/dbConfig');

class ContactMessage extends Model {}

ContactMessage.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ContactMessage',
    tableName: 'contact_messages',
    timestamps: true,
  }
);

module.exports = ContactMessage;
