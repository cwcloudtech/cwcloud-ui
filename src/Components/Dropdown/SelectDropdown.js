import Translate from "react-translate-component";
import { MenuItem, Select } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import colors from "../../Context/Colors";
import GlobalContext from "../../Context/GlobalContext";
import { useContext } from "react";
import srcimage from "../../utils/regions";

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        fontSize: 13,
        fontWeight: 800,
        padding: '10px 26px 10px 12px',
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ]
    },
}))(InputBase);

const SelectDropdown = ({ labelId, id, value, onChange, itemsList, classes, withImage, disabled}) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    return (
        <Select
            labelid={labelId}
            id={id}
            value={value}
            style={{ marginLeft: '10px', marginRight: '10px', background: colors.secondBackground[_mode] + ' !important'}}
            onChange={onChange}
            input={<BootstrapInput />}>
            <MenuItem style={{display: 'none', background: colors.secondBackground[_mode]}} disabled value="global">
                <div className={classes.regionItemStyles} style={{color: colors.mainText[_mode]}}>
                    <span><Translate content="navbar.provider" /></span>
                </div>
            </MenuItem>
            {itemsList.map(item => (
                <MenuItem disabled={disabled} value={item.name} key={item.name} style={{background: colors.secondBackground[_mode]}}>
                    <div className={classes.regionItemStyles} style={{color: colors.mainText[_mode]}}>
                        {withImage && <img src={srcimage(item.name)} alt="fr" className={classes.ImageRegionStyles} />}
                        {item.name}
                    </div>
                </MenuItem>
            ))}
        </Select>
    );
}

export default SelectDropdown;