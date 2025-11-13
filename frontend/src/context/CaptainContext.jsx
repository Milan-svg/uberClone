import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const captainContext = createContext();

export const CaptainProvider = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCaptain = useCallback((captainData) => {
    setCaptain(captainData);
  }, []);
  const clearCaptain = useCallback(() => {
    setCaptain(null);
  }, []);
  const setLoadingState = useCallback((loading) => {
    setIsLoading(loading);
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
