import React, { createContext } from "react";

export const SidebarContext = createContext();

const STORAGE_KEY = "cwcloudSidebarExpanded";

const readExpanded = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch (e) {
    return false;
  }
};

const writeExpanded = (value) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(value));
  } catch (e) {
    // storage unavailable: keep the in-memory state only
  }
};

export const SidebarProvider = ({ children }) => {
  // Collapsed icon rail by default, like cwclock; the choice is remembered.
  const [open, setOpen] = React.useState(readExpanded);
  const drawerWidth = 240;
  // DOM node right after the main sidebar where a page can render its own
  // second sidebar (CWAI conversations, Kubernetes cluster navigation).
  const [secondarySlot, setSecondarySlot] = React.useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
    writeExpanded(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    writeExpanded(false);
  };

  return (
    <SidebarContext.Provider
      value={{
        open,
        drawerWidth,
        handleDrawerOpen,
        handleDrawerClose,
        secondarySlot,
        setSecondarySlot,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
