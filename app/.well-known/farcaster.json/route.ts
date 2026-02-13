import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
    // TODO: Add your own account association
    frame: {
      version: "1",
      name: "Lotty try your luck",
      iconUrl: `${APP_URL}/images/icon.png`,
      homeUrl: `${APP_URL}`,
      imageUrl: `${APP_URL}/images/feed.png`,
      screenshotUrls: [],
      tags: ["Arb", "farcaster", "miniapp", "template"],
      primaryCategory: "developer-tools",
      buttonTitle: "Bid on Pot War",
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#ffffff",
      webhookUrl: `${APP_URL}/api/webhook`,
    },
    accountAssociation: {
        "header": "eyJmaWQiOjExMDg1NzQsInR5cGUiOiJhdXRoIiwia2V5IjoiMHhkODUzOTVERWYzZDYzM0U3ODYyOTFiZjlERTU0ZDMyNGVlYkM3OTE3In0",
        "payload": "eyJkb21haW4iOiJwb3R3YXIudmVyY2VsLmFwcCJ9",
        "signature": "7H/fBE6mXWmsfEhXBtBiEuHJwj6YTCVJ/UkwUL6FIY8iHC7u6+q2si1WpX/5h6TCD9Fxd2VysG6CTlcvgINWGBs="
    }
  };

  return NextResponse.json(farcasterConfig);
}
