const User = require('../models/user');

import { IUser } from '../interfaces/user';

export const createUser = async (data: IUser) => {
  return await User.query().insert(data);
};

export const getUserByUserName = async (userName: string) => {
    return await User.query().findOne({ userName: userName });
};