import { createContext } from "react";

export const NotificationContext = createContext<{
  notifications: { type: "SUCCESS" | "ERROR"; message: string }[];
  setNotifications: (
    notifications: { type: "SUCCESS" | "ERROR"; message: string }[]
  ) => void;
}>({
  notifications: [],
  setNotifications: () => {},
});
