import Dropdown, { DropdownItem } from "../Common/Dropdown";
import styles from "./NavbarSelect.module.css";

// DNS provider picker of the navbar, same look as SelectDropdown.
const DnsDropdown = ({ id, value, onChange, itemsList = [], disabled }) => (
  <Dropdown
    className={styles.select}
    triggerClassName={styles.trigger}
    disabled={disabled}
    trigger={
      <span id={id} className={styles.triggerContent}>
        <span className={styles.value}>{value}</span>
      </span>
    }
  >
    {(close) =>
      itemsList.map((item) => (
        <DropdownItem
          key={item}
          active={item === value}
          onClick={() => {
            onChange({ target: { value: item } });
            close();
          }}
        >
          {item}
        </DropdownItem>
      ))
    }
  </Dropdown>
);

export default DnsDropdown;
