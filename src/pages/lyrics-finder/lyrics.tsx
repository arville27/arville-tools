import { useRouter } from "next/router";
import MainLayout from "../../components/MainLayout";
import { trpc } from "../../utils/trpc";

const LyricPage = () => {
  const router = useRouter();

  const { url } = router.query;

  const lyric = trpc.lyrics.getLyrics.useQuery(
    { url: url as string },
    { enabled: Boolean(url) }
  );

  if (!url) {
    return <div className="text-center text-2xl font-medium">Not found</div>;
  }

  if (typeof lyric.data === "string") {
    return (
      <div className="text-center text-2xl font-medium">
        Internal server error
      </div>
    );
  }

  return (
    <MainLayout pageTitle="Lyrics">
      <div className="container mx-auto flex items-center justify-center">
        <div className="w-11/12 md:w-3/5">
          {!lyric.data ? (
            <div className="min-w-full py-4">
              <progress className="progress progress-primary"></progress>
            </div>
          ) : (
            <>
              <div className="mb-4 text-center text-xl font-bold">
                <p>{lyric.data.title}</p>
                <p>{lyric.data.artist}</p>
              </div>
              <div className="card mb-10 bg-neutral p-4 text-xl text-neutral-content shadow-xl">
                {lyric.data.lyric.split("\n").map((paragraph, i) => {
                  if (paragraph.length === 0) return <br key={i} />;
                  return <p key={i}>{paragraph}</p>;
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default LyricPage;
