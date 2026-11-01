import { Suspense } from "react";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ReadingCommunity } from "@/components/home/ReadingCommunity";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      <Suspense fallback={<div className="h-[600px] w-full animate-pulse bg-transparent" />}>
        <HeroSlider />
      </Suspense>
      <ReadingCommunity />
    </main>
  );
}
