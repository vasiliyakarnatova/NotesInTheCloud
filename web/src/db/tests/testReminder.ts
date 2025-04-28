import setupDb from "./db-setup";
import { createReminder, updateReminder, deleteReminder, getReminder, getRemindersFromUser } from '../db/services/reminderService';
import { getNotificationsFromUser } from "./services/notificationServise";

setupDb();

// (async () => {
//     const noteId = "3ac01184-f3ad-4888-a787-c5e65289322d";
//     const reminder = await createReminder(noteId, "2025-04-26 16:00:02.65+03", "Remind me somthing", "Vasiliya");
//     console.log(reminder);
// })();

// (async () => {
//     const updatedReminder = await updateReminder("d9c164f7-f69d-4b89-9a90-4c13a150069e", {description: "Remind me something please"});
//     console.log(updatedReminder);
// })();

// (async () => {
//     const reminderId = "d9c164f7-f69d-4b89-9a90-4c13a150069e";
//     return await deleteReminder(reminderId);
// })();

// (async () => {
//     const reminderId = "bb355c9f-8bde-4800-9398-3966dc736a46";
//     const reminder = await getReminder(reminderId);
//     console.log(reminder);
// })();

// (async () => {
//     const noteId = "3ac01184-f3ad-4888-a787-c5e65289322d";
//     const reminder = await createReminder(noteId, "2025-04-26 20:00:02.65+03", "Remind me somthing again", "Vasiliya");
//     console.log(reminder);
// })();

// (async () => {
//     const reminderCreater = "Vasiliya";
//     const reminders = await getRemindersFromUser(reminderCreater);
//     console.log(reminders);
// })();
