import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateMetrics } from "../store/dashboardSlice";

export const useWebSocketSimulator = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(updateMetrics());
    }, 3000);

    return () => clearInterval(interval);
  }, [dispatch]);
};