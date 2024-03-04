export const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
}

export const formatDateTime = (dateTime) => {
    if (!dateTime) {
        return '';
    }

    let date;
    if (!(dateTime instanceof Date) && typeof dateTime === "string") {
        date = new Date(dateTime);
    } else {
        date = new Date(dateTime.split('T')[0]);
    }

    const formattedDate = [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/');

    const formattedTime = [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes())
    ].join(':');

    return `${formattedDate} ${formattedTime}`;
}

const formateDate = (date) => {
    if (! date) {
        return '';
    }

    if (!(date instanceof Date) && typeof date == "string") {
        date = new Date(date.split('T')[0]);
    }

    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('/');
}

export default formateDate;
