const SESSION_KEY = "grimorio_session";

export function setSession(user){
    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(user)
    );
}

export function getSession(){
    return JSON.parse(
        localStorage.getItem(SESSION_KEY)
    );
}

export function logout(){
    localStorage.removeItem(
        SESSION_KEY
    );
}