export type LyricSourceSourceEntry = {
  artist: string;
  title: string;
  src: string;
};

export type LyricDataEntry = LyricSourceSourceEntry & { lyric: string };
