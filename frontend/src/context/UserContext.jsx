import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../utils/axiosInstance";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/users/current-user");
        console.log("(userContext)CURRENT USER RES: ", res);
        setUser(res.data.data.user);
      } catch (error) {
        console.error("USERCONTEXT USER-AUTH FAILED:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);
  const updateUser = useCallback((user) => {
    setUser(user);
  }, []);
  const clearUser = useCallback((user) => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      updateUser,
      clearUser,
    }),
    [user, isLoading, updateUser, clearUser]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used with UserContext");
  }
  return context;
};
