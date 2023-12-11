import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError, getResponse } from "../Handler/ExceptionHandler";
import { toast } from "react-toastify";

const baseUrl = "https://localhost:7093/api/";

//#region Login, Logout
export const postLogin = createAsyncThunk(
  "user/postLogin",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.post(
        `${baseUrl}Auth/Login`,
        userData,
        config
      );
      const responseBack = getResponse(response, dispatch);
      if (!responseBack && responseBack === undefined) {
        return responseBack;
      }
      localStorage.setItem("userInfo", JSON.stringify(responseBack));
      return responseBack;
    } catch (error) {
      handleApiError(error, dispatch);
    }
  }
);

export const logoutAction = createAsyncThunk(
  "/user/logout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.auth?.userAuth;
    try {
      localStorage.removeItem("userInfo");
    } catch (error) {
      handleApiError(error, dispatch, user);
    }
  }
);

//get user from local storage and place into store
const userLoginFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;
//#endregion

//#region Profile
export const getLoggedInUser = createAsyncThunk(
  "user/profile",
  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const response = await axios.get(
        `${baseUrl}Auth/GetLoggedinUser?id=${id}`,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      handleApiError(error, dispatch, user);
    }
  }
);

export const updateProfileImage = createAsyncThunk(
  "user/updateProfileImage",
  async (user, { rejectWithValue, getState, dispatch }) => {
    const users = getState()?.authentication?.userAuth;
    const formData = new FormData();
    formData.append("Id", user.Id);
    if (user.isDeleted) {
      formData.append("isDelete", 1);
    } else {
      formData.append("file", user.file);
    }
    const config = {
      headers: {
        Authorization: `Bearer ${users?.token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await axios.put(
        `${baseUrl}Auth/UpdateProfilePicture`,
        formData,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      if (response?.data?.status) {
        toast.success(response?.data?.message);
      }
      return responseBack;
    } catch (error) {
      handleApiError(error, dispatch, user);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (users, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    try {
      const response = await axios.put(
        `${baseUrl}Auth/UpdateProfile`,
        users,
        config
      );
      const responseBack = getResponse(response, dispatch, user);
      if (response?.data?.status) {
        localStorage.setItem("userInfo", JSON.stringify(responseBack));
        console.log("Profile Update:", responseBack);
        toast.success(response?.data?.message);
      }
      return responseBack;
    } catch (error) {
      handleApiError(error, dispatch, user);
    }
  }
);
//#endregion

//#region Password
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (user, { rejectWithValue, getState, dispatch }) => {
    //get user token
    const users = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${users?.token}`,
      },
    };

    try {
      const response = await axios.put(
        `${baseUrl}Auth/UpdatePassword`,
        user,
        config
      );

      getResponse(response, dispatch, users);
      if (response?.data?.status) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      handleApiError(error, dispatch, users);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/ForgotEmail",
  async (email, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(
        `${baseUrl}Auth/ForgotPassword`,
        email,
        config
      );
      getResponse(response, dispatch);
      if (response?.data?.status) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      handleApiError(error, dispatch);
    }
  }
);
//#endregion

const authSlices = createSlice({
  name: "authentication",
  initialState: {
    userAuth: userLoginFromStorage,
    loading: false,
    appErr: null,
    appStatus: null,
    appStatusCode: null,
    serverErr: null,
  },
  extraReducers: (builder) => {
    builder.addCase(postLogin.pending, (state, action) => {
      state.appErr = undefined;
      state.loading = true;
      state.serverErr = undefined;
      state.appStatus = action.payload?.status || null;
      state.appStatusCode = action.payload?.statusCode || null;
    });
    builder.addCase(postLogin.fulfilled, (state, action) => {
      state.userAuth = action?.payload;
      state.appErr = undefined;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action.payload?.status || null;
      state.appStatusCode = action.payload?.statusCode || null;
    });
    builder.addCase(postLogin.rejected, (state, action) => {
      state.appErr = action.payload?.message || null;
      state.serverErr =
        action.error?.message || "An error occurred on the server.";
      state.appStatus = action.payload?.status || null;
      state.appStatusCode = action.payload?.statusCode || null;
      state.loading = false;
    });

    //Logout
    builder.addCase(logoutAction.pending, (state, action) => {
      state.loading = false;
    });
    builder.addCase(logoutAction.fulfilled, (state, action) => {
      state.userAuth = undefined;
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(logoutAction.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.loading = false;
    });

    builder.addCase(updateProfileImage.pending, (state, action) => {
      state.profileLoading = true;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    builder.addCase(updateProfileImage.fulfilled, (state, action) => {
      state.userAuth = action?.payload;
      state.profileLoading = false;
      state.profileAppErr = action?.payload?.message;
      state.profileServerErr = action?.error?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    builder.addCase(updateProfileImage.rejected, (state, action) => {
      state.profileAppErr = action?.payload?.message;
      state.profileServerErr = action?.error?.message;
      state.profileLoading = false;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(updateProfile.pending, (state, action) => {
      state.profileLoading = true;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.userAuth = action?.payload;
      state.profileLoading = false;
      state.profileAppErr = action?.payload?.message;
      state.profileServerErr = action?.error?.message;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.profileAppErr = action?.payload?.message;
      state.profileServerErr = action?.error?.message;
      state.profileLoading = false;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });

    builder.addCase(updatePassword.pending, (state, action) => {
      state.loading = true;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.loading = false;
      state.appStatus = false;
      state.appStatusCode = undefined;
      state.profileAppErr = undefined;
      state.profileServerErr = undefined;
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.appErr = action?.payload?.message;
      state.loading = false;
      state.serverErr = undefined;
      state.appStatus = action?.payload?.status;
      state.appStatusCode = action?.payload?.statusCode;
    });
  },
});

export default authSlices.reducer;
