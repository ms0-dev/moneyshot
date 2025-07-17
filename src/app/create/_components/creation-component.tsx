"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerFullscreenButton,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from "@/components/ui/video-player";
//import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, FilterIcon, LinkIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import isURL from "validator/es/lib/isURL";

type Result = {
  //id: string;
  websiteUrl: string;
  resultUrl: string;
  dimensions: { width: number; height: number };
  captureType: "screenshot" | "video";
  //createdAt: string;
  //updatedAt: string;
};

// https://gs.statcounter.com/screen-resolution-stats
const presets = [
  { label: "Desktop", value: "desktop", image: "/desktop.png", dimensions: { width: 1920, height: 1080 } },
  { label: "Mobile", value: "mobile", image: "/mobile.png", dimensions: { width: 360, height: 800 } },
];
const captureTypes = [
  { label: "Video", value: "video", image: "/video.png" },
  { label: "Screenshot", value: "screenshot", image: "/screenshot.png" },
];

export function CreationComponent() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<Result | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [captureType, setCaptureType] = useState<"screenshot" | "video">("screenshot");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setResultData(null);
    setShowFilters(false);

    if (!isURL(websiteUrl)) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
      setError("Invalid URL");
    } else {
      setIsLoading(true);

      const response = await fetch(`/api/${captureType}`, {
        method: "POST",
        body: JSON.stringify({ websiteUrl, dimensions }),
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setIsLoading(false);
      } else {
        setResultData({
          websiteUrl: websiteUrl,
          resultUrl: data.resultUrl,
          dimensions: { width: dimensions.width, height: dimensions.height },
          captureType: captureType,
        });

        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <WebsiteUrlInput
        setWebsiteUrl={setWebsiteUrl}
        websiteUrl={websiteUrl}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />

      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          className={cn("absolute z-10 -top-10 right-0 hidden sm:flex", !showFilters && "")} // motion-preset-pop keeps making my pc crash
          onClick={() => setShowFilters(!showFilters)}
        >
          <FilterIcon size={16} />
        </Button>
        <div className="border rounded bg-muted aspect-video overflow-hidden flex items-center justify-center relative">
          {isLoading && <Loader2Icon className="animate-spin" size={32} />}
          {error && <p className="text-xl sm:text-3xl text-destructive p-2">{error}</p>}

          {resultData && resultData.captureType === "screenshot" && (
            <Image
              src={resultData.resultUrl}
              alt={`screenshot for ${resultData.websiteUrl}`}
              width={resultData.dimensions.width}
              height={resultData.dimensions.height}
              className="object-contain max-w-full max-h-full"
            />
          )}
          {resultData && resultData.captureType === "video" && (
            /*<video src={resultData.resultUrl} controls className="object-contain max-w-full max-h-full"></video>*/
            <VideoPlayer className="size-full">
              <VideoPlayerContent
                crossOrigin=""
                muted
                preload="auto"
                slot="media"
                src={resultData.resultUrl}
                className="size-full bg-black pb-11"
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

          <div
            className={cn(
              "absolute border-l w-1/3 h-full overflow-auto bg-muted/90 backdrop-blur-xl transition-all ease-in-out hidden sm:flex",
              showFilters ? "right-0 duration-500" : "-right-1/3 duration-300" // positioning is simpler to close and doesnt cause crazy flickers while opening with backdrop
            )}
          >
            <Filters
              className="p-4"
              dimensions={dimensions}
              setDimensions={setDimensions}
              captureType={captureType}
              setCaptureType={setCaptureType}
            />
          </div>
        </div>
      </div>
      <Filters
        className="sm:hidden"
        dimensions={dimensions}
        setDimensions={setDimensions}
        captureType={captureType}
        setCaptureType={setCaptureType}
      />
    </div>
  );
}

function WebsiteUrlInput({
  websiteUrl,
  setWebsiteUrl,
  onSubmit,
  isLoading,
}: {
  websiteUrl: string;
  setWebsiteUrl: (websiteUrl: string) => void;
  onSubmit: (event: React.FormEvent) => void | Promise<void>;
  isLoading: boolean;
}) {
  return (
    <form className="relative sm:w-1/2 m-auto" onSubmit={onSubmit}>
      <Input
        id="website-url"
        className="peer ps-9 pe-9 rounded-full"
        placeholder="https://example.com"
        type="text"
        onChange={(event) => setWebsiteUrl(event.target.value)}
        value={websiteUrl}
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <LinkIcon size={16} />
      </div>
      <button
        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Submit search"
        type="submit"
      >
        {isLoading ? (
          <Loader2Icon size={16} className="animate-spin" />
        ) : (
          <ArrowRightIcon size={16} aria-hidden="true" />
        )}
      </button>
    </form>
  );
}

function Filters({
  className,
  dimensions,
  setDimensions,
  captureType,
  setCaptureType,
}: {
  className?: string;
  dimensions: { width: number; height: number };
  setDimensions: (dimensions: { width: number; height: number }) => void;
  captureType: "screenshot" | "video";
  setCaptureType: (captureType: "screenshot" | "video") => void;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-1.5">
        <h1 className="text-foreground font-semibold">Filters</h1>
        <p className="text-muted-foreground text-sm">
          Filters for you next MoneyShot, the current one is visible in your dashboard
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Label>MoneyShot type</Label>
          <RadioGroup
            className="grid-cols-2"
            defaultValue="screenshot"
            value={captureType}
            onValueChange={setCaptureType}
          >
            {captureTypes.map((type) => (
              <div
                key={type.value}
                className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]"
              >
                <RadioGroupItem id={type.value} value={type.value} className="sr-only" />
                <Image src={type.image} alt={type.label} width={64} height={64} />
                <label
                  htmlFor={type.value}
                  className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="width">Width</Label>
          <Input
            type="number"
            value={dimensions.width}
            onChange={(event) => setDimensions({ ...dimensions, width: Number(event.target.value) })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="height">Height</Label>
          <Input
            type="number"
            value={dimensions.height}
            onChange={(event) => setDimensions({ ...dimensions, height: Number(event.target.value) })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-8">
        <h1 className="text-center font-bold">Presets</h1>
        <RadioGroup
          className="grid-cols-2 pb-4"
          defaultValue="desktop"
          onValueChange={(value) => setDimensions(presets.find((preset) => preset.value === value)!.dimensions)}
        >
          {presets.map((preset) => (
            <div
              key={preset.value}
              className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]"
            >
              <RadioGroupItem
                id={preset.value}
                value={preset.value}
                className="sr-only"
                //checked={dimensions === preset.dimensions} always false because comparing objects
                checked={preset.dimensions.width === dimensions.width && preset.dimensions.height === dimensions.height}
              />
              <Image src={preset.image} alt={preset.label} width={64} height={64} />
              <label
                htmlFor={preset.value}
                className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
              >
                {preset.label}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
