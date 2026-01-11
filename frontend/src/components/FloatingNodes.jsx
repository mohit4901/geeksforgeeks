export default function FloatingNodes() {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-cyan-400/10 blur-2xl" />
        <div className="absolute top-[700px] right-1/4 w-32 h-32 rounded-full bg-cyan-400/40 blur-2xl" />
      </div>
    )
  }
  