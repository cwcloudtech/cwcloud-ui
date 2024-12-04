export const field_from_input_name = (input_name) => {
    return input_name.replace("monitor_", '')
}

export const shortname = (name) => {
    chunks = name.split("-")
    chunks.pop()
    return chunks.join("-")
}
