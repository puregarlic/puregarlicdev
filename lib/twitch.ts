import got from "got";

const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = process.env;

export async function getTwitchClient() {
  const { body } = await got.post<any>("https://id.twitch.tv/oauth2/token", {
    searchParams: {
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: "client_credentials",
    },
    responseType: "json",
  });

  return got.extend({
    headers: {
      Authorization: `Bearer ${body.access_token}`,
      "Client-Id": TWITCH_CLIENT_ID,
    },
    prefixUrl: "https://api.twitch.tv/helix",
  });
}
