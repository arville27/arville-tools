import create from "zustand";

type DrawerStateStore = {
  isOpen: boolean;
  setIsOpen: (drawerState: boolean) => void;
  toggleDrawer: () => void;
};

const useDrawerStateStore = create<DrawerStateStore>((set) => ({
  isOpen: false,
  setIsOpen: (drawerState) => {
    set(() => ({ isOpen: drawerState }));
  },
  toggleDrawer: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },
}));

export default useDrawerStateStore;
