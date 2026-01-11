import FloatingNodes from "../components/FloatingNodes";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import InfraInput from "../components/InfraInput";
import InfraSketchFAQ from "../components/InfraSketchFAQ";
import IntegrationsSection from "../components/IntegrationSection";
import Navbar from "../components/Navbar";
import PlatformScroller from "../components/PlatformScroller";
import WhyInfraSketch from "../components/WhyInfraSketch";

export default function Landing({ onCreate, loading }) {
  return (
    <>
      <Navbar />

      <Hero>
        <InfraInput onCreate={onCreate} loading={loading} />
      </Hero>

      <FloatingNodes />
      <PlatformScroller />
      <WhyInfraSketch />
      <IntegrationsSection />
      <InfraSketchFAQ />
      <Footer />
    </>
  );
}
