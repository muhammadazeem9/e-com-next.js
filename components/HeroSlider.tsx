"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/images/hero.jpg",
    alt: "Autumn collection campaign",
    eyebrow: "AUTUMN 26 — NEW COLLECTION",
    description: "Wool, heavy cotton and tailoring cut for the city.",
    linkText: "Shop the collection",
  },
  {
    image: "/images/hero1.jpg",
    alt: "Modern everyday essentials",
    eyebrow: "EVERYDAY ESSENTIALS",
    description: "Thoughtful layers. Timeless silhouettes. Made to last.",
    linkText: "Explore essentials",
  },
  {
    image: "/images/hero2.jpg",
    alt: "Contemporary seasonal fashion",
    eyebrow: "THE NEW EDIT",
    description: "Discover the pieces defining the season.",
    linkText: "Discover the edit",
  },
  {
    image: "/images/hero3.jpg",
    alt: "Contemporary seasonal fashion",
    eyebrow: "THE NEW EDIT",
    description: "Discover the pieces defining the season.",
    linkText: "Discover the edit",
  },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [paused]);

  const previous = () => {
    setActive((current) => (current - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setActive((current) => (current + 1) % slides.length);
  };

  return (
    <section
      className="relative h-[85svh] min-h-[540px] overflow-hidden bg-fog"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
            active === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={active !== index}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-[50%_25%]"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-black/10" />

      <div
        className="absolute inset-x-0 bottom-0 px-5 pb-8 text-paper md:px-8 md:pb-10"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="mb-4 text-xs tracking-[0.25em]">
          {slides[active].eyebrow}
        </p>

        <div className="flex items-end justify-between gap-6">
          <p className="max-w-sm text-sm leading-6 md:text-base">
            {slides[active].description}
          </p>

          <Link
            href="/products"
            className="shrink-0 border-b border-paper pb-1 text-sm transition-opacity hover:opacity-60"
          >
            {slides[active].linkText} ↗
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/30 pt-4">
          <div className="flex items-center gap-3">
            <span className="text-xs tabular-nums">0{active + 1}</span>

            <div className="flex gap-1.5">
              {slides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={active === index ? "true" : undefined}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    active === index
                      ? "w-10 bg-white"
                      : "w-4 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>

            <span className="text-xs tabular-nums">0{slides.length}</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50 transition-colors hover:bg-white hover:text-ink"
            >
              ←
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50 transition-colors hover:bg-white hover:text-ink"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
