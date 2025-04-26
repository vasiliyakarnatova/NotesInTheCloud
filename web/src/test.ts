import setupDb from './db/db-setup';
import { createUser } from './db/services/userService'

setupDb();

(async () => {
    const user = createUser({
        userName: "Vasi",
        password: "obichamMiro18",
        email: "naisladkata@mail.bg",
    });
    console.log(user);
})();