export default function Footer() {
    return (
      <footer className=" border-t border-white/10 bg-[#050b14]">
        <div className="max-w-7xl mx-auto px-8 py-14">
  
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
  
            <div>
              <h3 className="text-lg font-semibold text-white">
                InfraSketch AI
              </h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
                AI-driven infrastructure design platform that converts plain
                English into secure, scalable cloud architectures with
                synchronized IaC and diagrams.
              </p>
            </div>
  
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white transition cursor-pointer">
                  Platform
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  Workspace
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  Security
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  Architecture Diagrams
                </li>
              </ul>
            </div>
  
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">
                Resources
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white transition cursor-pointer">
                  Documentation
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  Blog
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  API Reference
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  Security Guide
                </li>
              </ul>
            </div>
  
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">
                Trust & Compliance
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Design-time Security Validation</li>
                <li>IaC as Source of Truth</li>
                <li>Cloud Best Practices</li>
                <li>Explainable AI Decisions</li>
              </ul>
            </div>
          </div>
  
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <span>
              © {new Date().getFullYear()} InfraSketch AI. All rights reserved.
            </span>
  
            <div className="flex gap-6">
              <span className="hover:text-white transition cursor-pointer">
                Privacy
              </span>
              <span className="hover:text-white transition cursor-pointer">
                Terms
              </span>
              <span className="hover:text-white transition cursor-pointer">
                Contact
              </span>
            </div>
          </div>
  
        </div>
      </footer>
    );
  }
  