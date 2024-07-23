import React, { createContext } from "react";

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [open, setOpen] = React.useState(true);
  const drawerWidth = 255;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <SidebarContext.Provider
      value={{
        open,
        drawerWidth,
        handleDrawerOpen,
        handleDrawerClose,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
