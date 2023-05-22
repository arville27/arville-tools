import { create } from 'zustand';

export const MONTH_SELECT_LIST = {
  '1': {
    monthIndexBinus: 1,
    content: 'September 2022',
  },
  '2': {
    monthIndexBinus: 2,
    content: 'October 2022',
  },
  '3': {
    monthIndexBinus: 3,
    content: 'November 2022',
  },
  '4': {
    monthIndexBinus: 4,
    content: 'December 2022',
  },
  '0': {
    monthIndexBinus: 0,
    content: 'January 2023',
  },
} as const;

export type LogbookMonthIndex = keyof typeof MONTH_SELECT_LIST;
export type LogbookMonth = (typeof MONTH_SELECT_LIST)[LogbookMonthIndex];

type ListboxStore = {
  selectedMonth: LogbookMonth;
  setSelectedMonth: (logbookMonthId: LogbookMonth['monthIndexBinus']) => void;
};

export const useListboxStore = create<ListboxStore>((set) => ({
  selectedMonth: { monthIndexBinus: 0, content: 'January 2023' },
  setSelectedMonth: (logbookMonthId) =>
    set(() => ({
      selectedMonth: MONTH_SELECT_LIST[logbookMonthId],
    })),
}));
