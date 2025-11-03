import { MenuItem, Select } from "@mui/material";
import Translate from "react-translate-component";

const SimpleDropdown = ({selectedItem, onChange, placeholder, items}) => {
    return (
        <Select
            value={selectedItem || 'none'}
            style={{ paddingLeft: '10px', margin: '10px', minWidth: '100px' }}
            onChange={onChange}
        >
            <MenuItem disabled value={'none'} >
                <Translate content={placeholder} />
            </MenuItem>
            {items.map(item => (
                <MenuItem value={item} key={item}>
                    {item}
                </MenuItem>
            ))}
        </Select>
    );
}

export default SimpleDropdown