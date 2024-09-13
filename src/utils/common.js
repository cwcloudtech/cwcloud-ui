export const isUUID = (val) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

export const isEmpty = (val) => {
    return !val || val === "";
}

export const isNotEmpty = (val) => {
    return !isEmpty(val);
}

export const isBlank = (val) => {
    return isEmpty(val) || /^\s+$/i.test(val);
}

export const isNotBlank = (val) => {
    return !isBlank(val);
}

export const isValidEmail = (val) => {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(val);
}

export const sortObjectsByDate = (objects) => {
    return objects.sort((a, b) => new Date(a.creation_date) - new Date(b.creation_date));
}

export const getPriceWithUnit = (price) => {
    var priceUnit = process.env.REACT_APP_PRICE_UNIT
    if (price.price === null) {
       return '';
    }
    
    if (priceUnit === null) {
       return price.price;
    }
  
    return priceUnit + ' ' + price.price;
}  

export const isTrue = (varValue) => {
    if (typeof varValue === 'boolean') {
        return varValue;
    }
    const falseChar = ["false", "ko", "no", "off"];
    return isNotEmpty(varValue) && !falseChar.includes(String(varValue).toLowerCase());
}

export const isFalse = (varValue) => {
    return !isTrue(varValue);
}
