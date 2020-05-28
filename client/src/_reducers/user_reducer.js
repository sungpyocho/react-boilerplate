import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "../_actions/types";

// Reducer: (previousState, action) => nextState
export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      // action.payload = data looks like {loginSucess: boolean, userId; ~~} which is returned by server
      // take a look at login API of index.js(server).
      // Why does action.payload receives that data?
      // It is because user_actions puts the request into payload
      return { ...state, loginSuccess: action.payload };

    case REGISTER_USER:
      return { ...state, registerSucess: action.payload };

    case AUTH_USER:
      return { ...state, userData: action.payload };

    default:
      return state;
  }
}
