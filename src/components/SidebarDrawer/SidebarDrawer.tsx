import useDrawerStateStore from '@/components/SidebarDrawer/useDrawerStateStore';
import { Button } from '@/components/ui/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import Link from 'next/link';

type Props = {
  sidebarContent: { href: string; title: string; icon: JSX.Element }[];
};

export function SidebarDrawer({ sidebarContent }: Props) {
  const isOpen = useDrawerStateStore((state) => state.isOpen);
  const toggleDrawer = useDrawerStateStore((state) => state.toggleDrawer);

  return (
    <Sheet open={isOpen} onOpenChange={toggleDrawer}>
      <SheetContent position='left' className='w-full sm:w-80'>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <ul className='grid gap-2 py-4'>
          {sidebarContent.map((props, i) => (
            <li key={i}>
              <Link href={props.href}>
                <Button
                  variant='ghost'
                  className='flex w-full justify-start'
                  onClick={toggleDrawer}
                  key={i}>
                  {props.icon}
                  <span className='ml-6 whitespace-nowrap'>{props.title}</span>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
