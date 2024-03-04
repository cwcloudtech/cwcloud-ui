import { differenceInYears, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';

function addHours(date, hours) {
    const dateCopy = new Date(date); 
    dateCopy.setHours(dateCopy.getHours() + hours); 
    return dateCopy;
}

function calculateObjectAge(creationDate) {
    const adjustedDate = addHours(creationDate, 1);
    const currentDate = new Date();
    const yearsDifference = differenceInYears(currentDate, adjustedDate);
    const monthsDifference = differenceInMonths(currentDate, adjustedDate);
    const daysDifference = differenceInDays(currentDate, adjustedDate);
    const hoursDifference = differenceInHours(currentDate, adjustedDate);
    const minutesDifference = differenceInMinutes(currentDate, adjustedDate);
    const secondsDifference = differenceInSeconds(currentDate, adjustedDate);

    if (yearsDifference >= 1) {
        return `${Math.round(yearsDifference)} year${Math.round(yearsDifference) !== 1 ? 's' : ''} ago`;
    } else if (monthsDifference >= 1) {
        return `${Math.round(monthsDifference)} month${Math.round(monthsDifference) !== 1 ? 's' : ''} ago`;
    } else if (daysDifference >= 1) {
        return `${Math.round(daysDifference)} day${Math.round(daysDifference) !== 1 ? 's' : ''} ago`;
    } else if (hoursDifference >= 1) {
        return `${Math.round(hoursDifference)} hour${Math.round(hoursDifference) !== 1 ? 's' : ''} ago`;
    } else if (minutesDifference >= 1) {
        return `${Math.round(minutesDifference)} minute${Math.round(minutesDifference) !== 1 ? 's' : ''} ago`;
    } else {
        return `${Math.round(secondsDifference)} second${Math.round(secondsDifference) !== 1 ? 's' : ''} ago`;
    }
}

export default calculateObjectAge;