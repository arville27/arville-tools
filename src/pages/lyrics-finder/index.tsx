import LyricsSearchbar from "../../components/LyricsSearchbar";
import MainLayout from "../../components/MainLayout";

export default function Home() {
  return (
    <MainLayout pageTitle="Lyrics Finder">
      <div className="container mx-auto mt-32 flex flex-col items-center">
        <LyricsSearchbar />
      </div>
    </MainLayout>
  );
}
