import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyMrDevs from "@/components/WhyMrDevs";
import Work from "@/components/Work";
import CondensedCTA from "@/components/CondensedCTA";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Founder from "@/components/Founder";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyMrDevs />
        <Work />
        <CondensedCTA />
        <Services />
        <Process />
        <Founder />
        <Contact />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
