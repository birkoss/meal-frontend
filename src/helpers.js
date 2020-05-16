import Cookies from 'universal-cookie';


export function ApiGetToken() {
    const token = GetCookie('token')
    return (token === undefined ? "" : token)
}

export function ApiSetToken(value) {
    const cookies = new Cookies();
    cookies.set('token', value, { path: '/' });
}

export function GetCookie(name) {
    const cookies = new Cookies();
    return cookies.get(name);
}

export function ApiGetHeaders() {
    return {
        'Content-type': 'application/json',
        'X-CSRFToken': GetCookie('csrftoken'),
        'Authorization': 'token ' + ApiGetToken(),
    };
}