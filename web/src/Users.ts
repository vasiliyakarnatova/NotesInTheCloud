const REGISTERED_USERS = "registeredUsers";
const ACTIVE_USER = "activeUser";

export interface User {
    username: string;
    email: string;
    password: string;
}

const addNewUser = (user: User) => {
    const userStorage = localStorage.getItem(REGISTERED_USERS) || "[]"; // get the users from local storage or set it to an empty array if it doesn't exist

    const users = JSON.parse(userStorage) as User[]; // parse the string to an users array
    users.push(user); // add the new user to the array

    localStorage.setItem(REGISTERED_USERS, JSON.stringify(users)); // save the array to local storage
}

const isUserRegistered = (email: string): boolean => {
    const userStorage = localStorage.getItem(REGISTERED_USERS) || null; // get the users from local storage or set it to an empty array if it doesn't exist
    if (!userStorage)
        return false;

    const users = JSON.parse(userStorage) as User[]; // parse the string to an users array
    const foundUser = users.find((user) => user.email === email); // check if the email already exists in the array

    return foundUser != null;
}

const isUsernameTaken = (username: string): boolean => {
    const userStorage = localStorage.getItem(REGISTERED_USERS) || null; // get the users from local storage or set it to an empty array if it doesn't exist
    if (!userStorage)
        return false;

    const users = JSON.parse(userStorage) as User[]; // parse the string to an users array
    const foundUser = users.find((user) => user.username === username); // check if the username already exists in the array

    return foundUser != null;
}

const getUser = (username: string) => {
    const userStorage = localStorage.getItem(REGISTERED_USERS) || null; // get the users from local storage or set it to an empty array if it doesn't exist

    if (!userStorage)
        return null;

    const users = JSON.parse(userStorage) as User[]; // parse the string to an users array
    const foundUser = users.find((user) => user.username === username); // check if the username already exists in the array

    return foundUser || null;
}

const updateActiveUser = (user: User) => {
    localStorage.setItem(ACTIVE_USER, JSON.stringify(user)); // save the user to local storage
}

const getActiveUser = () => {
    const activeUser = localStorage.getItem(ACTIVE_USER) || null;
    if (activeUser === null)
        return null;
    return JSON.parse(activeUser); // parse the string to an user object
}

const deleteActiveUser = () => {
    localStorage.removeItem(ACTIVE_USER); // remove the user from local storage
}

export {
    addNewUser,
    isUserRegistered,
    isUsernameTaken,
    getUser,
    updateActiveUser,
    getActiveUser,
    deleteActiveUser
};