import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../utils/axiosInstance";

const captainContext = createContext();

export const CaptainProvider = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/captains/get-current-captain");
        //console.log("CAPTAIN FETCH RES: ", res);
        if (res.status === 200) {
          setCaptain(res.data.data);
        }
      } catch (err) {
        console.error("Captain auth failed at captainContext, error: ", err);
        setCaptain(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const updateCaptain = useCallback((captainData) => {
    setCaptain(captainData);
  }, []);
  const clearCaptain = useCallback(() => {
    setCaptain(null);
  }, []);

  const setErrorState = useCallback((err) => {
    setError(err);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);
  const value = useMemo(() => ({
    captain,
    isLoading,
    error,
    updateCaptain,
    clearCaptain,
    setIsLoading,
    setErrorState,
    clearError,
  }));
  return (
    <captainContext.Provider value={value}>{children}</captainContext.Provider>
  );
};

export const useCaptain = () => {
  const context = useContext(captainContext);
  if (!context) {
    throw new Error("useCaptain must be used with CaptainContext");
  }
  return context;
};
