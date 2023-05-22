import { ThemeSwitcherButton } from '@/components/Navbar/ThemeSwitcherButton';
import { SidebarPortableDrawerBtn } from '@/components/SidebarDrawer/SidebarPortableDrawerBtn';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function Navbar() {
  return (
    <div className='border-b py-4'>
      <div className='container flex items-center justify-between'>
        <div className='flex gap-2'>
          <SidebarPortableDrawerBtn />
          <Button
            variant='ghost'
            className='hidden text-lg normal-case tracking-wider sm:inline-flex'>
            <Link href='/'>arville tools</Link>
          </Button>
        </div>
        <ThemeSwitcherButton />
      </div>
    </div>
  );
}
