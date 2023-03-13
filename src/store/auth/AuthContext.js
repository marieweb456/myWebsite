import { createContext, useEffect, useReducer } from 'react';
import AuthReducer from './AuthReducer';

const INITIAL_STATE = {
  currentAdmin: JSON.parse(localStorage.getItem('admin')) || null,
  currentUser: JSON.parse(localStorage.getItem('user')) || null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.currentAdmin === undefined) {
      localStorage.setItem('admin', null);
      return (state.currentAdmin = null);
    }
    localStorage.setItem('admin', JSON.stringify(state.currentAdmin));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentAdmin]);

  useEffect(() => {
    if (state.currentUser === undefined) {
      localStorage.setItem('user', null);
      return (state.currentUser = null);
    }
    localStorage.setItem('user', JSON.stringify(state.currentUser));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentAdmin: state.currentAdmin,
        currentUser: state.currentUser,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
