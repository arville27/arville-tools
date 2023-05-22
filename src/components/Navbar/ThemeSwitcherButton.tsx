import { Button } from '@/components/ui/Button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeSwitcherButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      variant='ghost'>
      {theme === 'light' ? 'Dark' : 'Light'}
    </Button>
  );
}
