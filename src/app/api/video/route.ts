import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { moneyshot } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import fs from "fs/promises";
import normalizeUrl from "normalize-url";
import { chromium } from "playwright";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(request: Request) {
  const user = await auth.api.getSession({ headers: request.headers });
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const subscriptions = await auth.api.subscriptions({
    headers: request.headers,
    //query: { referenceId: user.user.id },
  });

  console.log("subscriptions", subscriptions);

  const moneyshots = await db.query.moneyshot.findMany({
    where: and(eq(moneyshot.userId, user.user.id), eq(moneyshot.captureType, "video")),
  });

  if (moneyshots.length >= 1 && subscriptions.result.items.length === 0) {
    return new Response(JSON.stringify({ error: "You have reached the limit of your 1 free video" }), {
      status: 400,
    });
  }

  const body = await request.json();
  if (!body.websiteUrl) return new Response(JSON.stringify({ error: "Website url is required" }), { status: 400 });

  const { websiteUrl, dimensions } = body;
  const normalizedUrl = normalizeUrl(websiteUrl, { defaultProtocol: "https" });

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: dimensions?.width || 1920, height: dimensions?.height || 1080 },
      recordVideo: { dir: "/test" },
    });
    const page = await context.newPage();

    await page.goto(normalizedUrl); // { waitUntil: "networkidle" }

    const thumbnailBuffer = await page.screenshot();

    // close the browser before accessing the video
    await context.close();
    await browser.close();

    const videoPath = await page.video()!.path();
    const videoBuffer = await fs.readFile(videoPath);

    const { data: response } = await utapi.uploadFiles(new File([videoBuffer], `${crypto.randomUUID()}.webm`)); // { type: "video/webm" }
    const { data: thumbnailResponse } = await utapi.uploadFiles(
      new File([thumbnailBuffer], `${crypto.randomUUID()}.png`)
    );
    if (!response || !response.ufsUrl || !thumbnailResponse || !thumbnailResponse.ufsUrl) {
      return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
    }

    await db.insert(moneyshot).values({
      id: crypto.randomUUID(),
      userId: user.user.id,
      resultUrl: response.ufsUrl,
      captureType: "video",
      thumbnailUrl: thumbnailResponse.ufsUrl,
      websiteUrl: normalizedUrl,
      dimensions: JSON.stringify({ width: dimensions.width, height: dimensions.height }),
      width: dimensions.width,
      height: dimensions.height,
    });

    return new Response(JSON.stringify({ success: "OK", resultUrl: response.ufsUrl }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}

/*
const video = page.video();

await context.close();
await browser.close();

// Save the video to a temporary file
const videoPath = await video?.saveAs(`./${crypto.randomUUID()}.webm`);

// Read the video file as a buffer
const fs = await import("fs/promises");
const videoBuffer = await fs.readFile(videoPath);

const { data: response } = await utapi.uploadFiles(new File([videoBuffer], `${crypto.randomUUID()}.webm`)); // { type: "video/webm" }
*/
