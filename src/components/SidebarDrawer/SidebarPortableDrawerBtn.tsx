import useDrawerStateStore from '@/components/SidebarDrawer/useDrawerStateStore';
import { Button } from '@/components/ui/Button';
import { MenuIcon, XIcon } from 'lucide-react';

export function SidebarPortableDrawerBtn() {
  const isOpen = useDrawerStateStore((state) => state.isOpen);
  const toggleDrawer = useDrawerStateStore((state) => state.toggleDrawer);

  return (
    <Button variant='ghost' onClick={toggleDrawer}>
      {isOpen ? <XIcon /> : <MenuIcon />}
    </Button>
  );
}
