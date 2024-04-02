"use client";

import Image from "next/image";
import { About } from "@/app/(home)/_components/About";
import { Cta } from "@/app/(home)/_components/Cta";
import { FAQ } from "@/app/(home)/_components/FAQ";
import { Features } from "@/app/(home)/_components/Features";
import { Footer } from "@/app/(home)/_components/Footer";
import { Hero } from "@/app/(home)/_components/Hero";
import { HowItWorks } from "@/app/(home)/_components/HowItWorks";
import { Newsletter } from "@/app/(home)/_components/Newsletter";
import { Pricing } from "@/app/(home)/_components/Pricing";
import { ScrollToTop } from "@/app/(home)/_components/ScrollToTop";
import { Services } from "@/app/(home)/_components/Services";
import { Sponsors } from "@/app/(home)/_components/Sponsors";
import { Team } from "@/app/(home)/_components/Team";
import { Testimonials } from "@/app/(home)/_components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Sponsors />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      <Testimonials />
      {/* <Team /> */}
      <Pricing />
      <Newsletter />
      <FAQ />

      <ScrollToTop />
    </>
  );
}
