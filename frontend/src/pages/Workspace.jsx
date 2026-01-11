import { useState } from "react";
import IaCEditor from "../components/IaCEditor";
import Diagram from "../components/Diagram";
import SecurityPanel from "../components/SecurityPanel";
import GitHubModal from "../components/GitHubModal";
import MetricsPanel from "../components/MetricsPanel";
import { reEvaluateIaC, pushToGitHub } from "../api/backend";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ValidationPipeline from "../components/ValidationPipeline";

export default function Workspace({ data }) {
  const [iac, setIac] = useState(data.iac || "");
  const [diagram, setDiagram] = useState(data.diagram || "");
  const [security, setSecurity] = useState(data.security || {});
  const [metrics, setMetrics] = useState(data.metrics || null);

  const [loading, setLoading] = useState(false);
  const [showGitModal, setShowGitModal] = useState(false);
  const [pushing, setPushing] = useState(false);

  const handleReEvaluate = async () => {
    try {
      setLoading(true);
      const res = await reEvaluateIaC(iac);
      setDiagram(res.diagram);
      setSecurity(res.security);
      setMetrics(res.metrics || null);
    } catch {
      alert(" Re-evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePushToGitHub = async ({ repo, token }) => {
    try {
      setPushing(true);
      await pushToGitHub({ repo, iac, token });
      alert("Terraform pushed to GitHub");
      setShowGitModal(false);
    } catch {
      alert(" GitHub push failed");
    } finally {
      setPushing(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-[96px] bg-[#050b14] text-white px-6 pb-10 space-y-10">

        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="text-xl font-semibold">
              Infrastructure Workspace
            </h1>
            <p className="text-xs text-slate-400">
              IaC • Architecture • Security Intelligence
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReEvaluate}
              disabled={loading}
              className="px-4 py-2 text-sm rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? "Re-evaluating…" : "Re-evaluate"}
            </button>

            <button
              onClick={() => setShowGitModal(true)}
              className="px-4 py-2 text-sm rounded border border-white/20 hover:bg-white/10"
            >
              Push to GitHub
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="space-y-2">
            <h2 className="text-sm text-slate-400 tracking-wide">
              Infrastructure-as-Code
            </h2>
            <div className="h-[520px]">
              <IaCEditor code={iac} onChange={setIac} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm text-slate-400 tracking-wide">
              Cloud Architecture
            </h2>
            <Diagram diagram={diagram} security={security} />
          </div>

        </section>

        <section className="space-y-2">
          <h2 className="text-sm text-slate-400 tracking-wide">
            Infrastructure Metrics
          </h2>
          <MetricsPanel metrics={metrics} />
        </section>

<ValidationPipeline
  model={{ syntax: data.syntax, services: metrics ? Array(metrics.totalResources) : [] }}
  security={security}
  metrics={metrics}
/>

        <section className="space-y-2 text-black">
          <h2 className="text-sm text-slate-400 tracking-wide">
            Security & Compliance Validation
          </h2>
          <SecurityPanel security={security} />
        </section>

        {showGitModal && (
          <GitHubModal
            loading={pushing}
            onClose={() => setShowGitModal(false)}
            onPush={handlePushToGitHub}
          />
        )}

      </main>

      <Footer />
    </>
  );
}
