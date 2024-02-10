const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
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
