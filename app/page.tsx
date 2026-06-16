import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Work />
        <Services />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
