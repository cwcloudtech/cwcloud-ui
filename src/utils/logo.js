import ComworkLogo from "../assets/images/logocomwork.png"
const logoimage = () => {
    if (process.env.REACT_APP_EXTERNAL_LOGO && process.env.REACT_APP_EXTERNAL_LOGO.startsWith("http")) {
        return process.env.REACT_APP_EXTERNAL_LOGO
    }
    return ComworkLogo
}
export default logoimage;