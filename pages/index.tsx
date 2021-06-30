import { gql } from "urql";
import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import useDarkMode from "use-dark-mode";
import { GetStaticPropsResult } from "next";
import { getPlaiceholder } from "plaiceholder";
import { parseISO, formatDistanceToNow } from "date-fns";

import { client } from "../lib/urql";
import { getTwitchClient } from "../lib/twitch";

declare var Twitch: any;

interface Project {
  label: string;
  url: string;
}

interface Video {
  id: string;
  stream_id: string | null;
  user_id: string;
  user_name: string;
  title: string;
  description: string;
  created_at: string;
  published_at: string;
  url: string;
  thumbnail_url: string;
  blurred_thumbnail?: string;
  viewable: "public" | "private";
  view_count: number;
  language: "en";
  type: "upload" | "archive" | "highlight";
  duration: string;
  muted_segments: Array<{
    duration: number;
    offset: number;
  }>;
}

interface HomeProps {
  projects: Project[];
  videos: Video[];
}

const PROJECTS_QUERY = gql`
  {
    projects {
      label
      url
    }
  }
`;

const socials: Project[] = [
  {
    label: "Polywork",
    url: "https://poly.work/puregarlic",
  },
  {
    label: "GitHub",
    url: "https://github.com/puregarlic",
  },
  {
    label: "Twitch",
    url: "https://twitch.tv/graphitized",
  },
  {
    label: "Twitter",
    url: "https://twitter.com/puregarlic_",
  },
];

export default function Home(props: HomeProps) {
  const darkMode = useDarkMode(
    Boolean(
      typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ),
    {
      classNameDark: "dark",
      element:
        typeof document !== "undefined" ? document.documentElement : undefined,
    }
  );

  return (
    <>
      <Head>
        <title>PureGarlic</title>
      </Head>
      <main className="container relative max-w-2xl px-4 mx-auto">
        <Script
          src="https://embed.twitch.tv/embed/v1.js"
          strategy="lazyOnload"
          onLoad={() => {
            new Twitch.Embed("twitch-embed", {
              width: "100%",
              height: 400,
              channel: "graphitized",
              layout: "video",
            });
          }}
        />
        <div className="flex justify-end py-8 lg:absolute lg:top-0 lg:left-full lg:px-4 lg:py-0 lg:block">
          <div className="lg:fixed">
            <button
              className="px-3 py-2 text-sm font-bold text-gray-500 bg-gray-100 rounded hover:bg-gray-200 transition-colors active:outline dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              suppressHydrationWarning
              onClick={darkMode.toggle}
            >
              {darkMode.value ? "Light Mode!" : "Dark Mode!"}
            </button>
          </div>
        </div>
        <section className="my-24">
          <h3 className="mb-2 text-xl font-bold tracking-tight">
            Nice to meet you!
          </h3>
          <h1 className="mb-8 text-6xl font-black tracking-tight">
            I&apos;m Graham.
          </h1>
          <p className="prose-lg">
            I&apos;m a software developer and a variety games streamer. If
            I&apos;m not playing Valorant, I&apos;m probably learning about web
            technologies or software reliability. Sometimes I write about
            products that catch my interest.
          </p>
        </section>
        <section className="my-24 grid sm:grid-cols-2 gap-4">
          <section>
            <h2 className="mb-4 text-3xl font-black tracking-tight">
              Projects
            </h2>
            <div className="flex flex-wrap gap-4">
              {props.projects.map((project) => (
                <a
                  key={project.label}
                  className="px-3 py-2 font-bold text-green-700 bg-green-200 rounded transition-all hover:bg-green-300 dark:bg-green-800 dark:text-green-300 dark:hover:bg-green-700"
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.label}
                </a>
              ))}
            </div>
          </section>
          <section>
            <h2 className="mb-4 text-3xl font-black tracking-tight">Socials</h2>
            <ul className="flex flex-wrap gap-4">
              {socials.map((social) => (
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 font-bold text-pink-700 bg-pink-200 rounded transition-all hover:bg-pink-300 dark:bg-pink-800 dark:text-pink-300 dark:hover:bg-pink-700"
                  key={social.label}
                >
                  {social.label}
                </a>
              ))}
            </ul>
          </section>
        </section>
        <section className="my-24">
          <h2 className="mb-4 text-3xl font-black tracking-tight">Twitch</h2>
          <div
            style={{
              minHeight: 400,
              width: "100%",
            }}
            className="bg-black"
            id="twitch-embed"
          ></div>
          <h3 className="mt-16 mb-4 text-lg font-black tracking-tight uppercase">
            Recent Videos
          </h3>
          <section className="grid sm:grid-cols-2 gap-x-4 gap-y-8">
            {props.videos.map((video) => {
              function loader({ width }) {
                return video.thumbnail_url
                  .replace("%{width}", `${Math.min(width, 1920)}`)
                  .replace(
                    "%{height}",
                    `${Math.min(Math.ceil((width / 16) * 9), 1080)}`
                  );
              }

              return (
                <a
                  href={`https://twitch.tv/videos/${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={video.id}
                >
                  <figure className="relative h-full">
                    <p className="mb-1 text-sm font-thin tracking-wide text-gray-400">
                      {formatDistanceToNow(parseISO(video.published_at))} ago
                    </p>
                    <div className="aspect-w-16 aspect-h-9">
                      <Image
                        src="thumbnail.png"
                        loader={loader}
                        alt={video.description}
                        layout="fill"
                        placeholder="blur"
                        blurDataURL={video.blurred_thumbnail}
                        className="w-full h-full"
                      />
                    </div>
                    <figcaption className="flex flex-col justify-between">
                      <h4 className="mt-2 font-bold leading-snug tracking-tight">
                        {video.title}
                      </h4>
                    </figcaption>
                  </figure>
                </a>
              );
            })}
          </section>
        </section>
      </main>
    </>
  );
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<HomeProps>
> {
  // Project info from GraphCMS
  const { data } = await client
    .query<{ projects: Project[] }>(PROJECTS_QUERY)
    .toPromise();

  // Recent videos from Twitch
  const twitchClient = await getTwitchClient();
  const videos = await twitchClient
    .get("videos", {
      searchParams: {
        user_id: "692571414",
        first: 4,
      },
    })
    .json<{ data: Video[] }>();

  const videosWithThumbnail = [] as Video[];

  for (const video of videos.data) {
    const { base64 } = await getPlaiceholder(
      video.thumbnail_url
        .replace(`%{width}`, `${720}`)
        .replace("%{height}", `${480}`)
    );

    videosWithThumbnail.push({
      ...video,
      blurred_thumbnail: base64,
    });
  }

  return {
    props: {
      projects: data.projects ?? [],
      videos: videosWithThumbnail,
    },
    revalidate: 60 * 60,
  };
}
