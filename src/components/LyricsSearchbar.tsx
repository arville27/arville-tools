import Link from "next/link";
import React, { useState } from "react";
import useDebounce from "../utils/hooks/useDebounce";
import { trpc } from "../utils/trpc";

const LyricsSearchbar = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery: string = useDebounce<typeof query>(query, 500);

  const hello = trpc.lyrics.searchLyrics.useQuery(
    { q: debouncedQuery },
    { enabled: debouncedQuery.length > 0, refetchOnWindowFocus: false }
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="pb-12 text-5xl font-bold">Lyrics Finder</h1>
      <div className="max-w-xl">
        <input
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          type="text"
          placeholder="Search by artist or song title"
          className="input-bordered input-primary input w-64 md:w-[36rem]"
        />
      </div>
      {hello.isLoading && debouncedQuery.length > 0 && (
        <div className="min-w-full py-4">
          <progress className="progress progress-primary"></progress>
        </div>
      )}
      <div className="btn-group btn-group-vertical gap-1 py-4">
        {hello.data &&
          hello.data.map((entry, i) => (
            <div key={i} className="w-64 md:w-[36rem]">
              <Link
                className="btn min-w-full normal-case"
                href={`/lyrics-finder/lyrics?url=${encodeURIComponent(
                  entry.src
                )}`}
              >
                {entry.artist} - {entry.title}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LyricsSearchbar;
