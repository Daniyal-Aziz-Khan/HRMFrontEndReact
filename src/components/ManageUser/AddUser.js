import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { addUser } from "../redux/AdminController";
import * as Yup from "yup";
import { useRef, useState } from "react";
import defaultImageSrc from "../../assets/images/users/user1.jpg";

const initialValues = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  password: "",
  cpassword: "",
  phoneNumber: "",
  address: "",
  dob: "",
  gender: "Male",
  profilePicture: null,
};

const validateAddUser = Yup.object({
  firstName: Yup.string().min(3).required("Please enter first name"),
  lastName: Yup.string().min(3).required("Please enter last name"),
  userName: Yup.string().min(3).required("Please enter user name"),
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
  phoneNumber: Yup.string()
    .min(6, "Phone Number must be at leat 6 charactors")
    .required("Please enter phone number"),
  dob: Yup.date().required("Please select your date of birth"),
  gender: Yup.string().required("Please select your gender"),
  profilePicture: Yup.mixed()
    .required("Profile picture is required")
    .test("fileSize", "File size must be less than 2MB", (value) => {
      if (!value) return true; // No file selected, consider it valid
      const isFileSizeValid = value.size <= 2 * 1024 * 1024; // 2 MB limit

      if (!isFileSizeValid) {
        throw new Yup.ValidationError(
          "File size must be less than 2MB",
          value,
          "profilePicture"
        );
      }

      return isFileSizeValid;
    }),
});

function AddUser() {
  const dispatch = useDispatch();

  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];

    if (file && file.size <= 2 * 1024 * 1024) {
      // Display the preview of the selected image
      setPreviewImage(URL.createObjectURL(file));
      // Update formik values
      setFieldValue("profilePicture", file);
    } else {
      // File size exceeds 2MB, set default image
      setPreviewImage(defaultImageSrc);
      // Update formik values (optional, set to null or handle as needed)
      setFieldValue("profilePicture", null);
      // Clear the file input value
      fileInputRef.current.value = "";
      alert("File Size exceeds from 2MB");
    }
  };

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: validateAddUser,
    onSubmit: (values) => {
      console.log(values);
      dispatch(addUser(values));
    },
  });

  return (
    <div>
      {/* <div className="align-items-center justify-content-between mb-1">
          <h1 className="h3 mb-0 text-gray-800 text-center">Add User</h1>
        </div> */}
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
                      <h1 className="h3 text-gray-900 mb-4">Add User</h1>
                    </div>
                    <form className="user" onSubmit={handleSubmit}>
                      <div className="form-group col-lg-12">
                        <label
                          className="form-label ml-1 text-bold"
                          htmlFor="exampleInputFirstName"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-user"
                          id="exampleInputFirstName"
                          placeholder="Enter First Name"
                          value={values.firstName}
                          onBlur={handleBlur("firstName")}
                          onChange={handleChange("firstName")}
                        />
                        {errors.firstName && (
                          <small className="text-danger">
                            {errors.firstName}
                          </small>
                        )}
                      </div>

                      <div className="form-group col-lg-12">
                        <label
                          className="form-label ml-1 text-bold"
                          htmlFor="exampleInputLastName"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-user"
                          id="exampleInputLastName"
                          placeholder="Enter Last Name"
                          value={values.lastName}
                          onBlur={handleBlur("lastName")}
                          onChange={handleChange("lastName")}
                        />
                        {errors.lastName && (
                          <small className="text-danger">
                            {errors.lastName}
                          </small>
                        )}
                      </div>

                      <div className="form-group col-lg-12">
                        <label
                          className="form-label ml-1 text-bold"
                          htmlFor="exampleInputUserName"
                        >
                          User Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-user"
                          id="exampleInputUserName"
                          placeholder="Enter User Name"
                          value={values.userName}
                          onBlur={handleBlur("userName")}
                          onChange={handleChange("userName")}
                        />
                        {errors.userName && (
                          <small className="text-danger">
                            {errors.userName}
                          </small>
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
                          placeholder="Enter Password"
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
                          htmlFor="exampleInputCPassword"
                        >
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          className="form-control form-control-user"
                          id="exampleInputCPassword"
                          placeholder="Enter Confirm Password"
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
                        <label
                          className="form-label ml-1 text-bold"
                          htmlFor="exampleInputAddress"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-user"
                          id="exampleInputAddress"
                          placeholder="Enter Address"
                          value={values.address}
                        />
                      </div>

                      <div className="form-group col-lg-12">
                        <label
                          className="form-label ml-1 text-bold"
                          htmlFor="exampleInputDOB"
                          title="Date Of Birth"
                        >
                          DOB
                        </label>
                        <input
                          type="datetime-local"
                          className="form-control form-control-user"
                          id="exampleInputDOB"
                          value={values.dob}
                          onChange={handleChange("dob")}
                        />
                        {errors.dob && (
                          <small className="text-danger">{errors.dob}</small>
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
                        {errors.gender && (
                          <small className="text-danger">{errors.gender}</small>
                        )}
                      </div>

                      <div className="form-group col-lg-12">
                        <div className="row">
                          <div className="col-lg-8">
                            <label
                              className="form-label ml-1 text-bold"
                              htmlFor="exampleInputPP"
                            >
                              Profile Picture
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              className="form-control"
                              id="exampleInputPP"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                            />
                            {errors.profilePicture && (
                              <small className="text-danger">
                                {errors.profilePicture}
                              </small>
                            )}
                          </div>
                          <div
                            className="col-lg-4"
                            style={{ textAlign: "center" }}
                          >
                            {/* {selectedImages && selectedImages.length > 0 ? (
                              selectedImages.map((image, index) => (
                                <img
                                  key={index}
                                  src={URL.createObjectURL(image)}
                                  className="rounded-circle m-2"
                                  width={100}
                                  height={100}
                                  alt={`Selected ${index + 1}`}
                                />
                              ))
                            ) : ( */}
                            <img
                              src={
                                previewImage ||
                                (values.profilePicture
                                  ? URL.createObjectURL(values.profilePicture)
                                  : defaultImageSrc)
                              }
                              className="rounded-circle"
                              width={100}
                              height={100}
                              alt="user-profile"
                            />
                            {/* )} */}
                          </div>
                        </div>

                        {/* {errors.dob && (
                          <small className="text-danger">{errors.dob}</small>
                        )} */}
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary btn-user btn-block"
                      >
                        Add User
                      </button>
                      <hr />
                      {/* <a
                          href="index.html"
                          className="btn btn-primary btn-user btn-block"
                        >
                          Back To List
                        </a> */}
                      <NavLink
                        className="btn btn-primary btn-user btn-block"
                        to="/user-list"
                      >
                        Back To list
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

export default AddUser;
