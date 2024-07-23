import { useContext } from "react";
import { SidebarContext } from "../Context/SidebarContext";

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within an SideBarProvider");
  }
  return context;
};
