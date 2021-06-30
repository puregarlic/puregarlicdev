import Script from "next/script";
import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script src="/bee.js" data-api="/_hive" />
      <Component {...pageProps} />{" "}
    </>
  );
}

export default MyApp;
