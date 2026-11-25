// An instance can brand the console with its own logo (REACT_APP_EXTERNAL_LOGO).
export const isExternalLogo = () =>
    Boolean(process.env.REACT_APP_EXTERNAL_LOGO && process.env.REACT_APP_EXTERNAL_LOGO.startsWith("http"))

const logoimage = (_source) => {
    if (isExternalLogo()) {
        return process.env.REACT_APP_EXTERNAL_LOGO
    }
    return _source
}
export default logoimage;
