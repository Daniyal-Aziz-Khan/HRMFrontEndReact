import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

// function sidebar() {
const Sidebar = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handleSidebarToggle = () => {
      const sidebar = document.querySelector(".sidebar");
      const isToggled = sidebar.classList.contains("toggled");

      document.body.classList.toggle("sidebar-toggled");
      sidebar.classList.toggle("toggled");

      if (!isToggled && sidebar.classList.contains("toggled")) {
        // eslint-disable-next-line no-undef
        const collapseElement = new bootstrap.Collapse(sidebar, {
          toggle: false,
        });
        collapseElement.hide();
      }
    };

    const handleWindowResize = () => {
      // eslint-disable-next-line no-undef
      const sidebarCollapse = new bootstrap.Collapse(
        document.querySelector(".sidebar .collapse"),
        {
          toggle: false,
        }
      );

      if (window.innerWidth < 768) {
        sidebarCollapse.hide();
      }

      if (
        window.innerWidth < 480 &&
        !document.querySelector(".sidebar").classList.contains("toggled")
      ) {
        document.body.classList.add("sidebar-toggled");
        document.querySelector(".sidebar").classList.add("toggled");
        sidebarCollapse.hide();
      }
    };

    const handleMouseWheel = (e) => {
      if (window.innerWidth > 768) {
        const delta = e.deltaY || -e.detail || e.wheelDelta; // Use whichever property is available
        const sidebar = document.querySelector("body.fixed-nav .sidebar");

        if (sidebar) {
          sidebar.scrollTop += (delta < 0 ? 1 : -1) * 30;
          e.preventDefault();
        }
      }
    };

    const handleScroll = () => {
      const scrollDistance = window.scrollY;
      if (scrollDistance > 100) {
        document.querySelector(".scroll-to-top").style.display = "block";
      } else {
        document.querySelector(".scroll-to-top").style.display = "none";
      }
    };

    const handleScrollToTop = (e) => {
      const $anchor = e.target;
      document.querySelector("html, body").animate(
        {
          scrollTop: document.querySelector($anchor.getAttribute("href"))
            .offsetTop,
        },
        1000,
        "easeInOutExpo"
      );
      e.preventDefault();
    };

    // Event listeners
    document
      .getElementById("sidebarToggle")
      .addEventListener("click", handleSidebarToggle);
    document
      .getElementById("sidebarToggleTop")
      .addEventListener("click", handleSidebarToggle);
    window.addEventListener("resize", handleWindowResize);
    document.body.addEventListener("mousewheel", handleMouseWheel);
    document.body.addEventListener("DOMMouseScroll", handleMouseWheel);
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("scroll-to-top")) {
        handleScrollToTop(e);
      }
    });

    // Cleanup listeners on component unmount
    return () => {
      document
        .getElementById("sidebarToggle")
        ?.removeEventListener("click", handleSidebarToggle);
      document
        .getElementById("sidebarToggleTop")
        ?.removeEventListener("click", handleSidebarToggle);
      window?.removeEventListener("resize", handleWindowResize);
      document?.body.removeEventListener("mousewheel", handleMouseWheel);
      document?.body.removeEventListener("DOMMouseScroll", handleMouseWheel);
      window?.removeEventListener("scroll", handleScroll);
      document?.removeEventListener("click", (e) => {
        if (e.target.classList.contains("scroll-to-top")) {
          handleScrollToTop(e);
        }
      });
    };
  }, []);

  return (
    <>
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        {/* Sidebar - Brand */}
        <NavLink
          className="sidebar-brand d-flex align-items-center justify-content-center"
          to="/"
        >
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className="sidebar-brand-text  mx-3">
            <NavLink className="text-white" to="/">
              SB Admin <sup>2</sup>
            </NavLink>
          </div>
        </NavLink>

        {/* Divider */}
        <hr className="sidebar-divider my-0" />

        {/* Nav Item - Dashboard */}
        <li className="nav-item active">
          <NavLink className="nav-link" to="/">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <NavLink className="text-white" to="/">
              <span>Dashboard</span>
            </NavLink>
          </NavLink>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider" />

        {/* Heading */}
        {/* <div className="sidebar-heading">Addons</div> */}

        {/* Nav Item - User Collapse Menu */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="/"
            data-toggle="collapse"
            data-target="#collapseMUsers"
            aria-expanded="true"
            aria-controls="collapseMUsers"
          >
            <i className="fas fa-fw fa-user"></i>
            <span>Manage User</span>
          </a>
          <div
            id="collapseMUsers"
            className="collapse"
            aria-labelledby="headingMUsers"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <NavLink className="collapse-item" to="add-user">
                Add User
              </NavLink>
              <NavLink className="collapse-item" to="update-user">
                Update User
              </NavLink>
              <div className="collapse-divider"></div>
              <NavLink className="collapse-item" to="user-list">
                Users List
              </NavLink>
            </div>
          </div>
        </li>

        {/* Nav Item - Pages Collapse Menu */}
        <li onClick={() => setShow(!show)} className="nav-item">
          <a
            className="nav-link collapsed"
            href="/"
            data-toggle="collapse"
            data-target="#collapsePages"
            aria-expanded="true"
            aria-controls="collapsePages"
          >
            <i className="fas fa-fw fa-folder"></i>
            <span>Pages</span>
          </a>
          <div
            style={{ display: show ? "block" : "none" }}
            id="collapsePages"
            className="collapse"
            aria-labelledby="headingPages"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Login Screens:</h6>
              <NavLink className="collapse-item" to="/">
                Login
              </NavLink>
              <NavLink className="collapse-item" to="register">
                Register
              </NavLink>
              <NavLink className="collapse-item" to="forgot-password">
                Forgot Password
              </NavLink>
              {/* <NavLink
                style={({ isActive }) => {
                  if (isActive) {
                    setShow(true);
                  }
                }}
                className="collapse-item"
                to="add-user"
              >
                Add User
              </NavLink>
              <NavLink
                style={({ isActive }) => {
                  if (isActive) {
                    setShow(true);
                  }
                }}
                className="collapse-item"
                to="update-user"
              >
                Update User
              </NavLink> */}
              <div className="collapse-divider"></div>
              <h6 className="collapse-header">Other Pages:</h6>
              <NavLink className="collapse-item" to="not-found">
                404 Page
              </NavLink>
              <a className="collapse-item" href="blank.html">
                Blank Page
              </a>
            </div>
          </div>
        </li>

        {/* <!-- Nav Item - Tables --> */}
        <li className="nav-item">
          <NavLink className="nav-link" to="user-list">
            <i className="fas fa-fw fa-table"></i>
            <span>Tables</span>
          </NavLink>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider d-none d-md-block" />

        {/* Sidebar Toggler (Sidebar) */}
        <div className="text-center d-none d-md-inline">
          <button
            className="rounded-circle border-0"
            id="sidebarToggle"
          ></button>
        </div>

        {/* Sidebar Message 
        <div className="sidebar-card d-none d-lg-flex">
          <img
            className="sidebar-card-illustration mb-2"
            src="img/undraw_rocket.svg"
            alt="..."
          />
          <p className="text-center mb-2">
            <strong>SB Admin Pro</strong> is packed with premium features,
            components, and more!
          </p>
          <a
            className="btn btn-success btn-sm"
            href="https://startbootstrap.com/theme/sb-admin-pro"
          >
            Upgrade to Pro!
          </a>
        </div>*/}
      </ul>
    </>
  );
};

export default Sidebar;
