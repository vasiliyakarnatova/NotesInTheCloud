const User = require('../models/user');

import { IUser } from '../interfaces/user';

export const createUser = async (data: IUser) => {
  return await User.query().insert(data);
};

export const getUserByUserName = async (userName: string) => {
    return await User.query().findOne({ userName: userName });
};

export const getUserByEmail = async (email: string): Promise<IUser | undefined> => {
  try {
    return await User.query().findOne( {email: email} );
  } catch (err) {
    return undefined;
  }
};