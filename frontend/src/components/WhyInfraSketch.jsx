import { motion } from "framer-motion";

export default function WhyInfraSketch() {
  const FEATURES = [
    {
      title: "Built by Cloud Practitioners",
      desc: "InfraSketch is built from real-world cloud architecture pain. We’ve dealt with manual diagrams, broken IaC sync, and late-stage security surprises — and fixed them.",
      cta: "Meet the team →",
    },
    {
      title: "More than Just a Diagram Tool",
      desc: "InfraSketch unifies intent parsing, architecture diagrams, Infrastructure-as-Code, and security validation into one continuous workflow.",
      cta: "Explore the platform →",
    },
    {
      title: "Simple and Intuitive",
      desc: "No cloud expertise required. Describe what you want in plain English and InfraSketch handles the complexity behind the scenes.",
      cta: "Learn how it works →",
    },
    {
      title: "Faster Time to Production",
      desc: "Generate production-ready cloud designs in minutes instead of days — with security and scalability built-in by default.",
      cta: "See the impact →",
    },
  ];

  return (
    <section className="relative bg-[#050b14] py-32 overflow-hidden">
     
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] bg-[size:48px_48px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-8">
     
        <div className="inline-block mb-6 px-4 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300">
          WHY INFRASKETCH
        </div>

        <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight max-w-4xl">
          Built beyond <span className="text-sky-400">legacy tools</span>.
          <br />
          Turn infrastructure chaos into clarity.
        </h2>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURES.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="
                relative rounded-2xl
                bg-white/5 backdrop-blur
                border border-white/10
                p-8
                hover:bg-white/10
                transition
              "
            >
              <h3 className="text-xl font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-4 text-gray-400 leading-relaxed">
                {item.desc}
              </p>

              <div className="mt-6 text-sky-400 text-sm font-medium">
                {item.cta}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050b14]/40 to-[#050b14]" />
    </section>
  );
}
