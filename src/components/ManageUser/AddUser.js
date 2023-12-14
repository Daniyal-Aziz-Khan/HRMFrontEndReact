import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { addUser, companyListDropdown } from "../redux/AdminController";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import defaultImageSrc from "../../assets/images/users/user1.jpg";
import defaultImageCNICSrc from "../../assets/images/users/defaultImageCNICSrc.jpg";
import Spinner from "react-bootstrap/Spinner";

function AddUser() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isUpdateCall, setIsUpdate] = useState(false);

  //#region fetch compnay list
  const [showSpinner, setShowSpinner] = useState(true);
  const [companyDropdown, setCompanyDropdown] = useState([]);
  const fetchCompaniesList = async () => {
    setShowSpinner(true);
    try {
      const response = await dispatch(companyListDropdown());

      if (companyListDropdown.fulfilled.match(response)) {
        setCompanyDropdown(response?.payload);
        console.log("company list: ", response?.payload);
        // const getCompnayDropdown = response?.payload?.list?.map((item) => {
        //   Check if the column value is null
        //   if (item && item.profilePicture === "") {
        //     item.profilePicture = defaultImageSrc;
        //   }
        //   return item;
        // });
      }
      setShowSpinner(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchCompaniesList();
  }, []);
  //#endregion

  const getRecord = location.userRow;

  if (getRecord?.id) {
    setIsUpdate(true);
  }

  const initialValues = {
    companyId: getRecord?.companyId || "",
    id: getRecord?.id || "",
    role: getRecord?.role || 3,
    firstName: getRecord?.firstName || "",
    lastName: getRecord?.lastName || "",
    userName: getRecord?.userName || "",
    email: getRecord?.email || "",
    password: getRecord?.password || "",
    cpassword: getRecord?.cpassword || "",
    phoneNumber: getRecord?.phoneNumber || "",
    address: getRecord?.address || "",
    dob: getRecord?.dob || "",
    employeeId: getRecord?.employeeId || "",
    gender: getRecord?.gender || "Male",
    profilePicture: getRecord?.profilePicture || null,
    cnicFrontScan: getRecord?.cnicFrontScan || null,
    cnicBackScan: getRecord?.cnicBackScan || null,
    isUpdate: isUpdateCall,
  };

  const validateAddUser = Yup.object().shape({
    isUpdate: Yup.bool().required(),
    companyId: Yup.string().required("Please select company"),
    firstName: Yup.string().min(3).required("Please enter first name"),
    lastName: Yup.string().min(3).required("Please enter last name"),
    userName: Yup.string().when(["isUpdate"], (isUpdate, schema) => {
      console.log("idUpdate:", isUpdate);
      return isUpdate[0]
        ? schema.optional()
        : schema.min(3).required("Please enter user name");
    }),
    email: Yup.string()
      // .email("Please enter valid email")
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
        "Please enter a valid email"
      )
      .required("Please enter email"),
    password: Yup.string().when(["isUpdate"], (isUpdate, schema) => {
      return isUpdate[0]
        ? schema.optional()
        : schema.min(3).required("Please enter password");
    }),
    cpassword: Yup.string().when(["isUpdate"], (isUpdate, schema) => {
      return isUpdate[0]
        ? schema.optional()
        : schema
            .oneOf([Yup.ref("password")], "Password not matched")
            .required("Please enter password");
    }),
    phoneNumber: Yup.string()
      .min(6, "Phone Number must be at leat 6 charactors")
      .required("Please enter phone number"),
    dob: Yup.date().required("Please select your date of birth"),
    employeeId: Yup.string().when(["isUpdate"], (isUpdate, schema) => {
      return isUpdate[0]
        ? schema.optional()
        : schema
            .min(1, "Employee Id must be at leat 1 digit")
            .required("Please enter employee id");
    }),
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
    cnicFrontScan: Yup.mixed()
      .required("CNIC Front Image is required")
      .test("fileSize", "File size must be less than 2MB", (value) => {
        if (!value) return true; // No file selected, consider it valid
        const isFileSizeValid = value.size <= 2 * 1024 * 1024; // 2 MB limit

        if (!isFileSizeValid) {
          throw new Yup.ValidationError(
            "File size must be less than 2MB",
            value,
            "cnicFrontScan"
          );
        }
        return isFileSizeValid;
      }),
    cnicBackScan: Yup.mixed()
      .required("CNIC Back Image is required")
      .test("fileSize", "File size must be less than 2MB", (value) => {
        if (!value) return true; // No file selected, consider it valid
        const isFileSizeValid = value.size <= 2 * 1024 * 1024; // 2 MB limit

        if (!isFileSizeValid) {
          throw new Yup.ValidationError(
            "File size must be less than 2MB",
            value,
            "cnicBackScan"
          );
        }

        return isFileSizeValid;
      }),
  });

  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [previewImageCNICF, setPreviewImageCNICF] = useState(null);
  const fileInputCNICFRef = useRef(null);
  const [previewImageCNICB, setPreviewImageCNICB] = useState(null);
  const fileInputCNICBRef = useRef(null);

  const handleFileChange = ({ event, name }) => {
    const file = event.currentTarget.files[0];
    console.log(name);
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

  const handleCNICFileChange = ({ event, name }) => {
    const file = event.currentTarget.files[0];
    console.log(name);
    if (file && file.size <= 2 * 1024 * 1024) {
      if (name === "cnicFrontScan") {
        setPreviewImageCNICF(URL.createObjectURL(file));
      } else if (name === "cnicBackScan") {
        setPreviewImageCNICB(URL.createObjectURL(file));
      }

      setFieldValue(name, file);
    } else {
      // File size exceeds 2MB, set default image
      // Update formik values (optional, set to null or handle as needed)
      setFieldValue(name, null);

      if (name === "cnicFrontScan") {
        setPreviewImageCNICF(defaultImageCNICSrc);
        fileInputCNICFRef.current.value = "";
      } else if (name === "cnicBackScan") {
        setPreviewImageCNICB(defaultImageCNICSrc);
        fileInputCNICBRef.current.value = "";
      }

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
                          htmlFor="exampleInputSComp"
                        >
                          Select Compnay
                          {showSpinner && (
                            <span>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </label>
                        <select
                          disabled={showSpinner}
                          className="form-control"
                          id="exampleInputSComp"
                          value={values.companyId}
                          onBlur={handleBlur("companyId")}
                          onChange={handleChange("companyId")}
                        >
                          <option
                            selected={isUpdateCall ? false : true}
                            disabled="true"
                            value=""
                          >
                            Select Company
                          </option>
                          {companyDropdown &&
                            companyDropdown.map((item) => (
                              <option
                                key={item.id}
                                value={item.id}
                                selected={values.companyId === item.id}
                              >
                                {item.companyName}
                              </option>
                            ))}
                        </select>
                        {/* <input
                          type="text"
                          className="form-control form-control-user"
                          id="exampleInputSComp"
                          value={values.companyId}
                          onBlur={handleBlur("companyId")}
                          onChange={handleChange("companyId")}
                        /> */}
                        {errors.companyId && (
                          <small className="text-danger">
                            {errors.companyId}
                          </small>
                        )}
                      </div>

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
                          readOnly={isUpdateCall}
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
                          readOnly={isUpdateCall}
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

                      <div
                        className="form-group col-lg-12"
                        style={{ display: isUpdateCall ? "none" : "block" }}
                      >
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

                      <div
                        className="form-group col-lg-12"
                        style={{ display: isUpdateCall ? "none" : "block" }}
                      >
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
                          onBlur={handleBlur("address")}
                          onChange={handleChange("address")}
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
                        <label
                          className="form-label ml-1 text-bold"
                          htmlFor="exampleInputEmployeeId"
                        >
                          Employee Id
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-user"
                          id="exampleInputEmployeeId"
                          placeholder="Enter Employee Id"
                          value={values.employeeId}
                          onBlur={handleBlur("employeeId")}
                          onChange={handleChange("employeeId")}
                        />
                        {errors.employeeId && (
                          <small className="text-danger">
                            {errors.employeeId}
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
                              onChange={(event) =>
                                handleFileChange({
                                  event,
                                  name: "profilePicture",
                                })
                              }
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
                          </div>
                        </div>
                      </div>

                      <div className="form-group col-lg-12">
                        <div className="row">
                          <div className="col-lg-8">
                            <label
                              className="form-label ml-1 text-bold"
                              htmlFor="exampleInputFCNIC"
                            >
                              CNIC Front Image
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              className="form-control"
                              id="exampleInputFCNIC"
                              ref={fileInputCNICFRef}
                              onChange={(event) =>
                                handleCNICFileChange({
                                  event,
                                  name: "cnicFrontScan",
                                })
                              }
                            />
                            {errors.cnicFrontScan && (
                              <small className="text-danger">
                                {errors.cnicFrontScan}
                              </small>
                            )}
                          </div>
                          <div
                            className="col-lg-4"
                            style={{ textAlign: "center" }}
                          >
                            <img
                              src={
                                previewImageCNICF ||
                                (values.cnicFrontScan
                                  ? URL.createObjectURL(values.cnicFrontScan)
                                  : defaultImageCNICSrc)
                              }
                              className="rounded-circle"
                              width={100}
                              height={100}
                              alt="user-profile"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group col-lg-12">
                        <div className="row">
                          <div className="col-lg-8">
                            <label
                              className="form-label ml-1 text-bold"
                              htmlFor="exampleInputBCNIC"
                            >
                              CNIC Back Image
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              className="form-control"
                              id="exampleInputBCNIC"
                              ref={fileInputCNICBRef}
                              onChange={(event) =>
                                handleCNICFileChange({
                                  event,
                                  name: "cnicBackScan",
                                })
                              }
                            />
                            {errors.cnicBackScan && (
                              <small className="text-danger">
                                {errors.cnicBackScan}
                              </small>
                            )}
                          </div>
                          <div
                            className="col-lg-4"
                            style={{ textAlign: "center" }}
                          >
                            <img
                              src={
                                previewImageCNICB ||
                                (values.cnicBackScan
                                  ? URL.createObjectURL(values.cnicBackScan)
                                  : defaultImageCNICSrc)
                              }
                              className="rounded-circle"
                              width={100}
                              height={100}
                              alt="user-profile"
                            />
                          </div>
                        </div>
                      </div>
                      <input type="hidden" value={values.id} />
                      <input type="hidden" value={values.role} />
                      <button
                        type="submit"
                        className="btn btn-primary btn-user btn-block"
                      >
                        Add User
                      </button>
                      <hr />
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
