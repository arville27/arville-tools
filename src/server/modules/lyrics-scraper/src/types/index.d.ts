export type LyricSourceEntry = {
  artist: string;
  title: string;
  src: string;
};

export type LyricDataEntry = LyricSourceEntry & { lyric: string };
