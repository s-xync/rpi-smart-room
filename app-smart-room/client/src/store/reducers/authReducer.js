import { LOGIN_SUCCESS, LOGIN_ERROR, APP_LOGOUT } from "../types";

const initialState = {
  loggedIn: false,
  authErrorMsg: "",
  userId: "",
  email: "",
  firstName: "",
  lastName: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const { _id, email, firstName, lastName, token } = action.payload;
      localStorage.setItem("jwt", JSON.stringify(token));
      return {
        ...state,
        loggedIn: true,
        authErrorMsg: "",
        userId: _id,
        email,
        firstName,
        lastName
      };
    case LOGIN_ERROR:
      localStorage.removeItem("jwt");
      return {
        ...state,
        loggedIn: false,
        authErrorMsg: action.payload,
        userId: "",
        email: "",
        firstName: "",
        lastName: ""
      };

    case APP_LOGOUT:
      localStorage.removeItem("jwt");
      return {
        ...state,
        loggedIn: false,
        authErrorMsg: "",
        userId: "",
        email: "",
        firstName: "",
        lastName: ""
      };

    default:
      return state;
  }
};
