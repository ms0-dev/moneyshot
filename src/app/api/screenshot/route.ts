import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { moneyshot } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
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

  const moneyshots = await db.query.moneyshot.findMany({
    where: and(eq(moneyshot.userId, user.user.id), eq(moneyshot.captureType, "screenshot")),
  });

  if (moneyshots.length >= 5 && subscriptions.result.items.length === 0) {
    return new Response(JSON.stringify({ error: "You have reached the limit of your 5 free screenshots" }), {
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
    });
    const page = await context.newPage();

    await page.goto(normalizedUrl); // { waitUntil: "networkidle" }

    const screenshot = await page.screenshot(); // { fullPage: true }

    const { data: response } = await utapi.uploadFiles(new File([screenshot], `${crypto.randomUUID()}.png`)); // { type: "image/png" }
    if (!response || !response.ufsUrl) {
      return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
    }

    await context.close();
    await browser.close();

    await db.insert(moneyshot).values({
      id: crypto.randomUUID(),
      userId: user.user.id,
      resultUrl: response.ufsUrl,
      captureType: "screenshot",
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
