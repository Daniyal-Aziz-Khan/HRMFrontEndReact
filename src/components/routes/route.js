import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// pages
import Dashboard from "../global_component/DashBoard";
import NotFound from "../ErrorPages/NotFound";
import AddCompany from "../ManageCompany/AddCompany";
import CompanyList from "../ManageCompany/CompanyList";
import AddUser from "../ManageUser/AddUser";
import EditUser from "../ManageUser/EditUser";
import UserList from "../ManageUser/UserList";
import Login from "../Login/Login";
import Register from "../Register/Register";
import ForgotPassword from "../ForgotPassword/ForgotPassword";

// layouts
import RootLayout from "../layouts/rootLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";

const getRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route element={<RootLayout />}>
          <Route path="home" element={<Dashboard />} />
          <Route path="add-company" element={<AddCompany />} />
          <Route path="company-list" element={<CompanyList />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="update-user" element={<EditUser />} />
          <Route path="user-list" element={<UserList />} />
          <Route path="not-found" element={<NotFound />} />

          {/* if user enter route which is does not exist then this below route page will be called by default */}
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </>
  )
);

function RouteComp() {
  return (
    <main>
      <RouterProvider router={getRouter} />
    </main>
  );
  // <div className="App">Hello, Ninjas!</div>;
}

export default RouteComp;
