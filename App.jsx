import React from "react";

export default function App() {
  const asset = {
    name: "Ethereum",
    score: 82,
    recommendation: "استثمار جيد",
    risk: "متوسط",
    thesis:
      "Ethereum يتمتع بأساسيات قوية على المدى المتوسط والطويل بفضل نشاط التطوير العالي واعتماده الواسع في تطبيقات DeFi وNFT، مع وجود مخاطر تنظيمية متوسطة.",
    breakdown: [
      { label: "Fundamentals", value: 34 },
      { label: "Adoption", value: 16 },
      { label: "Valuation", value: 12 },
      { label: "Market Sentiment", value: 12 },
      { label: "Risk", value: 8 }
    ]
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>📊 Crypto AI Investment Dashboard</h1>

      <section style={{ marginTop: 30 }}>
        <h2>{asset.name}</h2>
        <p><strong>Investment Score:</strong> {asset.score} / 100</p>
        <p><strong>Recommendation:</strong> {asset.recommendation}</p>
        <p><strong>Risk Level:</strong> {asset.risk}</p>
      </section>

      <section style={{ marginTop: 30 }}>
        <h3>📈 Investment Score Breakdown</h3>
        {asset.breakdown.map((item) => (
          <div key={item.label} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div style={{ background: "#eee", height: 8 }}>
              <div
                style={{
                  width: `${item.value * 2.5}%`,
                  height: 8,
                  background: "#4caf50"
                }}
              />
            </div>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 30 }}>
        <h3>🧠 AI Investment Thesis</h3>
        <p>{asset.thesis}</p>
      </section>

      <section style={{ marginTop: 40, color: "green" }}>
        <strong>✔ Dashboard يعمل بنجاح</strong>
      </section>
    </div>
  );
}
