import { DataTypes } from 'sequelize';

import { emailRegexp } from '../../constants/auth.js';
import sequelize from '../Sequelize.js';

const User = sequelize.define('user', {
  _id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: emailRegexp,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
  },

  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  refreshToken: {
    type: DataTypes.STRING,
    defaultValue: null,
    allowNull: true,
  },

  verify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationToken: {
    type: DataTypes.STRING,
  },
});

// User.sync({force: true});

User.belongsToMany(User, {
  as: 'followers',
  through: 'user_followers',
  foreignKey: 'followingId',
  otherKey: 'followerId',
});

User.belongsToMany(User, {
  as: 'following',
  through: 'user_followers',
  foreignKey: 'followerId',
  otherKey: 'followingId',
});


export default User;
