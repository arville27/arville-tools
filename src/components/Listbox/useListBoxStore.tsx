import create from "zustand";

export const dropdownContent = [
  { id: 1, value: "September 2022" },
  { id: 2, value: "October 2022" },
  { id: 3, value: "November 2022" },
  { id: 4, value: "December 2022" },
  { id: 0, value: "January 2023" },
] as const;

type LogbookMonth = typeof dropdownContent[number];

type ListboxStore = {
  selectedMonth: number;
  setSelectedMonth: (selectedMonth: number) => void;
};

const currentMonth: number = new Date().getMonth();

export const useListboxStore = create<ListboxStore>((set) => ({
  selectedMonth: currentMonth,
  setSelectedMonth: (month) => set(() => ({ selectedMonth: month })),
}));
