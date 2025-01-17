import CWCloudLogo from "../assets/images/cwcloud-whitemode.png"

const logoimage = () => {
    if (process.env.REACT_APP_EXTERNAL_LOGO && process.env.REACT_APP_EXTERNAL_LOGO.startsWith("http")) {
        return process.env.REACT_APP_EXTERNAL_LOGO
    }
    return CWCloudLogo
}

export default logoimage;