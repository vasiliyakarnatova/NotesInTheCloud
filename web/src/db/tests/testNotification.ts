import setupDb from "./db-setup";
import { createNotification, updateNotification, deleteNotification, getNotification, getNotificationsFromUser } from '../db/services/notificationServise';

setupDb();

// (async () => {
//     const notification = await createNotification("bb355c9f-8bde-4800-9398-3966dc736a46");
//     console.log(notification);
// })();

// (async () => {
//     const updatedNotification = await updateNotification("6b5eea08-952a-46ec-82cb-26c10a8f842f", true);
//     console.log(updatedNotification);
// })();

// (async () => {
//     const notification = await createNotification("5adbff47-df8b-4e7e-ad00-adddf90db727");
//     console.log(notification);
// })();

// (async () => {
//     const notificationId = "7516841b-fd81-47b6-a008-1d3c7f8d5231"
//     return await deleteNotification(notificationId);
// })();

// (async () => {
//     const notificationId = "6b5eea08-952a-46ec-82cb-26c10a8f842f"
//     const notification = await getNotification(notificationId);
//     console.log(notification);
// })();

(async () => {
    const notifications = await getNotificationsFromUser("Vasiliya");
    console.log(notifications);
})();