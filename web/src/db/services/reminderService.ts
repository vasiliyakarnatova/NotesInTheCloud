const Reminder = require('../models/reminder');

import { createNotification, updateNotification } from './notificationServise';

import { v4 as uuidv4 } from 'uuid';

import { IReminder } from '../interfaces/reminder';

export type IReminderUpdate = Partial<Pick<IReminder, 'remindTime' | 'description'>>;

// check (remindTime => now) => createNotification(..)
export const createReminder = async (noteId: string, remindTime: string, description: string, reminderCreater: string) => {
    const reminderId = uuidv4(); 
    const newReminder = await Reminder.query().insert({reminderId, noteId, reminderCreater, remindTime, description});
    return newReminder;
};

// check if there is modifications in reminder => updateNotification(...) for this reminder
export const updateReminder = async (reminderId: string, data: IReminderUpdate) => {
    const reminder = await Reminder.query().findById(reminderId);
    if(!reminder){
        throw new Error('Reminder not found.');
    }

    return await reminder.$query().patchAndFetch(data);
};

//check if remindTime < now => deleteNotification(...) else => save history
export const deleteReminder = async (reminderId: string) => {
    return await Reminder.query().deleteById(reminderId);
};

export const getReminder = async (reminderId: string) => {
    return Reminder.query().findOne({ reminderId: reminderId });
};

export const getRemindersFromUser = async (userName: string) => {
    return await Reminder.query()
    .where('reminder.reminderCreater', userName);
};