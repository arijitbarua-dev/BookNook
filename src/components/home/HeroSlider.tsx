"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules"
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  BookMarked,
  Share2,
  Star,
  Users,
} from "lucide-react"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/effect-fade"

interface SlideData {
  id: number
  tag: string
  tagIcon: React.ElementType
  heading: string
  highlightWord: string
  description: string
  buttonText: string
  buttonHref: string
  secondaryBtnText?: string
  secondaryBtnHref?: string
  image: string
  statBadge: {
    icon: React.ElementType
    title: string
    subtitle: string
  }
}

const slides: SlideData[] = [
  {
    id: 1,
    tag: "Curated Collection",
    tagIcon: Sparkles,
    heading: "Discover Your Next Great",
    highlightWord: "Read",
    description:
      "Explore a world of stories, knowledge, and inspiration. Your next favorite book is waiting for you in our digital library.",
    buttonText: "Browse Books",
    buttonHref: "/books",
    image: "/images/slider1.jpg",
    statBadge: {
      icon: Star,
      title: "4.9 / 5 Rating",
      subtitle: "Loved by 10,000+ readers",
    },
  },
  {
    id: 2,
    tag: "Daily Inspiration",
    tagIcon: BookMarked,
    heading: "A Little Reading Goes a Long",
    highlightWord: "Way",
    description:
      "Borrow your favorite books and make reading a part of your everyday life. Accessible anytime, on any device.",
    buttonText: "Browse Books",
    buttonHref: "/books",
    image: "/images/slider2.jpg",
    statBadge: {
      icon: BookOpen,
      title: "5,000+ Titles",
      subtitle: "Fiction, Science & more",
    },
  },
  {
    id: 3,
    tag: "Community Powered",
    tagIcon: Share2,
    heading: "Share Books, Share Growing",
    highlightWord: "Knowledge",
    description:
      "Add books to our growing community library and help others discover something wonderful. Learn and share together.",
    buttonText: "Browse Books",
    buttonHref: "/books",
    image: "/images/slider3.jpg",
    statBadge: {
      icon: Users,
      title: "Active Readers",
      subtitle: "Growing every day",
    },
  },
]

export function HeroSlider() {
  const [swiperInstance, setSwiperInstance] = React.useState<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const firstSlide = slides[0]
  const FirstTagIcon = firstSlide.tagIcon
  const FirstStatIcon = firstSlide.statBadge.icon

  return (
    <section className="relative w-full overflow-hidden py-6 sm:py-10 lg:py-14">
      {/* Background soft ambient accents */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#DDF0FF]/40 via-[#EAF5FF]/20 to-transparent blur-3xl dark:from-[#152244]/30 dark:via-[#1E2E56]/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Hero Card Container inspired by Reference Image 1 & 2 */}
        <div className="relative overflow-hidden rounded-3xl border border-[#E2ECF6] bg-gradient-to-br from-white via-[#F8FAFD] to-[#EBF4FC]/40 p-6 shadow-sm transition-colors duration-300 dark:border-[#24345E] dark:from-[#131C38] dark:via-[#0F172A] dark:to-[#152244] sm:p-10 lg:p-14">
          {!isMounted ? (
            /* Static Pre-rendered Shell for SSR & SEO */
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="flex flex-col items-start lg:col-span-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9F5] bg-white px-3.5 py-1.5 text-xs font-bold text-[#3155C8] shadow-2xs dark:border-[#24345E] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                  <FirstTagIcon className="size-3.5 text-[#3985F5]" />
                  <span>{firstSlide.tag}</span>
                </div>

                <h1 className="mt-5 font-heading text-3xl font-black tracking-tight text-[#243B73] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.18] dark:text-white">
                  {firstSlide.heading}{" "}
                  <span className="relative inline-block text-[#3155C8] dark:text-[#4671F6]">
                    {firstSlide.highlightWord}
                    <span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-[#A9D2F5]/60 dark:bg-[#3985F5]/40" />
                  </span>
                </h1>

                <p className="mt-4 text-base font-medium leading-relaxed text-[#60718B] sm:text-lg dark:text-[#94A3B8] max-w-xl">
                  {firstSlide.description}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3.5">
                  <Link
                    href={firstSlide.buttonHref}
                    className="inline-flex items-center gap-2.5 rounded-full bg-[#3155C8] px-7 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#243B73] dark:bg-[#3985F5]"
                  >
                    <span>{firstSlide.buttonText}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

                <div className="mt-8 flex items-center gap-4 pt-5 border-t border-[#E2ECF6] dark:border-[#24345E]/80 w-full">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EBF4FC] text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                    <BookOpen className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#3155C8] dark:text-[#93C5FD]">
                      Online Library
                    </span>
                    <span className="text-xs font-medium text-[#60718B] dark:text-[#94A3B8]">
                      Free community borrowing with 24/7 digital access.
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Clear, Full-View Illustration */}
              <div className="relative flex flex-col items-center justify-center lg:col-span-7 w-full">
                <div className="group relative w-full overflow-hidden rounded-2xl border border-[#E2ECF6] bg-white p-2.5 sm:p-3.5 shadow-md dark:border-[#24345E] dark:bg-[#152244]">
                  <div className="relative aspect-[718/262] w-full overflow-hidden rounded-xl bg-white dark:bg-white">
                    <Image
                      src={firstSlide.image}
                      alt={firstSlide.heading}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      priority
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>

                {/* Stat Badge placed cleanly underneath without covering illustration */}
                <div className="mt-3.5 inline-flex items-center gap-2.5 rounded-full border border-[#DCE9F5] bg-white px-4 py-1.5 shadow-2xs dark:border-[#24345E] dark:bg-[#152244]">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EBF4FC] text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                    <FirstStatIcon className="size-3" />
                  </div>
                  <span className="text-xs font-bold text-[#243B73] dark:text-white">
                    {firstSlide.statBadge.title}
                  </span>
                  <span className="text-xs text-[#60718B] dark:text-[#94A3B8]">
                    • {firstSlide.statBadge.subtitle}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Swiper Slider on Client */
            <Swiper
              modules={[Autoplay, Pagination, Navigation, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              speed={700}
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              onSwiper={setSwiperInstance}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              className="w-full"
            >
              {slides.map((slide) => {
                const TagIcon = slide.tagIcon
                const StatIcon = slide.statBadge.icon

                return (
                  <SwiperSlide key={slide.id}>
                    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                      {/* Left Column: Editorial Headline & Actions */}
                      <div className="flex flex-col items-start lg:col-span-5">
                        {/* Tag Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9F5] bg-white px-3.5 py-1.5 text-xs font-bold text-[#3155C8] shadow-2xs transition-colors dark:border-[#24345E] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                          <TagIcon className="size-3.5 text-[#3985F5]" />
                          <span>{slide.tag}</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="mt-5 font-heading text-3xl font-black tracking-tight text-[#243B73] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.18] dark:text-white">
                          {slide.heading}{" "}
                          <span className="relative inline-block text-[#3155C8] dark:text-[#4671F6]">
                            {slide.highlightWord}
                            <span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-[#A9D2F5]/60 dark:bg-[#3985F5]/40" />
                          </span>
                        </h1>

                        {/* Descriptive Paragraph */}
                        <p className="mt-4 text-base font-medium leading-relaxed text-[#60718B] sm:text-lg dark:text-[#94A3B8] max-w-xl">
                          {slide.description}
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-7 flex flex-wrap items-center gap-3.5">
                          <Link
                            href={slide.buttonHref}
                            className="group inline-flex items-center gap-2.5 rounded-full bg-[#3155C8] px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#243B73] hover:shadow-lg active:scale-95 dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
                          >
                            <span>{slide.buttonText}</span>
                            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                          </Link>

                          {slide.secondaryBtnText && slide.secondaryBtnHref && (
                            <Link
                              href={slide.secondaryBtnHref}
                              className="inline-flex items-center gap-2 rounded-full border border-[#DCE9F5] bg-white px-6 py-3.5 text-sm font-bold text-[#243B73] shadow-2xs transition-colors hover:bg-[#EBF4FC] dark:border-[#24345E] dark:bg-[#152244] dark:text-slate-200 dark:hover:bg-[#1E2E56]"
                            >
                              <span>{slide.secondaryBtnText}</span>
                            </Link>
                          )}
                        </div>

                        {/* Small Trust Feature / News teaser */}
                        <div className="mt-8 flex items-center gap-4 pt-5 border-t border-[#E2ECF6] dark:border-[#24345E]/80 w-full">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EBF4FC] text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                            <BookOpen className="size-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#3155C8] dark:text-[#93C5FD]">
                              Online Library
                            </span>
                            <span className="text-xs font-medium text-[#60718B] dark:text-[#94A3B8]">
                              Free community borrowing with 24/7 digital access.
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Full-View Clear Illustration */}
                      <div className="relative flex flex-col items-center justify-center lg:col-span-7 w-full">
                        <div className="group relative w-full overflow-hidden rounded-2xl border border-[#E2ECF6] bg-white p-2.5 sm:p-3.5 shadow-md transition-all duration-300 dark:border-[#24345E] dark:bg-[#152244]">
                          <div className="relative aspect-[718/262] w-full overflow-hidden rounded-xl bg-white dark:bg-white">
                            <Image
                              src={slide.image}
                              alt={slide.heading}
                              fill
                              sizes="(max-width: 1024px) 100vw, 58vw"
                              priority
                              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-102"
                            />
                          </div>
                        </div>

                        {/* Stat Badge placed cleanly underneath */}
                        <div className="mt-3.5 inline-flex items-center gap-2.5 rounded-full border border-[#DCE9F5] bg-white px-4 py-1.5 shadow-2xs dark:border-[#24345E] dark:bg-[#152244]">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EBF4FC] text-[#3155C8] dark:bg-[#1E2E56] dark:text-[#93C5FD]">
                            <StatIcon className="size-3" />
                          </div>
                          <span className="text-xs font-bold text-[#243B73] dark:text-white">
                            {slide.statBadge.title}
                          </span>
                          <span className="text-xs text-[#60718B] dark:text-[#94A3B8]">
                            • {slide.statBadge.subtitle}
                          </span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          )}

          {/* Slider Controls Bar (Bottom Left Navigation & Dots) */}
          <div className="mt-8 flex items-center justify-between border-t border-[#E2ECF6] pt-6 dark:border-[#24345E]">
            {/* Pagination Indicators (Dots / Active Pill) */}
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => swiperInstance?.slideToLoop(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "w-8 bg-[#3155C8] dark:bg-[#4671F6]"
                      : "w-2.5 bg-[#DCE9F5] hover:bg-[#A9D2F5] dark:bg-[#24345E] dark:hover:bg-[#334155]"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows (Inspired by Reference Image 1) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => swiperInstance?.slidePrev()}
                aria-label="Previous slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCE9F5] bg-white text-[#243B73] shadow-2xs transition-all duration-200 hover:border-[#3985F5] hover:bg-[#EBF4FC] hover:text-[#3155C8] active:scale-90 dark:border-[#24345E] dark:bg-[#152244] dark:text-slate-200 dark:hover:bg-[#1E2E56] dark:hover:text-[#93C5FD]"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => swiperInstance?.slideNext()}
                aria-label="Next slide"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3155C8] text-white shadow-sm transition-all duration-200 hover:bg-[#243B73] hover:shadow-md active:scale-90 dark:bg-[#3985F5] dark:hover:bg-[#3155C8]"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}