import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import IssueCard from "../components/IssueCard";
import { useAuth } from "../context/AuthContext";
import { isValidUrl, normalizeUrl, saveCheckToHistory } from "../utils/helper";

export default function ReportIssue() {
  const [url, setUrl] = useState("");
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const { user } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCategories(null);

    if (!isValidUrl(url)) {
      setError("Enter a valid URL, e.g. example.com or https://example.com");
      return;
    }

    const target = normalizeUrl(url);
    setIsScanning(true);
    try {
      const res = await axiosInstance.post("/api/report/get-url", {
        url: target,
    });
      setCategories(res.data);
      saveCheckToHistory(user?.email, {
        id: `${Date.now()}`,
        url: target,
        timestamp: new Date().toISOString(),
        categories: res.data,
      });
    } catch (err) {
      const message =
        err.response?.data?.message || "Couldn't complete the check. Please try again.";
      setError(message);
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="report__header">
          <div className="dash__eyebrow">New check</div>
          <h1 className="dash__title">Run a diagnostic</h1>
          <p className="dash__sub">
            Enter a URL to measure its performance, accessibility and SEO.
          </p>
        </div>

        <form className="report__form" onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            placeholder="example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="URL to check"
          />
          <button type="submit" className="btn btn--primary" disabled={isScanning}>
            {isScanning ? "Scanning…" : "Run check"}
          </button>
        </form>

        {error && <div className="auth__error">{error}</div>}

        {isScanning && (
          <div className="scan-status">
            <span className="scan-status__dot" aria-hidden="true" />
            Running Lighthouse diagnostics — this can take up to a minute.
          </div>
        )}

        {categories && (
          <div className="results">
            {Object.values(categories).map((category) => (
              <IssueCard key={category.id} title={category.title} score={category.score} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
