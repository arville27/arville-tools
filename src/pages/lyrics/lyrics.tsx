import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { trpc } from '../../utils/trpc';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function LyricPage() {
  const router = useRouter();

  const { url } = router.query;

  const lyric = trpc.lyrics.getLyrics.useQuery(
    { url: String(url) },
    { enabled: Boolean(url) }
  );

  if (!Boolean(url)) {
    return <div className='text-center text-2xl font-medium'>Not found</div>;
  }

  if (typeof lyric.data === 'string') {
    return <div className='text-center text-2xl font-medium'>Internal server error</div>;
  }

  return (
    <Layout pageTitle='Lyrics'>
      <div className='container flex items-center justify-center'>
        {!lyric.data ? (
          <div className='space-y-14 py-6'>
            <div className='flex flex-col items-center space-y-4'>
              <Skeleton className='h-10 w-20' />
              <Skeleton className='h-10 w-60' />
            </div>
            <div className='mb-10 space-y-10'>
              <div className='flex flex-col items-start space-y-4'>
                <Skeleton className='h-6 w-[20rem]' />
                <Skeleton className='h-6 w-[36rem]' />
                <Skeleton className='h-6 w-[24rem]' />
                <Skeleton className='h-6 w-[20rem]' />
                <Skeleton className='h-6 w-[32rem]' />
              </div>
              <div className='flex flex-col items-start space-y-4'>
                <Skeleton className='h-6 w-[40rem]' />
                <Skeleton className='h-6 w-[28rem]' />
                <Skeleton className='h-6 w-[20rem]' />
                <Skeleton className='h-6 w-[32rem]' />
                <Skeleton className='h-6 w-[20rem]' />
              </div>
            </div>
          </div>
        ) : (
          <div className='relative my-12 w-full space-y-8'>
            <Button variant='ghost' className='absolute left-0 top-0'>
              <Link href='/lyrics'>Back</Link>
            </Button>
            <div className='flex flex-col items-center space-y-2 text-xl font-bold'>
              <p>{lyric.data.title}</p>
              <p>{lyric.data.artist}</p>
            </div>
            <Card className='mb-10'>
              <CardContent className='p-4'>
                <div className='tracking-wider'>
                  {lyric.data.lyric.split('\n').map((paragraph, i) => {
                    if (paragraph.length === 0) return <br key={i} />;
                    return <p key={i}>{paragraph}</p>;
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default LyricPage;
