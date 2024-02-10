import colors from "../../Context/Colors";
import GlobalContext from "../../Context/GlobalContext";
import { useContext } from "react";
import srcimage from "../../utils/regions";
import { DropdownItem } from "reactstrap";

const LanguageDropdown = ({ languageShortName, languageNames, classes}) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    return (
        <DropdownItem onClick={() => context.setLanguage(languageShortName)}>
            <div style={{ display: 'flex', alignItems: 'center'}}>
                <img src={srcimage(languageShortName)} alt={languageShortName} height="15px"/>
                <h5 className={classes.dropdownItemText} style={{margin: "10px", color: colors.menuText[_mode]}}>
                    {context.language === "en" ? languageNames[0] : languageNames[1]}
                </h5>
            </div>
        </DropdownItem>
    );
}

export default LanguageDropdown;