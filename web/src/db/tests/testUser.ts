import setupDb from '../db-setup.ts';
import { createUser, getUserByUserName } from '../services/userService.ts'

setupDb();

(async () => {
    const user = await createUser({
        userName: "Vasiliya",
        password: "1234",
        email: "vasiliya@gmail.com",
    });
    console.log(user);
})();

// (async () => {
//     const user = await createUser({
//         userName: "Emiliya",
//         password: "4321",
//         email: "emiliya@gmail.com",
//     });
//     console.log(user);
// })();

// (async () => {
//     const userName = "Vasiliya";
//     const user = await getUserByUserName(userName);
//     console.log(user);
// })();