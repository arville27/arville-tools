import { Layout } from '@/components/Layout';
import LyricsSearchbar from '@/components/LyricsSearchbar';

export default function Home() {
  return (
    <Layout
      pageTitle='Lyrics Finder'
      className='mt-24 flex flex-col items-center sm:mt-32'>
      <h1 className='pb-12 text-center text-4xl font-bold sm:text-5xl'>Lyrics Finder</h1>
      <LyricsSearchbar />
    </Layout>
  );
}
