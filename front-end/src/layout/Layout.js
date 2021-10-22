import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";


function Layout() {
  return (
    <div className="container-fluid">
      <div className="row h-100 ">
        <div className="col-xl-1 side-bar">
          <Menu />
        </div>
        <div className="col px-0">
          <Routes />
        </div>;
      </div>
    </div>
  );
}

export default Layout;
