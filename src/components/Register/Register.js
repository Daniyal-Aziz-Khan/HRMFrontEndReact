import { Component } from "react";
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const initialValues = {
  fname: "",
  lname: "",
  email: "",
  password: "",
  cpassword: "",
};

const validateRegister = Yup.object({
  fname: Yup.string().min(3).required("Please enter first name"),
  lname: Yup.string().min(3).required("Please enter last name"),
  email: Yup.string()
    // .email("Please enter valid email")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
      "Please enter a valid email"
    )
    .required("Please enter email"),
  password: Yup.string().min(5).required("Please enter password"),
  cpassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password not matched")
    .required("Please enter password"),
});

function Register() {
  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues: initialValues,
    validationSchema: validateRegister,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div className="bg-gradient-primary">
      <div className="container">
        <div className="card o-hidden border-0 shadow-lg my-5">
          <div className="card-body p-0">
            {/* Nested Row within Card Body */}
            <div className="row">
              <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
              <div className="col-lg-7">
                <div className="p-5">
                  <div className="text-center">
                    <h1 className="h4 text-gray-900 mb-4">
                      Create an Account!
                    </h1>
                  </div>
                  <form className="user" onSubmit={handleSubmit}>
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="text"
                          className="form-control form-control-user"
                          id="exampleFirstName"
                          placeholder="First Name"
                          value={values.fname}
                          onBlur={handleBlur("fname")}
                          onChange={handleChange("fname")}
                        />
                        {errors.fname && (
                          <small className="text-danger">{errors.fname}</small>
                        )}
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-control-user"
                          id="exampleLastName"
                          placeholder="Last Name"
                          value={values.lname}
                          onBlur={handleBlur("lname")}
                          onChange={handleChange("lname")}
                        />
                        {errors.lname && (
                          <small className="text-danger">{errors.lname}</small>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control form-control-user"
                        id="exampleInputEmail"
                        placeholder="Email Address"
                        value={values.email}
                        onBlur={handleBlur("email")}
                        onChange={handleChange("email")}
                      />
                      {errors.email && (
                        <small className="text-danger">{errors.email}</small>
                      )}
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="password"
                          className="form-control form-control-user"
                          id="exampleInputPassword"
                          placeholder="Password"
                          value={values.password}
                          onBlur={handleBlur("password")}
                          onChange={handleChange("password")}
                        />
                        {errors.password && (
                          <small className="text-danger">
                            {errors.password}
                          </small>
                        )}
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="password"
                          className="form-control form-control-user"
                          id="exampleRepeatPassword"
                          placeholder="Repeat Password"
                          value={values.cpassword}
                          onBlur={handleBlur("cpassword")}
                          onChange={handleChange("cpassword")}
                        />
                        {errors.cpassword && (
                          <small className="text-danger">
                            {errors.cpassword}
                          </small>
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-user btn-block"
                    >
                      Register Account
                    </button>
                    <hr />
                    <button className="btn btn-primary btn-user btn-block">
                      <i className="fab fa-google fa-fw"></i> Register with
                      Google
                    </button>
                    <button className="btn btn-primary btn-user btn-block">
                      <i className="fab fa-facebook-f fa-fw"></i> Register with
                      Facebook
                    </button>
                  </form>
                  <hr />
                  <div className="text-center">
                    <NavLink className="small" to="/forgot-password">
                      Forgot Password?
                    </NavLink>
                  </div>
                  <div className="text-center">
                    <NavLink className="small" to="/">
                      Already have an account? Login!
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
