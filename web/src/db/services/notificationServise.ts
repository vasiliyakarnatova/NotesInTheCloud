const Notification = require('../models/notification');
const Reminder = require('../models/reminder');

import { v4 as uuidv4 } from 'uuid';

export const createNotification = async (remindId: string) => {
    const reminder = await Reminder.query().findOne({ reminderId: remindId });
    if(!reminder){
        throw new Error('Reminder not found');
    }
    const notificationId = uuidv4();
    const sentAt = new Date().toISOString();
    return await Notification.query().insert({ notificationId, remindId, sentAt, isRead: false});
};

export const updateNotification = async (notificationId: string, isRead: boolean) => {
    const notification = await Notification.query().findOne({ notificationId: notificationId });

    if(!notification){
        throw new Error('Notification not found');
    }

    return await notification.$query().patchAndFetch({ isRead });
};

export const deleteNotification = async (notificationId: string) => {
    return await Notification.query().deleteById(notificationId);
};

export const getNotification = async (notificationId: string) => {
    return await Notification.query().findOne({ notificationId: notificationId });
};

export const getNotificationsFromUser = async (userName: string) => {
    return Notification.query()
    .join('reminder', 'notification.remindId', 'reminder.reminderId')
    .where('reminder.reminderCreater', userName);
};
