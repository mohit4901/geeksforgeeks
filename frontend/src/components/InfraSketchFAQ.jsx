import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InfraSketchFAQ() {
  const faqs = [
    {
      q: "What is InfraSketch?",
      a: "InfraSketch is an AI-powered cloud design platform that converts plain English infrastructure requirements into architecture diagrams, Infrastructure-as-Code, and security insights — all in real time."
    },
    {
      q: "How is InfraSketch different from traditional cloud design tools?",
      a: "Traditional tools handle diagrams, IaC, or security separately. InfraSketch keeps intent, diagrams, code, and security continuously in sync, eliminating manual rework and late-stage surprises."
    },
    {
      q: "Do I need cloud expertise to use InfraSketch?",
      a: "No. InfraSketch is designed for both beginners and experts. You describe what you want in plain English, and the platform handles cloud best practices automatically."
    },
    {
      q: "Can I edit the generated infrastructure?",
      a: "Yes. Diagrams and IaC are fully editable. Any change you make stays synchronized across architecture, code, and security analysis."
    },
    {
      q: "Is InfraSketch secure for production use?",
      a: "Security is built-in by design. InfraSketch validates architectures against common cloud security risks during design time — before deployment."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="relative bg-[#050b14] py-32 overflow-hidden">
      
      
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] bg-[size:48px_48px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        
        
        <div className="inline-block mb-6 px-4 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300">
          FAQS
        </div>

      
        <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
          Have questions?
          <br />
          <span className="text-gray-300">Here’s what we hear often.</span>
        </h2>

     
        <div className="mt-16 space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur transition"
              >
            
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-lg text-white font-medium">
                    {item.q}
                  </span>

                  <span className="text-sky-400 text-2xl leading-none">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

             
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050b14]/40 to-[#050b14]" />
    </section>
  );
}
