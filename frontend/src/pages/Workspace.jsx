import { useEffect, useState } from "react";
import IaCEditor from "../components/IaCEditor";
import Diagram from "../components/Diagram";
import SecurityPanel from "../components/SecurityPanel";
import GitHubModal from "../components/GitHubModal";
import MetricsPanel from "../components/MetricsPanel";
import { reEvaluateIaC, pushToGitHub, autoFixSecurity } from "../api/backend";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ValidationPipeline from "../components/ValidationPipeline";

function sanitizeTerraform(iac = "") {
  let clean = iac;

  // Remove fake file labels if AI returns them
  clean = clean.replace(
    /^\s*(provider\.tf|versions\.tf|main\.tf|output\.tf)\s*$/gim,
    ""
  );

  // Remove deprecated VPC field
  clean = clean.replace(/^\s*enable_classiclink\s*=\s*false\s*$/gim, "");

  // Remove giant / fake key pair block
  clean = clean.replace(
    /resource\s+"aws_key_pair"\s+"[^"]+"\s*{[\s\S]*?}\s*/g,
    ""
  );

  // Collapse excessive blank lines
  clean = clean.replace(/\n{3,}/g, "\n\n").trim();

  return clean;
}

export default function Workspace({ data }) {
  const [iac, setIac] = useState(
    sanitizeTerraform(data?.iac || data?.files?.["main.tf"] || "")
  );
  const [diagram, setDiagram] = useState(data?.diagram || "");
  const [security, setSecurity] = useState(
    data?.security || { score: 0, violations: [] }
  );
  const [metrics, setMetrics] = useState(data?.metrics || null);

  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [showGitModal, setShowGitModal] = useState(false);
  const [pushing, setPushing] = useState(false);

  useEffect(() => {
    setIac(sanitizeTerraform(data?.iac || data?.files?.["main.tf"] || ""));
    setDiagram(data?.diagram || "");
    setSecurity(data?.security || { score: 0, violations: [] });
    setMetrics(data?.metrics || null);
  }, [data]);

  const handleReEvaluate = async () => {
    try {
      setLoading(true);
      const res = await reEvaluateIaC(iac);
      setDiagram(res.diagram);
      setSecurity(res.security);
      setMetrics(res.metrics || null);
    } catch (err) {
      console.error(err);
      alert("Re-evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFix = async () => {
    try {
      setFixing(true);
      const res = await autoFixSecurity(iac, security?.violations || []);
      if (res?.fixedIaC) {
        setIac(sanitizeTerraform(res.fixedIaC));
        alert("Security suggestions added to Terraform");
      }
    } catch (err) {
      console.error(err);
      alert("Security auto-fix failed");
    } finally {
      setFixing(false);
    }
  };

  const handlePushToGitHub = async ({ repo, token }) => {
    try {
      setPushing(true);
      const res = await pushToGitHub({
        repo,
        terraform: iac,
        token
      });

      alert(`Terraform pushed successfully!\n${res?.data?.repoUrl || ""}`);
      setShowGitModal(false);
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.error ||
          err?.message ||
          "GitHub push failed"
      );
    } finally {
      setPushing(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-[96px] bg-[#050b14] text-white px-6 pb-10 space-y-10">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="text-xl font-semibold">
              Infrastructure Workspace
            </h1>
            <p className="text-xs text-slate-400">
              IaC • Architecture • Security Intelligence
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleReEvaluate}
              disabled={loading}
              className="px-4 py-2 text-sm rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? "Re-evaluating…" : "Re-evaluate"}
            </button>

            <button
              onClick={handleAutoFix}
              disabled={fixing || !security?.violations?.length}
              className="px-4 py-2 text-sm rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
            >
              {fixing ? "Applying…" : "Auto Fix Suggestions"}
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
            <div className="h-[520px]">
              <Diagram diagram={diagram} />
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm text-slate-400 tracking-wide">
            Infrastructure Metrics
          </h2>
          <MetricsPanel metrics={metrics} />
        </section>

        <ValidationPipeline
          model={{
            syntax: { valid: true, errors: [] },
            services: metrics ? Array(metrics.totalResources).fill({}) : []
          }}
          security={security}
          metrics={metrics}
        />

        <section className="space-y-2">
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