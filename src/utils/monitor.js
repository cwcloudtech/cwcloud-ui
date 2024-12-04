export const field_from_input_name = (input_name) => {
    return input_name.replace("monitor_", '')
}

export const shortname = (name) => {
    if (!name) {
        return '';
    }
    const chunks = name.split('-');
    if (chunks.length <= 1) {
        return name;
    }
    chunks.pop();
    return chunks.join('-');
}

