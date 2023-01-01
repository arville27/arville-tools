import cheerio from "cheerio";
import { SingletonBrowser } from "../utils";

const BASE = "https://cse.google.com/cse";

export const getSources = async (keyword: string, cseId: string) => {
  const browser = await SingletonBrowser.getBrowserInstance();
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3851.0 Safari/537.36"
  );

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (["image", "stylesheet", "ping"].includes(request.resourceType()))
      request.abort();
    else request.continue();
  });

  const queryParam = new URLSearchParams({ cx: cseId, q: keyword });
  await page.goto(`${BASE}?${queryParam}`);

  if ((await page.title()).match(/error [0-9]*?/i)) {
    await page.close();
    throw Error("Invalid CSE ID");
  }

  const results = await page.$$eval(".gsc-webResult .gsc-result", (result) =>
    result.map((x) => x.outerHTML)
  );

  await page.close();

  if (results.length == 1 && extractUrl(cheerio.load(results[0])) === null) {
    return [];
  }

  return results
    .filter((x) => !x.includes("gs-spelling"))
    .map((x) => cheerio.load(x));
};

export const extractUrl = (src: cheerio.Root): string | null => {
  return src(".gs-per-result-labels").attr("url") ?? null;
};
