"use client";

import PricingPage from "@/app/pricing/page";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";
import * as React from "react";

// extends React.HTMLAttributes<HTMLDivElement>
interface HeroProps {
  title: React.ReactNode;
  subtitle?: string;
  eyebrow?: string;
  ctaText?: string;
  ctaLink?: string;
  mockupImage?: { src: string; alt: string; width: number; height: number };
  className?: string;
}

const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  ({ className, title, subtitle, eyebrow, ctaText, ctaLink, mockupImage, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col items-center", className)} {...props}>
        {eyebrow && (
          <p className="font-instrument-sans uppercase tracking-[0.51em] text-center text-sm sm:text-xl mt-52 mb-8">
            {eyebrow}
          </p>
        )}

        <h1 className="text-3xl sm:text-6xl text-center px-4">{title}</h1>

        {subtitle && (
          <p className="text-xl sm:text-3xl text-center font-instrument-sans font-light px-4 mt-6 mb-12">{subtitle}</p>
        )}

        {ctaText && ctaLink && (
          <ShimmerButton className="shadow-2xl" onClick={() => (window.location.href = "/sign-up")}>
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              {ctaText}
            </span>
          </ShimmerButton>
        )}

        {/* {mockupImage && (
          <div className="mt-20 w-full relative">
            <MockupFrame>
              <Mockup type="responsive">
                <Image
                  src={mockupImage.src}
                  alt={mockupImage.alt}
                  width={mockupImage.width}
                  height={mockupImage.height}
                  className="w-full"
                  priority
                />
              </Mockup>
            </MockupFrame>
            <div
              className="absolute bottom-0 left-0 right-0 w-full h-[303px]"
              style={{
                background: "linear-gradient(to top, #DCD5C1 0%, rgba(217, 217, 217, 0) 100%)",
                zIndex: 10,
              }}
            />
          </div>
        )} */}
        <div className="-mx-10">
          <PricingPage />
        </div>
      </div>
    );
  }
);
Hero.displayName = "Hero";

export { Hero };

