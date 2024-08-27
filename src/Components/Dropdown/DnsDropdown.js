import { MenuItem, Select } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';
import { useContext } from "react";
import colors from "../../Context/Colors";
import GlobalContext from "../../Context/GlobalContext";

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

const DnsDropdown = ({ labelId, id, value, onChange, itemsList, classes, withImage, disabled}) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    return (
        <Select
            labelId={labelId}
            id={id}
            value={value}
            style={{ marginLeft: '10px', marginRight: '10px', background: colors.secondBackground[_mode] + ' !important'}}
            onChange={onChange}
            input={<BootstrapInput />}>
            {itemsList?.map((item, index) => (
                <MenuItem value={item} key={index} style={{background: colors.secondBackground[_mode]}}>
                    <span>{item}</span>
                </MenuItem>
            ))}
        </Select>
    );
}

export default DnsDropdown;