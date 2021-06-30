import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import splitbee from "@splitbee/web";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    splitbee.init({
      scriptUrl: "/bee.js",
      apiUrl: "/_hive",
    });

    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head></Head>
        <body className="dark:bg-gray-900 dark:text-gray-200 transition-colors">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
