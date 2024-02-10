const logoimage = (_source) => {
    if (process.env.REACT_APP_EXTERNAL_LOGO && process.env.REACT_APP_EXTERNAL_LOGO.startsWith("http")) {
        return process.env.REACT_APP_EXTERNAL_LOGO
    }
    return _source
}
export default logoimage;