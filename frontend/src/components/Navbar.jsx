import { motion } from "framer-motion";

export default function Navbar() {
  const goToLanding = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur border-b border-white/10 bg-[#050b14]/80">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        <div
          onClick={goToLanding}
          className="text-xl font-semibold tracking-wide text-white cursor-pointer select-none"
        >
          InfraSketch
          <span className="text-indigo-400"> AI</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="
            px-5 py-2 rounded-lg
            border border-white/20
            text-sm text-white
            hover:bg-white/10
            transition
          "
        >
          Login / Sign up
        </motion.button>

      </div>
    </nav>
  );
}
