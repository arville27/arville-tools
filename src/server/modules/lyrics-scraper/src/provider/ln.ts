import cheerio from "cheerio";
import { getSources, extractUrl } from "../lib/cse";
import { LyricSourceSourceEntry, LyricDataEntry } from "../types";

const isValidSource = (src: cheerio.Root): boolean => {
  // Based on breadcrumb structure, that has "artists"
  // Sample breadcrumb
  // [
  //   'Lyrical Nonsense › Home › Artists › Official HIGE DANdism',
  //   'Lyrical Nonsense › ... › Official HIGE DANdism › Cry Baby Lyrics',
  //   'Lyrical Nonsense › Home › Artists › TOKYO SYOKI SYODO',
  //   'Lyrical Nonsense › Series'
  // ]
  const breadcrumb = src(".gs-visibleUrl-breadcrumb")
    .text()
    .trim()
    .split(/\s*›\s*/);
  const breadcrumbOutcome =
    breadcrumb.length > 2 && breadcrumb.at(-2)!.toLowerCase() === "artists";

  // Based on snippet (summary) of the content
  // <div class="gs-bidi-start-align gs-snippet" dir="ltr">
  //   2 Feb 2022 <b>...</b> Transliterated (romaji) lyrics for this song
  //   are still waiting to be completed. In the meantime, check out our
  //   Original Lyrics page.
  // </div>
  const snippetOutome = src(".gs-bidi-start-align.gs-snippet")
    .text()
    .trim()
    .includes("to be completed.");
  return breadcrumbOutcome && !snippetOutome;
};

const extractInfo = (src: cheerio.Root) => {
  // Artist - based on breadcrumb similar to "isValidSource" function
  const artist = src(".gs-visibleUrl-breadcrumb")
    .text()
    .trim()
    .split(/\s*›\s*/)
    .pop()!
    .trim();

  // Main heading of the result source with extra logic
  const rawContent = src(".gsc-thumbnail-inside a.gs-title").text().trim();
  const cleanContent = rawContent
    .slice(0, rawContent.lastIndexOf("Lyrics"))
    .trim();

  // Check if contains artist name
  const songTitleProbablyWithArtist = cleanContent.split(/\s-\s/);
  const artistNameFromContent = songTitleProbablyWithArtist
    .shift()!
    .trim()
    .toLowerCase();

  const title =
    artistNameFromContent === artist.toLowerCase()
      ? songTitleProbablyWithArtist.pop()!.trim()
      : cleanContent.trim();

  return {
    artist,
    title,
  };
};

export const getResults = async (
  query: string
): Promise<LyricSourceSourceEntry[]> => {
  const CSE_ID = "5ddc5d24693849251";
  const srcs = await getSources(query, CSE_ID);

  try {
    return srcs.filter(isValidSource).map((src) => ({
      ...extractInfo(src),
      src: extractUrl(src)!,
    }));
  } catch (error) {
    return [];
  }
};

export const extractLyrics = async (
  url: string
): Promise<LyricDataEntry | string> => {
  function extractInfoFromLyricPage($: cheerio.Root) {
    const informationContainer = $(".titletop");

    // remove unnecessary text
    informationContainer.find(".kashiwrap").remove();

    const artist = informationContainer.find(".titledet").text().trim();
    const title = informationContainer.find(".titletext").text().trim();

    return {
      artist,
      title,
    };
  }

  function extractLyric($: cheerio.Root) {
    const lyrics: string[] = [];
    $('div[id="Romaji"]')
      .find(".olyrictext")
      .children()
      .each((_, el) => {
        lyrics.push(
          $(el)
            .html()!
            .replace(/\s?<br>\s?/g, "\n")
        );
      });
    return lyrics.join("\n");
  }

  try {
    const data = await fetch(url);
    const $ = cheerio.load(await data.text());
    return {
      ...extractInfoFromLyricPage($),
      src: url,
      lyric: extractLyric($),
    };
  } catch (error) {
    console.error(error);
    return "Error";
  }
};
