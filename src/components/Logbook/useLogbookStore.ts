import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const LogbookDataSchema = z.object({
  uid: z.string(),
  clockIn: z.string().nonempty('Clock in cannot be empty'),
  clockOut: z.string().nonempty('Clock out cannot be empty'),
  activity: z.string().nonempty('Activity cannot be empty'),
  description: z.string().nonempty('Description cannot be empty'),
  dateFilled: z.string(),
});

export type LogbookData = z.infer<typeof LogbookDataSchema>;

export type AvailableTab = 'auth' | 'logbook-data' | 'logbook-edit';

type LogbookStore = {
  jwt: string;
  currentLogbook: LogbookData | null;
  activeTab: AvailableTab;
  setJwt: (jwt: string) => void;
  setCurrentLogbook: (logbook: LogbookData | null) => void;
  setActiveTab: (activeTab: AvailableTab) => void;
};

export const useLogbookStore = create(
  persist<LogbookStore>(
    (set) => ({
      jwt: '',
      currentLogbook: null,
      activeTab: 'auth',
      setActiveTab: (activeTab) => set(() => ({ activeTab })),
      setJwt: (jwt) => set(() => ({ jwt })),
      setCurrentLogbook: (logbook) => set(() => ({ currentLogbook: logbook })),
    }),
    {
      name: 'logbook',
    }
  )
);
