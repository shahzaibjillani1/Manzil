import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  registerUser,
  logoutUser,
  upgradeToHost,
  loadCurrentUser,
  updateUserProfile,
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsAdmin,
  selectIsOwner,
} from '../redux/slices/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const isOwner = useSelector(selectIsOwner);
  const loading = useSelector((state) => state.auth.loading);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      dispatch(loadCurrentUser());
    }
  }, [dispatch, user]);

  const login = async (email, password) => {
    const result = await dispatch(loginUser({ email, password }));
    return loginUser.fulfilled.match(result);
  };

  const register = async (userData) => {
    const result = await dispatch(registerUser(userData));
    return registerUser.fulfilled.match(result);
  };

  const becomeHost = async () => {
    const result = await dispatch(upgradeToHost());
    return upgradeToHost.fulfilled.match(result);
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const updateUser = (updatedFields) => {
    dispatch(updateUserProfile(updatedFields));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isOwner,
        isAdmin,
        loading,
        login,
        register,
        becomeHost,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
