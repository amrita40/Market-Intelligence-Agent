// App.jsx
import { useState } from "react";

export default function App() {
  const [tool, setTool] = useState("Analyze Website");
  const [url, setUrl] = useState("");
  const [videoQuery, setVideoQuery] = useState("");
  const [question, setQuestion] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setOutput("");

    let payload = {};
    let route = "";

    if (tool === "Analyze Website") {
      route = "/analyze-website";
      payload = { url, question };
    } else if (tool === "Ask YouTube Question") {
      route = "/ask-youtube-question";
      payload = { videoUrlOrQuery: videoQuery, question };
    } else if (tool === "Analyze LinkedIn") {
      route = "/analyze-linkedin";
      payload = { linkedinLink: linkedin };
    }

    try {
      // ✅ USE THE /api PREFIX for proxying
      const res = await fetch(`/api${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      // ✅ Structured tool call also uses /api prefix
      const structuredRes = await fetch(`/api/structured-tool`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputData: data.result }),
      });

      const structuredData = await structuredRes.json();
      setOutput(structuredData.result);
    } catch (err) {
      console.error(err);
      setOutput(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📊 Market Intelligence Agent</h1>
      <p>Select a source tool to analyze, then process its output with the Structured Tool.</p>

      <select value={tool} onChange={(e) => setTool(e.target.value)}>
        <option>Analyze Website</option>
        <option>Ask YouTube Question</option>
        <option>Analyze LinkedIn</option>
      </select>

      {tool === "Analyze Website" && (
        <>
          <div>
            <input
              type="text"
              placeholder="Website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ width: "100%", margin: "0.5rem 0" }}
            />
            <textarea
              placeholder="Question about the website content"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              style={{ width: "100%" }}
            />
          </div>
        </>
      )}

      {tool === "Ask YouTube Question" && (
        <>
          <div>
            <input
              type="text"
              placeholder="YouTube URL or Search Query"
              value={videoQuery}
              onChange={(e) => setVideoQuery(e.target.value)}
              style={{ width: "100%", margin: "0.5rem 0" }}
            />
            <textarea
              placeholder="Question about the video"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              style={{ width: "100%" }}
            />
          </div>
        </>
      )}

      {tool === "Analyze LinkedIn" && (
        <div>
          <input
            type="text"
            placeholder="LinkedIn Profile or Company URL"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            style={{ width: "100%", margin: "0.5rem 0" }}
          />
        </div>
      )}

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Processing..." : "Run Analysis"}
      </button>

      {output && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Processed Output:</h3>
          <pre style={{ background: "#f0f0f0", padding: "1rem" }}>{output}</pre>
        </div>
      )}
    </div>
  );
}
