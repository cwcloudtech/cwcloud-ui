import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";

export default function ClusterManagementContainer() {
  return (
    <React.Fragment>
      <Sidebar />
      <Outlet />
    </React.Fragment>
  );
}
