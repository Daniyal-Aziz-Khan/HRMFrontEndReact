import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const initialValues = {
  name: "",
  email: "",
  password: "",
  phoneNumber: "",
  gender: "Male",
};

const validateEditUser = Yup.object({
  name: Yup.string().min(3).required("Please enter name"),
  email: Yup.string()
    // .email("Please enter valid email")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
      "Please enter a valid email"
    )
    .required("Please enter email"),
  password: Yup.string().min(5).required("Please enter password"),
  phoneNumber: Yup.string()
    .min(6, "Phone Number must be at leat 6 charactors")
    .required("Please enter phone number"),
  gender: Yup.string().required("Please select your gender"),
});

function EditUser() {
  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues: initialValues,
    validationSchema: validateEditUser,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div>
      {/* Outer Row */}
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          <div className="card o-hidden border-0 shadow-lg my-3">
            <div className="card-body p-0">
              {/* Nested Row within Card Body */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h3 text-gray-900 mb-4">Edit User</h1>
                    </div>
                    <form className="user" onSubmit={handleSubmit}>
                      <div className="form-group col-lg-12">
                        <label
                          className="form-label ml-1 text-bold"
                          htmlFor="exampleInputName"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-user"
                          id="exampleInputName"
                          placeholder="Enter Name"
                          value={values.name}
                          onBlur={handleBlur("name")}
                          onChange={handleChange("name")}
                        />
                        {errors.name && (
                          <small className="text-danger">{errors.name}</small>
                        )}
                      </div>

                      <div className="form-group col-lg-12">
                        <label
                          className="form-label ml-1 text-bold"
                          htmlFor="exampleInputEmail"
                        >
                          Email
                        </label>
                        <input
                          className="form-control form-control-user"
                          type="email"
                          id="exampleInputEmail"
                          aria-describedby="emailHelp"
                          placeholder="Enter Email Address..."
                          value={values.email}
                          onBlur={handleBlur("email")}
                          onChange={handleChange("email")}
                        />
                        {errors.email && (
                          <small className="text-danger">{errors.email}</small>
                        )}
                      </div>

                      <div className="form-group col-lg-12">
                        <label
                          className="form-label ml-1 text-bold"
                          htmlFor="exampleInputPassword"
                        >
                          Password
                        </label>
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

                      <div className="form-group col-lg-12">
                        <label
                          className="form-label ml-1 text-bold"
                          htmlFor="exampleInputNumber"
                        >
                          Phone Number
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-user"
                          id="exampleInputNumber"
                          placeholder="Enter Phone Number"
                          value={values.phoneNumber}
                          onBlur={handleBlur("phoneNumber")}
                          onChange={handleChange("phoneNumber")}
                        />
                        {errors.phoneNumber && (
                          <small className="text-danger">
                            {errors.phoneNumber}
                          </small>
                        )}
                      </div>

                      <div className="form-group col-lg-12">
                        <label className="form-label ml-1 text-bold">
                          Gender
                        </label>
                        <div className="custom-control custom-checkbox small ml-1">
                          <input
                            type="radio"
                            className="custom-control-input"
                            id="customCheckMale"
                            name="GenderRadioCheck"
                            value="Male"
                            checked={values.gender === "Male"}
                            onChange={handleChange("gender")}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customCheckMale"
                          >
                            Male
                          </label>
                        </div>
                        <div className="custom-control custom-checkbox small ml-1">
                          <input
                            type="radio"
                            className="custom-control-input"
                            id="customCheckFemale"
                            name="GenderRadioCheck"
                            value="Female"
                            checked={values.gender === "Female"}
                            onChange={handleChange("gender")}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customCheckFemale"
                          >
                            Female
                          </label>
                        </div>
                      </div>

                      <button
                        className="btn btn-primary btn-user btn-block"
                        type="submit"
                      >
                        Update User
                      </button>
                      <hr />
                      <NavLink
                        to="/user-list"
                        className="btn btn-primary btn-user btn-block"
                      >
                        Back To List
                      </NavLink>
                    </form>
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

export default EditUser;
