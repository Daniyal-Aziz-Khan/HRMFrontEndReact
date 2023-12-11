import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import RouteComp from "./components/routes/route";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "./components/redux/AuthController";

function App() {
  const dispatch = useDispatch();
  const userAuth = useSelector((state) => state.authentication);
  console.log("app js user auth: ", userAuth);
  return (
    <>
      <ToastContainer />
      <RouteComp />

      {/* Logout Modal*/}
      {/* <div
        className="modal fade"
        id="logoutModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Ready to Leave?
              </h5>
              <button
                className="close"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              Select "Logout" below if you are ready to end your current
              session.
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                type="button"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => dispatch(logoutAction())}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </>

    // <div id="wrapper">
    //   <Sidebar />

    //   <div id="content-wrapper" className="d-flex flex-column">
    //     <div id="content">
    //       {/* Topbar */}
    //       <MyNavbar />
    //       {/* End of Topbar */}

    //       {/* Begin Page Content */}
    //       <div className="container-fluid">
    //         {/* <MainDashboard /> */}
    //         <AddUser />
    //         {/* <EditUser /> */}
    //         {/* <UserList /> */}
    //       </div>

    //       {/* End of Page Content */}
    //     </div>
    //     <Footer />
    //   </div>
    // </div>

    //   <Login />
    //   <Register />
    // <ForgotPassword />
  );
}

export default App;
