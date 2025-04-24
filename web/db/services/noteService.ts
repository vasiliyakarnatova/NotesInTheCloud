const Note = require('../db/models/note');

import { IUser } from '../interfaces/User';

export const createUser = async (data: IUser) => {
  return await User.query().insert(data);
};

export const getUserByUserName = async (userName: string) => {
    return await User.query().findOne({ userName });
  };