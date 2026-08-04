import {
    getUsers
} from "../storage/users.js";

import {
    setSession
} from "./session.js";

export function login(
    username,
    password
){
    const users = getUsers();

    const user = users.find(
        u =>
        u.username === username &&
        u.password === password
    );

    if(!user){
        throw new Error(
            "Usuário ou senha inválidos"
        );
    }

    setSession(user);

    return user;
}