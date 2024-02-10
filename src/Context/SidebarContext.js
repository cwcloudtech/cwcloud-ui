import React from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "../Hooks/useSidebar";

const SidebarContext = ({ children }) => {
  const { pathname } = useLocation();
  return <SidebarProvider defaultItem={pathname}>{children}</SidebarProvider>;
}
export { SidebarContext };