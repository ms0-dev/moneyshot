"use client";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";

const pricingPlans = [
  {
    name: "Free",
    description: "Get started with our free plan and explore our features.",
    monthlyPrice: 0,
    annualPrice: 0,
    link: "#",
    features: ["5 screenshots", "1 video"],
  },
  {
    name: "Professional",
    description: "Unlock enhanced features and premium content to supercharge your business and support us.",
    monthlyPrice: 9.99,
    annualPrice: 100,
    link: "#",
    features: ["Support MoneyShot", "Unlimited screenshots", "Unlimited videos"],
  },
  {
    name: "Lifetime",
    description: "Help MoneyShot grow and support us while grabbing lifetime access.",
    lifetimePrice: 250,
    link: "#",
    features: [
      "Hugely support MoneyShot",
      "Lifetime access",
      "Unlimited screenshots",
      "Unlimited videos",
      "100GB storage",
    ],
  },
];

export const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"M" | "A">("M");

  const Heading = () => (
    <div className="relative z-10 my-12 flex flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-start justify-center space-y-4 md:items-center">
        <div className="mb-2 inline-block rounded-full bg-red-100 px-2 py-[0.20rem] text-xs font-medium uppercase text-red-500 dark:bg-red-200">
          {" "}
          Pricing
        </div>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl dark:text-gray-200">
          Fair pricing, unfair advantage.
        </p>
        <p className="text-md max-w-xl text-gray-700 md:text-center dark:text-gray-300">
          Get started with MoneyShot today and take your business to the next level.
        </p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setBillingCycle("M")}
          className={cn(
            `rounded-lg px-4 py-2 text-sm font-medium `,
            billingCycle === "M"
              ? "relative bg-red-500 text-white "
              : "text-gray-700 hover:bg-red-100 dark:text-gray-300 dark:hover:text-black"
          )}
        >
          Monthly
          {billingCycle === "M" && <BackgroundShift shiftKey="monthly" />}
        </button>
        <button
          onClick={() => setBillingCycle("A")}
          className={cn(
            `rounded-lg px-4 py-2 text-sm font-medium `,
            billingCycle === "A"
              ? "relative bg-red-500 text-white "
              : "text-gray-700 hover:bg-red-100 dark:text-gray-300 dark:hover:text-black"
          )}
        >
          Annual
          {billingCycle === "A" && <BackgroundShift shiftKey="annual" />}
        </button>
      </div>
    </div>
  );

  const PricingCards = () => (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:gap-4">
      {pricingPlans.map((plan, index) => (
        <div key={index} className="w-full rounded-xl border-[1px] border-gray-300 p-6 text-left dark:border-gray-600">
          <p className="mb-1 mt-0 text-sm font-medium uppercase text-red-500">{plan.name}</p>
          <p className="my-0 mb-6 text-sm text-gray-600">{plan.description}</p>
          <div className="mb-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={billingCycle === "M" ? "monthly" : "annual"}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="my-0 text-3xl font-semibold text-gray-900 dark:text-gray-100"
              >
                {plan.name !== "Lifetime" && (
                  <span>${billingCycle === "M" ? plan.monthlyPrice : plan.annualPrice}</span>
                )}
                {plan.name !== "Lifetime" && (
                  <span className="text-sm font-medium">/{billingCycle === "M" ? "month" : "year"}</span>
                )}
                {plan.name === "Lifetime" && <span>${plan.lifetimePrice}</span>}
                {plan.name === "Lifetime" && <span className="text-sm font-medium">/once</span>}
              </motion.p>
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.985 }}
              onClick={async () => {
                //window.open(plan.link);
                const { data: session } = await authClient.getSession();
                if (!session) {
                  console.log("must be logged in");
                  window.open("/sign-up", "_self");
                } else {
                  if (plan.name === "Professional") {
                    await authClient.checkout({ slug: "pro" });
                  } else if (plan.name === "Lifetime") {
                    await authClient.checkout({ slug: "lifetime" });
                  } else {
                    window.open("/dashboard", "_self");
                  }
                }
              }}
              className="mt-8 w-full rounded-lg bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-500/90"
            >
              Get Started
            </motion.button>
          </div>
          {plan.features.map((feature, idx) => (
            <div key={idx} className="mb-3 flex items-center gap-2">
              <Check className="text-red-500" size={18} />
              <span className="text-sm text-gray-600">{feature}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <section className="relative w-full overflow-hidden  py-12 text-black lg:px-2 lg:py-12">
      <Heading />
      <PricingCards />
    </section>
  );
};

const BackgroundShift = ({ shiftKey }: { shiftKey: string }) => (
  <motion.span
    key={shiftKey}
    layoutId="bg-shift"
    className="absolute inset-0 -z-10 rounded-lg bg-red-500"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
  />
);
