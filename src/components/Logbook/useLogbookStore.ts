import create from "zustand";
import { persist } from "zustand/middleware";

type LogbookData = {
  uid: string;
  clockIn: string;
  clockOut: string;
  activity: string;
  description: string;
  dateFilled: string;
};
type LogbookStateStore = {
  jwt: string;
  currentLogbook: LogbookData | null;
  setJwt: (jwt: string) => void;
  setCurrentLogbook: (logbook: LogbookData | null) => void;
};

const useLogbookStateStore = create(
  persist<LogbookStateStore>(
    (set) => ({
      jwt: "",
      currentLogbook: null,
      setJwt: (jwt) => set(() => ({ jwt })),
      setCurrentLogbook: (logbook) => set(() => ({ currentLogbook: logbook })),
    }),
    { name: "logbook" }
  )
);

export default useLogbookStateStore;
