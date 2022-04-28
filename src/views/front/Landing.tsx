import Hero from "@/components/front/Hero";
import Features from "@/components/front/Features";
import JoinNow from "@/components/front/JoinNow";
import Faq from "@/components/front/Faq";
import Footer from "@/components/front/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function Landing() {
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>React SaasFrontend</title>
        </Helmet>
      </HelmetProvider>

      <div className="relative overflow-hidden bg-white dark:bg-gray-900 text-gray-800 dark:text-slate-200">
        <Hero />
        <Features className="relative z-10" />
        <JoinNow />
        <Faq />
        <Footer />
      </div>
    </div>
  );
}
