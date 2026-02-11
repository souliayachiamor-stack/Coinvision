import React, { useEffect, useState } from "react";
import PortfolioTable from "./components/PortfolioTable";
import AddTransactionForm from "./components/AddTransactionForm";
import { calcStats } from "./utils/calculations";
import { loadPortfolio, savePortfolio } from "./utils/storage";

const ASSETS = ["BTC", "ETH", "SOL"];

export default function App() {
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [portfolio, setPortfolio] = useState(() =>
    loadPortfolio() || { BTC: [], ETH: [], SOL: [] }
  );

  const [prices, setPrices] = useState({
    BTC: 0,
    ETH: 0,
    SOL: 0,
  });

  /* ===============================
     حفظ المحفظة
  =============================== */
  useEffect(() => {
    savePortfolio(portfolio);
  }, [portfolio]);

  /* ===============================
     جلب الأسعار
  =============================== */
  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd"
        );
        const data = await res.json();

        setPrices({
          BTC: data.bitcoin.usd,
          ETH: data.ethereum.usd,
          SOL: data.solana.usd,
        });
      } catch (error) {
        console.error("Failed to fetch prices", error);
      }
    }

    fetchPrices();
  }, []);

  /* ===============================
     إضافة عملية شراء
  =============================== */
  const addTransaction = (asset, transaction) => {
    setPortfolio((prev) => ({
      ...prev,
      [asset]: [...prev[asset], transaction],
    }));
  };

  /* ===============================
     حذف عملية
  =============================== */
  const deleteTransaction = (asset, id) => {
    setPortfolio((prev) => ({
      ...prev,
      [asset]: prev[asset].filter((t) => t.id !== id),
    }));
  };

  /* ===============================
     تجهيز بيانات الجدول
  =============================== */
  const tableData = ASSETS.map((asset) => {
    const stats = calcStats(portfolio[asset], prices[asset]);
    return {
      asset,
      ...stats,
    };
  }).sort((a, b) => b.currentValue - a.currentValue);

  const selectedStats = calcStats(
    portfolio[selectedAsset],
    prices[selectedAsset]
  );

  /* ===============================
     UI
  =============================== */
  return (
    <div style={{ padding: 32, fontFamily: "Arial, sans-serif" }}>
      <h1>🚀 Coinvision – Crypto Portfolio Dashboard</h1>

      {/* جدول المحفظة */}
      <PortfolioTable data={tableData} prices={prices} />

      {/* اختيار العملة */}
      <div style={{ marginTop: 32 }}>
        <label>🪙 اختر العملة: </label>
        <select
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
        >
          {ASSETS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* إضافة استثمار */}
      <AddTransactionForm
        asset={selectedAsset}
        onAdd={addTransaction}
      />

      {/* تفاصيل العملة */}
      <div style={{ marginTop: 24 }}>
        <h3>📊 تفاصيل {selectedAsset}</h3>
        <p>إجمالي المستثمر: ${selectedStats.totalCost.toFixed(2)}</p>
        <p>متوسط الشراء: ${selectedStats.avgPrice.toFixed(2)}</p>
        <p>القيمة الحالية: ${selectedStats.currentValue.toFixed(2)}</p>
        <p
          style={{
            color: selectedStats.pnl >= 0 ? "green" : "red",
          }}
        >
          الربح / الخسارة: ${selectedStats.pnl.toFixed(2)} (
          {selectedStats.pnlPct.toFixed(2)}%)
        </p>
      </div>

      {/* سجل العمليات */}
      <div style={{ marginTop: 24 }}>
        <h3>🧾 سجل العمليات</h3>
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {portfolio[selectedAsset].map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.amount}</td>
                <td>{t.price}</td>
                <td>
                  <button
                    onClick={() =>
                      deleteTransaction(selectedAsset, t.id)
                    }
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
