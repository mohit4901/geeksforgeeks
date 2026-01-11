const COLORS = {
    CRITICAL: "#dc2626",
    HIGH: "#ea580c",
    MEDIUM: "#d97706",
    LOW: "#16a34a"
  };
  
  export default function SecurityPanel({ security }) {
    const { score, violations } = security;
  
    return (
      <div className="card security">
        <h3>Security Posture</h3>
  
        <div className="score-wrapper">
          <div className="score-label">Security Score</div>
          <div className="score">{score}/100</div>
          <div className="score-bar">
            <div
              className="score-fill"
              style={{
                width: `${score}%`,
                background:
                  score >= 80 ? "#16a34a" :
                  score >= 60 ? "#d97706" :
                  "#dc2626"
              }}
            />
          </div>
        </div>
  
        <h4>Findings ({violations.length})</h4>
  
        {violations.length === 0 && (
          <p className="secure"> No security issues detected</p>
        )}
  
        <ul className="violations">
          {violations.map(v => (
            <li key={v.id} className="violation">
              <span
                className="severity"
                style={{ color: COLORS[v.severity] }}
              >
                {v.severity}
              </span>
  
              <div className="details">
                <p className="desc">{v.description}</p>
                <p className="fix"> {v.fix}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  