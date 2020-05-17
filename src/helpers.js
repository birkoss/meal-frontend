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
    let month = (d.getUTCMonth() + 1);
    let day = d.getUTCDate();
    let year = d.getUTCFullYear();

    if (month < 10) 
        month = '0' + month;
    if (day < 10) 
        day = '0' + day;

    return [year, month, day].join('-');
}

export function DateToString(d) {
    console.log(d, d.getMonth());
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

    return d.getUTCDate() + " " + monthsLabel[d.getMonth()+1].toLowerCase() + " " + d.getFullYear();
}

export function DayToString(d) {
    const daysLabel = {
        1: "Lundi",
        2: "Mardi",
        3: "Mercredi",
        4: "Jeudi",
        5: "Vendredi",
        6: "Samedi",
        0: "Dimanche",
    };

    return daysLabel[d.getDay()];
}

export function CreateDate(date) {
    const parts = date.split("-");
    return new Date(parts[0], parts[1] - 1, parts[2]);
}