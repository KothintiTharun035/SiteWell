import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatDate, getCheckHistory, scoreClass, scoreToPercent } from "../utils/helper";

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getCheckHistory(user?.email));
  }, [user]);

  return (
    <div className="page">
      <div className="container">
        <div className="dash__header">
          <div>
            <div className="dash__eyebrow">Dashboard</div>
            <h1 className="dash__title">
              {user?.fullName ? `Welcome back, ${user.fullName.split(" ")[0]}` : "Welcome back"}
            </h1>
            <p className="dash__sub">
              {history.length > 0
                ? `${history.length} check${history.length === 1 ? "" : "s"} on this device.`
                : "Run your first check to see results here."}
            </p>
          </div>
          <Link to="/report" className="btn btn--primary">
            Run a check
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <h3>No checks yet</h3>
            <p>Enter a URL on the check page to measure its performance, accessibility and SEO.</p>
            <Link to="/report" className="btn btn--secondary">
              Run your first check
            </Link>
          </div>
        ) : (
          <div className="history">
            {history.map((check) => (
              <div className="history-card" key={check.id}>
                <div className="history-card__url">{check.url}</div>
                <div className="history-card__date">{formatDate(check.timestamp)}</div>
                <div className="history-card__scores">
                  {Object.values(check.categories).map((category) => {
                    const percent = scoreToPercent(category.score);
                    return (
                      <div className="mini-score" key={category.id}>
                        <div className={`mini-score__value ${scoreClass(percent)}`}>
                          {percent}
                        </div>
                        <div className="mini-score__label">{category.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
