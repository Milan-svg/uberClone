import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../utils/axiosInstance";
import { useUser } from "./UserContext";
import { useCaptain } from "./CaptainContext";
import { useSocket } from "./SocketContext";
const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [currentRide, setCurrentRide] = useState(null);
  const [rideStatus, setRideStatus] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useUser();
  const { captain } = useCaptain();
  const { socket } = useSocket();

  const userType = useMemo(() => {
    if (user?._id) return "user";
    if (captain?._id) return "captain";
    return null;
  }, [user, captain]);

  // use useEffect, fetch current ride, cleanup any stale rides
  const syncRideState = useCallback(async (runCleanup = false) => {
    try {
      setIsSyncing(true);

      if (runCleanup) {
        try {
          const res = await api.delete("rides/cleanup");
          if (res.status === 200) {
            // console.log(
            //   "STALE RIDES CLEANUP SUCCESS at rideCotext: ",
            //   res.data
            // );
          }
        } catch (error) {
          console.error("STALE RIDES CLEANUP FAILED at rideCotext", error);
        }
      }
      const res = await api.get("/rides/current");

      //console.log("CuRRENT RIDE FETCH: ", res);

      if (res.status === 200) {
        const ride = res.data?.data || null;
        setCurrentRide(ride);
        setRideStatus(ride?.status || null);
        return ride;
      }
    } catch (error) {
      console.error("RIDE FETCH AT RIDECONTEXT FAILED: ", error);
      setCurrentRide(null);
      setRideStatus(null);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (userType) {
      //console.log("SYNCING RIDE STATE at rideContext");
      syncRideState(true);
    }
  }, [userType, syncRideState]);

  const value = useMemo(
    () => ({
      currentRide,
      rideStatus,
      isSyncing,
      userType,
      syncRideState,
    }),
    [currentRide, rideStatus, isSyncing, userType, syncRideState]
  );
  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) {
    console.error("RIDE CONTEXT MUST BE USED WITH useRide");
  }
  return context;
};
