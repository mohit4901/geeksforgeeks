export default function IntegrationsSection() {
    return (
      <section className="relative bg-[#050b14] py-32 overflow-hidden">
        
       
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] bg-[size:48px_48px]" />
  
        <div className="relative z-10 max-w-6xl mx-auto px-8">
          
        
          <div className="inline-block mb-6 px-4 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300">
            INTEGRATIONS
          </div>
  
          
          <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight max-w-4xl">
            Plug, play, and accelerate your infrastructure workflow with{" "}
            <span className="text-sky-400">300+ cloud integrations</span>
          </h2>
  
         
          <p className="mt-6 max-w-3xl text-gray-400 text-lg leading-relaxed">
            InfraSketchAI seamlessly integrates across cloud providers, DevOps tools,
            security platforms, and observability stacks — enabling real-time
            architecture design, IaC sync, and security validation without friction.
          </p>
        </div>
  
        <div className="relative z-0 mt-24 max-w-8xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-8 gap-6 opacity-80">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
              />
            ))}
          </div>
        </div>
  

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050b14]/40 to-[#050b14]" />
      </section>
    );
  }
  