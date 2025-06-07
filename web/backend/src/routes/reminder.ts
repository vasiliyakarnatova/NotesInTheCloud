import { Reminder } from '../../../db/models/reminder';
import { createNotification, updateNotification } from '../../../db/services/notificationService';
import { v4 as uuidv4 } from 'uuid';
import { IReminder } from '../../../db/interfaces/reminder';

export type IReminderUpdate = Partial<Pick<IReminder, 'remindTime' | 'description'>>;

export const createReminder = async (
  noteId: string,
  remindTime: string,
  description: string,
  reminderCreater: string
) => {
  if (new Date(remindTime) <= new Date()) {
    throw new Error('Reminder time must be in the future');
  }

  const reminderId = uuidv4();
  const newReminder = await Reminder.query().insert({
    reminderId,
    noteId,
    reminderCreater,
    remindTime,
    description
  });

  await createNotification(reminderId);
  return newReminder;
};

export const updateReminder = async (reminderId: string, data: IReminderUpdate) => {
  const reminder = await Reminder.query().findById(reminderId);
  if (!reminder) throw new Error('Reminder not found');

  const updatedReminder = await reminder.$query().patchAndFetch(data);
  await updateNotification(reminderId, false);

  return updatedReminder;
};

export const deleteReminder = async (reminderId: string) => {
  return await Reminder.query().deleteById(reminderId);
};

export const getReminder = async (reminderId: string) => {
  return Reminder.query().findOne({ reminderId });
};

export const getRemindersFromUser = async (userName: string) => {
  return Reminder.query().where('reminder.reminderCreater', userName);
};