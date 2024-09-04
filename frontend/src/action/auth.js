import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL,
  PASSWORD_RESET_CONFIRM_SUCCESS,
  PASSWORD_RESET_CONFIRM_FAIL,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  UPDATE_STAFF_STATUS_FAIL,
  UPDATE_STAFF_STATUS_SUCCESS,
  ADD_USER_TO_PORTFOLIO_SUCCESS,
  ADD_USER_TO_PORTFOLIO_FAIL,
  PORTFOLIO_RETRIVAL_SUCCESS,
  PORTFOLIO_RETRIVAL_FAIL,
  PORTFOLIO_UPDATE_SUCCESS,
  PORTFOLIO_UPDATE_FAIL,
  RESET_DONE,
} from "./types";
import axios from "axios";
// import Cookies from "js-cookie";

export const reset = () => async (dispatch) => {
  dispatch({
    type: RESET_DONE,
  });
};

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const query = `
    query LoginUser($input: Login!) {
      login(input: $input){
      ... on User {
      _id
      firstName
      lastName
      email
      state
      phoneNumber
      token
      is_staff
      }
    ... on StringResult {
      message
      }
    }
    }
  `;

  const variables = {
    input: {
      email: email,
      password: password,
    },
  };

  const body = JSON.stringify({
    query: query,
    variables: variables,
  });

  try {
    const res = await axios.post("http://localhost:9000/graphql", body, config);

    if (res.data.data.login.token) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: await res.data.data.login,
      });
      dispatch(get_portfolio(email));
    } else {
      dispatch({
        type: LOGIN_FAIL,
      });
      return res.data.data.login.message;
    }
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const signup =
  (firstName, lastName, email, state, password) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const mutation = `
        mutation RegisterUser($input: Signup!) {
          registerUser(input: $input)
        }
      `;

    const variables = {
      input: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        state: state,
        password: password,
      },
    };

    const body = JSON.stringify({
      query: mutation,
      variables: variables,
    });

    try {
      const res = await axios.post(
        "http://localhost:9000/graphql",
        body,
        config
      );
      dispatch({
        type: SIGNUP_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: SIGNUP_FAIL,
      });
    }
  };

export const new_loan = (data) => async (dispatch) => {
  const token = localStorage.getItem("access");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const mutation = `
        mutation NewLoan($input: LoanInput!) {
          newLoan(input: $input)
        }
      `;

  const variables = {
    input: {
      guarantor: JSON.parse(data.get("guarantor")),
      loan: JSON.parse(data.get("loan")),
      account: JSON.parse(data.get("account")),
    },
  };

  const body = JSON.stringify({
    query: mutation,
    variables: variables,
  });

  try {
    const res = await axios.post("http://localhost:9000/graphql", body, config);
    return res.data.data.newLoan;
  } catch (err) {
    return err.message;
  }
};

export const fetch_loan = (email) => async (dispatch) => {
  const token = localStorage.getItem("access");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const query = `
    query GetLoan($email: String!) {
      getLoan(email: $email){
        guarantor{
          guaGender
          guaNumber
          guaAddress
          guaFirstName
          guaLastName
          relationship
        },
        loan{
          email
          firstName
          lastName
          phoneNumber
          bank
          duration
          amount
          loanStatus
          loanRepayment
        },
        account{
          bank
          accountNumber
          accountName
          accountBalance
          monthlyIncome
          bvn

        },
        createdAt,
        _id

      }
    }  
  `;

  const variables = {
    email: email,
  };

  const body = JSON.stringify({
    query: query,
    variables: variables,
  });
  var result = [
    {
      _id: 0,
      guarantor: {},
      loan: {},
      account: {},
      createdAt: 0,
    },
  ];
  var failed = false;

  try {
    const res = await axios.post("http://localhost:9000/graphql", body, config);

    result = res.data.data.getLoan;
  } catch (err) {
    failed = err.message;
  }

  return { result, failed };
};

export const add_portfolio = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const mutation = `
      mutation AddProfile($input: FormDataInput!) {
        addProfile(input: $input)
      }
    `;

  const variables = {
    input: {
      profile: JSON.parse(data.get("profile")),
      organization: JSON.parse(data.get("organization")),
      education: JSON.parse(data.get("education")),
      socials: JSON.parse(data.get("socials")),
    },
  };

  const body = JSON.stringify({
    query: mutation,
    variables: variables,
  });

  try {
    const res = await axios.post("http://localhost:9000/graphql", body, config);

    if (res.data.data.addProfile) {
      dispatch({
        type: ADD_USER_TO_PORTFOLIO_SUCCESS,
      });
    } else {
      dispatch({
        type: ADD_USER_TO_PORTFOLIO_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: ADD_USER_TO_PORTFOLIO_FAIL,
    });
  }
};

export const update_portfolio = (data) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const token = localStorage.getItem("access");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const mutation = `
      mutation UpdateProfile($input: FormDataInput!) {
        updateProfile(input: $input)
      }
    `;

    const variables = {
      input: {
        _id: data.get("_id"),
        profile: data.get("profile") ? JSON.parse(data.get("profile")) : null,
        guarantor: data.get("guarantor")
          ? JSON.parse(data.get("guarantor"))
          : null,
        account: data.get("account") ? JSON.parse(data.get("account")) : null,
        organization: data.get("organization")
          ? JSON.parse(data.get("organization"))
          : null,
        education: data.get("education")
          ? JSON.parse(data.get("education"))
          : null,
        socials: data.get("socials") ? JSON.parse(data.get("socials")) : null,
      },
    };

    const body = JSON.stringify({
      query: mutation,
      variables: variables,
    });

    try {
      await axios.post("http://localhost:9000/graphql", body, config);
      dispatch({
        type: PORTFOLIO_UPDATE_SUCCESS,
      });
    } catch (err) {
      dispatch({
        type: PORTFOLIO_UPDATE_FAIL,
      });
    }
  } else {
    dispatch({
      type: PORTFOLIO_UPDATE_FAIL,
    });
  }
};

export const get_portfolio = (email) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const token = localStorage.getItem("access");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const query = `
      query GetProfile($email: String!) {
        getProfile(email: $email){
          organization{
            orgName,
            orgNumber,
            officeEmail,
            employmentStatus,
            sector,
            duration
          },
          socials{
            twitter
            instagram
            facebook
          },
          education{
            level
          },
          profile{
            firstName,
            lastName,
            phoneNumber,
            email,
            userName,
            bvn,
            address,
            avatar,
          },
            _id
        }
      }
    `;

    const variables = {
      email: email,
    };

    const body = JSON.stringify({
      query: query,
      variables: variables,
    });

    try {
      const res = await axios.post(
        "http://localhost:9000/graphql",
        body,
        config
      );

      dispatch({
        type: PORTFOLIO_RETRIVAL_SUCCESS,
        payload: res.data.data.getProfile,
      });
      return res.data.data.getProfile;
    } catch (err) {
      dispatch({
        type: PORTFOLIO_RETRIVAL_FAIL,
      });
    }
  } else {
    dispatch({
      type: PORTFOLIO_RETRIVAL_FAIL,
    });
  }
};

export const is_staff = (email) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",

      Accept: "application/json",
    },
  };

  try {
    const res = await axios.get(
      `${process.env.REACT_APP_LENDSQR_API_URL}/api/get_staff_status`,
      {
        params: { email: email },
      },
      config
    );

    dispatch({
      type: UPDATE_STAFF_STATUS_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: UPDATE_STAFF_STATUS_FAIL,
    });
  }
};

export const reset_password = (email) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email });

  try {
    await axios.post(
      `${process.env.REACT_APP_LENDSQR_API_URL}/auth/users/reset_password`,
      body,
      config
    );
    dispatch({
      type: PASSWORD_RESET_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: PASSWORD_RESET_FAIL,
    });
  }
};

export const password_reset_confirm =
  (uid, token, new_password) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ uid, token, new_password });
    try {
      await axios.post(
        `${process.env.REACT_APP_LENDSQR_API_URL}/auth/users/reset_password_confirm`,
        body,
        config
      );
      dispatch({
        type: PASSWORD_RESET_CONFIRM_SUCCESS,
      });
    } catch (err) {
      dispatch({
        type: PASSWORD_RESET_CONFIRM_FAIL,
      });
    }
  };

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};
