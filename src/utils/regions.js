import FRImage from "../assets/images/fr-region.svg"
import BEImage from "../assets/images/be-region.png"
import NLImage from "../assets/images/nl-region.svg"
import PLImage from "../assets/images/pl-region.svg"
import UKImage from "../assets/images/uk-region.svg"
import CAImage from "../assets/images/ca-region.svg"
import DEImage from "../assets/images/de-region.png"
import USImage from "../assets/images/us-region.png"
import EUImage from "../assets/images/eu-region.png"

const srcimage = (region) => {
    if (!region) {
        return EUImage
    } else if (region.startsWith("fr") || region.startsWith("FR") || region.startsWith("GRA") || region.startsWith("SBG") || region.startsWith("eu-west-3") || region.startsWith("europe-west9")) {
        return FRImage
    } else if (region.startsWith("be") || region.startsWith("europe-west1")) {
        return BEImage
    } else if (region.startsWith("ca") || region.startsWith("CA") || region.startsWith("BHS")) {
        return CAImage
    } else if (region.startsWith("de") || region.startsWith("DE") || region.startsWith("eu-central-1") || region.startsWith("europe-west3")) {
        return DEImage
    } else if (region.startsWith("pl") || region.startsWith("PL") || region.startsWith("WAW")) {
        return PLImage
    } else if (region.startsWith("nl") || region.startsWith("NL") || region.startsWith("europe-west4")) {
        return NLImage 
    } else if (region.startsWith("uk") || region.startsWith("UK") || region.startsWith("eu-west-2") || region.startsWith("europe-west2")) {
        return UKImage
    } else if (region.startsWith("us") || region.startsWith("US")) {
        return USImage
    } else {
        return EUImage
    }
}

export default srcimage;
