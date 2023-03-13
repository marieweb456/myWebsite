const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN': {
      return {
        currentAdmin: action.payload,
      };
    }
    case 'LOGOUT': {
      return {
        currentAdmin: null,
      };
    }
    case 'CONNECTED_ON': {
      return {
        currentUser: action.payload,
      };
    }
    case 'CONNECTED_OFF': {
      return {
        currentUser: null,
      };
    }
    default:
      return state;
  }
};

export default AuthReducer;
