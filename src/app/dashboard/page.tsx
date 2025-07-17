import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerFullscreenButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
} from "@/components/ui/video-player";
import { getSession } from "@/hooks/get-session";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { AlertCircleIcon, ArrowRightIcon, SparklesIcon } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ActionButtons } from "./_components/action-buttons";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return redirect("/sign-in");

  const subscriptions = await auth.api.subscriptions({
    headers: await headers(),
    //query: { referenceId: session.user.id },
  });

  const moneyshots = await db.query.moneyshot.findMany();

  return (
    <div className="container max-w-screen-xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col gap-4 sm:gap-8">
        <div className="flex justify-between items-center flex-wrap sm:flex-nowrap gap-2">
          <h1
            className={cn(
              "sm:scroll-m-20 sm:text-center sm:text-4xl sm:font-extrabold sm:tracking-tight sm:text-balance",
              "scroll-m-20 text-3xl font-semibold tracking-tight"
            )}
          >
            Your MoneyShots
          </h1>
          <Button size="xl" className="rounded-full w-full sm:w-auto" asChild>
            <Link href="/create">
              <SparklesIcon />
              <span>Create New MoneyShot</span>
            </Link>
          </Button>
        </div>
        {moneyshots.length >= 5 && subscriptions.result.items.length === 0 && <WarningAlert />}

        {moneyshots ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {moneyshots.map((moneyshot, index) => (
              <Card
                key={index}
                className="aspect-video rounded-md shadow-none cursor-pointer p-0 overflow-hidden relative"
              >
                <ActionButtons moneyShot={moneyshot} />
                {moneyshot.captureType === "screenshot" ? (
                  <Image
                    src={moneyshot.resultUrl}
                    alt="MoneyShot Preview"
                    width={Number(moneyshot.width)}
                    height={Number(moneyshot.height)}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <VideoPlayer key={index} className="size-full">
                    <ActionButtons moneyShot={moneyshot} />
                    <VideoPlayerContent
                      crossOrigin=""
                      muted
                      preload="auto"
                      slot="media"
                      src={moneyshot.resultUrl}
                      className="size-full bg-black pb-11"
                      tabIndex={-1} // hydration error
                    />
                    <VideoPlayerControlBar>
                      <VideoPlayerPlayButton />
                      <VideoPlayerTimeRange />
                      <VideoPlayerTimeDisplay showDuration />
                      <VideoPlayerSeekBackwardButton className="hidden sm:block" />
                      <VideoPlayerSeekForwardButton className="hidden sm:block" />
                      <VideoPlayerFullscreenButton />
                    </VideoPlayerControlBar>
                  </VideoPlayer>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="relative">
            <ul role="list" className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <li className="h-44 rounded-lg bg-muted" />
              <li className="h-44 rounded-lg bg-muted" />
              <li className="hidden h-44 rounded-lg bg-muted sm:block" />
              <li className="hidden h-44 rounded-lg bg-muted sm:block" />
              <li className="hidden h-44 rounded-lg bg-muted sm:block" />
              <li className="hidden h-44 rounded-lg bg-muted sm:block" />
            </ul>
            <div className="absolute inset-x-0 bottom-0 flex h-32 flex-col items-center justify-center bg-gradient-to-t from-background to-transparent">
              <p className="font-medium">No MoneyShots created yet</p>
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Create your first MoneyShot to get started
              </p>
              <InteractiveHoverButton className="mt-6" href="/create">
                Create Now
              </InteractiveHoverButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WarningAlert() {
  return (
    <div className="rounded-md border border-amber-500/50 px-4 py-3 text-amber-600">
      <div className="flex gap-3">
        <AlertCircleIcon className="mt-0.5 shrink-0 opacity-60" size={16} aria-hidden="true" />
        <div className="flex grow justify-between gap-3">
          <span>
            <p className="text-sm font-medium">Please upgrade your plan!</p>
            <p className="text-sm hidden sm:block">
              You have reached your free limit, please upgrade your plan to continue using MoneyShot and support us or
              simply delete some of your MoneyShots.
            </p>
          </span>
          <Link href="/pricing" className="group text-sm font-medium whitespace-nowrap underline underline-offset-4">
            Upgrade
            <ArrowRightIcon
              className="ms-1 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5"
              size={16}
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
      <p className="text-xs px-7 pt-2 sm:hidden">
        You have reached your free limit, please upgrade your plan to continue using MoneyShot and support us or simply
        delete some of your MoneyShots.
      </p>
    </div>
  );
}
