export const isUUID = (val) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

export const isEmpty = (val) => {
    return !val || val === "";
}

export const isBlank = (val) => {
    return isEmpty(val) || /^\s+$/i.test(val);
}

export const isNotBlank = (val) => {
    return !isBlank(val);
}
