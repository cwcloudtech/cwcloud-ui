import { useSidebar } from "../../../Hooks/useSidebar";
import styles from "./SecondarySidebar.module.css";

// Placeholder column right after the main sidebar: pages fill it with a
// SecondarySidebar (rendered through a portal), it stays empty otherwise.
function SecondarySidebarSlot() {
  const { setSecondarySlot } = useSidebar();
  return <div ref={setSecondarySlot} className={styles.slot} />;
}

export default SecondarySidebarSlot;
