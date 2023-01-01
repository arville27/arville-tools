import "../styles/globals.css";
import { trpc } from "../utils/trpc";
import type { AppProps, AppType } from "next/app";
import { ThemeProvider } from "next-themes";

const App: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider themes={["dracula", "light"]}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default trpc.withTRPC(App);
