import { motion } from "framer-motion";
import heroImage from "../assets/hero3.png";

export default function Hero({ children }) {
  return (
    <section className="relative h-screen bg-[#050c15] overflow-hidden">

      <div
        className="absolute top-0 right-0 h-full w-full md:w-[65%] bg-no-repeat bg-right bg-contain"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      <div className="absolute inset-y-0 right-0 w-[65%] bg-gradient-to-l from-[#050b14]/40 via-[#050b14]/65 to-[#050b14]" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#050b14] via-[#050b14]/90 to-transparent" />

      <div className="relative z-10 min-h-screen flex items-center px-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
            From plain English <br />
            to <span className="text-sky-400">secure cloud infrastructure</span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg">
            Instantly generate architecture diagrams, editable Infrastructure-as-Code,
            and design-time security insights — all perfectly in sync.
          </p>

          <div className="mt-10">
            {children}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
