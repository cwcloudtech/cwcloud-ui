import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const DropdownComponent = ({ inputLabelId, name, selectLabelId, selectId, selectedItem, onChange, input, items, fullWidth }) => {
    return (
        <FormControl sx={{ m: 1, width: fullWidth ? '100%' : 300 }}>
            <InputLabel id={inputLabelId}>{name}</InputLabel>
            <Select
                labelId={selectLabelId}
                id={selectId}
                value={selectedItem || 'none'}
                onChange={onChange}
                input={input}
            >
                {items.map(item => (
                    <MenuItem
                        key={item.id}
                        value={item.id}
                    >
                        {item.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default DropdownComponent;