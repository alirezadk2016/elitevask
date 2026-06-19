import AnnouncementBar from "@/components/AnnouncementBar";
import TrustBar from "@/components/TrustBar";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Stats from "@/components/Stats";
import Steps from "@/components/Steps";
import Work from "@/components/Work";
import Extras from "@/components/Extras";
import Why from "@/components/Why";
import Info from "@/components/Info";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import GuideSection from "@/components/GuideSection";
import LocalSEO from "@/components/LocalSEO";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import Lightbox from "@/components/Lightbox";
import BookingWizard from "@/components/BookingWizard";
import SiteScripts from "@/components/SiteScripts";
import Chatbot from "@/components/Chatbot";

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <TrustBar />
      <Nav />
      <span id="top"></span>
      <Hero />
      <Pricing />
      <Stats />
      <Steps />
      <Work />
      <Extras />
      <Why />
      <Info />
      <Reviews />
      <GuideSection />
      <FAQ />
      <LocalSEO />
      <Contact />
      <Footer />
      <MobileCTA />
      <Lightbox />
      <BookingWizard />
      <Chatbot />
      <SiteScripts />
    </>
  );
}
