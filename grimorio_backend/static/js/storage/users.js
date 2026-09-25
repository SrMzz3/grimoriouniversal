const USERS_KEY = "grimorio_users";

export function getUsers(){
    return JSON.parse(
        localStorage.getItem(
            USERS_KEY
        ) || "[]"
    );
}

export function saveUsers(users){
    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );
}

export function createUser(
    username,
    password
){
    const users = getUsers();

    if(
        users.some(
            u => u.username === username
        )
    ){
        throw new Error(
            "Usuário já existe"
        );
    }

    const user = {
        id: crypto.randomUUID(),

        username,
        password,

        characters: [],
        systems: []
    };

    users.push(user);

    saveUsers(users);

    return user;
}