import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "styles/globals.scss";
import { ThemeProvider } from "next-themes";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session} refetchWhenOffline={false}>
      <ThemeProvider defaultTheme='light'>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
