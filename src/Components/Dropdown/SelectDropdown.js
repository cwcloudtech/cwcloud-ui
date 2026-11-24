import Dropdown, { DropdownItem } from "../Common/Dropdown";
import Translate from "../Translate/Translate";
import srcimage from "../../utils/regions";
import styles from "./NavbarSelect.module.css";

// Provider / region picker of the navbar, same look as cwclock's organization
// switcher. onChange keeps the event-like ({ target: { value } }) signature of
// the MUI Select it replaces.
const SelectDropdown = ({ id, value, onChange, itemsList = [], withImage, disabled }) => {
  const selected = itemsList.find((item) => item.name === value);

  return (
    <Dropdown
      className={styles.select}
      triggerClassName={styles.trigger}
      disabled={disabled}
      trigger={
        <span id={id} className={styles.triggerContent}>
          {withImage && selected && <img src={srcimage(selected.name)} alt="" className={styles.flag} />}
          <span className={styles.value}>{selected ? selected.name : <Translate content="navbar.provider" />}</span>
        </span>
      }
    >
      {(close) =>
        itemsList.map((item) => (
          <DropdownItem
            key={item.name}
            active={item.name === value}
            onClick={() => {
              onChange({ target: { value: item.name } });
              close();
            }}
          >
            {withImage && <img src={srcimage(item.name)} alt="" className={styles.flag} />}
            {item.name}
          </DropdownItem>
        ))
      }
    </Dropdown>
  );
};

export default SelectDropdown;
