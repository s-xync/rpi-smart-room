import { LOGIN_SUCCESS, LOGIN_ERROR, APP_LOGOUT } from "../types";
import axios from "axios";

export const appLogin = credentials => dispatch => {
  axios
    .post(process.env.REACT_APP_ADMIN_API_URL + "/admins/login", {
      ...credentials
    })
    .then(response => {
      if (response.data.success) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: response.data.user
        });
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        dispatch({
          type: LOGIN_ERROR,
          payload: "Email / Password Incorrect!"
        });
      } else {
        dispatch({
          type: LOGIN_ERROR,
          payload: "Something is wrong!"
        });
      }
    });
};

export const getTokenInfo = () => dispatch => {
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  axios
    .get(process.env.REACT_APP_ADMIN_API_URL + "/admins/tokeninfo", {
      headers: {
        Authorization: jwt
      }
    })
    .then(response => {
      if (response.data.success) {
        let { user } = response.data;
        user.token = jwt;
        dispatch({
          type: LOGIN_SUCCESS,
          payload: user
        });
      }
    })
    .catch(error => {
      console.log(error);
      dispatch({
        type: APP_LOGOUT,
        payload: null
      });
    });
};

export const appLogout = () => dispatch => {
  dispatch({
    type: APP_LOGOUT,
    payload: null
  });
};
