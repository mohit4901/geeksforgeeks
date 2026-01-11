export default function PlatformScroller() {
    const PLATFORMS = [
      { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
      { name: "Microsoft Azure", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg" },
      { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
      { name: "Terraform", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Terraform_Logo.svg" },
      { name: "Kubernetes", logo: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg" },
      { name: "Docker", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg" },
      { name: "Oracle Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
      { name: "IBM Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
      { name: "DigitalOcean", logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/DigitalOcean_logo.svg" },
    ];
  
    return (
      <section className="relative py-24 bg-[#050b14] overflow-hidden">
        <h2 className="text-center text-3xl md:text-4xl font-semibold text-white mb-14">
          The platforms we are compatible with
        </h2>
  
        <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#050b14] to-transparent z-10" />
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#050b14] to-transparent z-10" />
  
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-10 whitespace-nowrap marquee">
            {[...PLATFORMS, ...PLATFORMS].map((platform, index) => (
              <div
                key={index}
                className="
                  flex items-center gap-4  min-w-[260px] h-[90px] px-6  bg-white/5 backdrop-blue  border border-white/10 rounded-xl  hover:border-indigo-400/40 hover:bg-white/10
                  transition-all duration-300 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]
                "
              >
                <img
                  src={platform.logo}
                  alt={platform.name}
                  className="h-10 w-auto object-contain"
                />
                
              </div>
            ))}
          </div>
        </div>
  
        <style>{`
          .marquee {
            animation: marquee 40s linear infinite;
          }
  
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </section>
    );
  }
  