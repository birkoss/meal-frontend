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


export function FormatDate(d) {
    let month = (d.getMonth() + 1);
    let day = d.getDate();
    let year = d.getFullYear();

    if (month < 10) 
        month = '0' + month;
    if (day.length < 10) 
        day = '0' + day;

    return [year, month, day].join('-');
}


export function DateToString(d) {
    const monthsLabel = {
        1: "Janvier",
        2: "Février",
        3: "Mars",
        4: "Avril",
        5: "Mai",
        6: "Juin",
        7: "Juillet",
        8: "Août",
        9: "Septembre",
        10: "Octobre",
        11: "Novembre",
        12: "Décembre",
    };

    return d.getDate() + " " + monthsLabel[d.getMonth()].toLowerCase() + " " + d.getFullYear();
}