import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col px-10">
      <Hero
        eyebrow="INTRODUCING MoneyShot"
        title={
          <>
            <div>
              <span className="font-instrument-serif font-normal">Beautiful, </span>
              <span className="font-instrument-serif font-normal italic">MoneyShots </span>
              <span className="font-instrument-serif font-normal">just</span>
            </div>
            <div className="font-instrument-serif font-normal">a click away</div>
          </>
        }
        subtitle="MoneyShot takes beautiful screenshots and videos"
        ctaText="Get Started"
        ctaLink="/sign-up"
        mockupImage={{
          src: "https://www.notion.com/_next/image?url=/front-static/pages/calendar/notion-calendar-desktop-v2.png&w=2048&q=75",
          alt: "Notion Calendar Interface",
          width: 1274,
          height: 1043,
        }}
      />
    </main>
  );
}
