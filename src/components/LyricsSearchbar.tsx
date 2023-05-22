import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import useDebounce from '@/utils/hooks/useDebounce';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { useState } from 'react';

const LyricsSearchbar = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery: string = useDebounce<typeof query>(query, 500);

  const hello = trpc.lyrics.searchLyrics.useQuery(
    { q: debouncedQuery },
    { enabled: debouncedQuery.length > 0, refetchOnWindowFocus: false }
  );

  return (
    <div className='flex w-full flex-col items-center justify-center px-6'>
      <div className='w-full sm:w-[36rem]'>
        <Input
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          type='text'
          placeholder='Search by artist or song title'
        />
      </div>
      {hello.isLoading && debouncedQuery.length > 0 && (
        <div className='flex flex-col gap-1 py-4'>
          <Skeleton className='h-10 w-full sm:w-[36rem]' />
          <Skeleton className='h-10 w-full sm:w-[36rem]' />
          <Skeleton className='h-10 w-full sm:w-[36rem]' />
        </div>
      )}
      <div className='flex flex-col gap-1 py-4'>
        {hello.data &&
          hello.data.map((entry, i) => (
            <Link key={i} href={`/lyrics/lyrics?url=${encodeURIComponent(entry.src)}`}>
              <Button variant='secondary' className='w-full sm:w-[36rem]'>
                {entry.artist} - {entry.title}
              </Button>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default LyricsSearchbar;
