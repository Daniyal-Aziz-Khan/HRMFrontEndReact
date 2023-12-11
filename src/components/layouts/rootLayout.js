import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../global_component/sidebar";
import MyNavbar from "../global_component/navbar";
import Footer from "../global_component/footer";

function RootLayout() {
  return (
    <>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            {/* Topbar */}
            <MyNavbar />
            {/* End of Topbar */}

            {/* Begin Page Content */}
            <div className="container-fluid">
              <Outlet />
              {/* <MainDashboard /> */}
              {/* <AddUser /> */}
              {/* <EditUser /> */}
              {/* <UserList /> */}
            </div>

            {/* End of Page Content */}
          </div>
          <Footer />
        </div>
      </div>
      {/* <Login /> */}
      {/* <Register /> */}
      {/* <ForgotPassword /> */}
    </>
  );
}

export default RootLayout;
