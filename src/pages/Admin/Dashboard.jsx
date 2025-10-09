import { useEffect, useRef, useState, useMemo } from "react";
import StatCard from "../../components/admin/StatCard";
import chartIcon from "../../assets/icons/chart.png";
import personIcon from "../../assets/icons/person.png";
import lazadaSellerIcon from "../../assets/icons/lazadaseller.png";
import groupIcon from "../../assets/icons/group.png";
import ApexCharts from "apexcharts";

const Dashboard = () => {
  const sellerChartRef = useRef(null);
  const buyerChartRef = useRef(null);

  // UI state for controls
  const [range, setRange] = useState("Week"); // Week | Month | Year
  const [chartType, setChartType] = useState("line"); // line | bar
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const datasets = {
    Week: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      sellers: [2, 3, 4, 5, 6, 6, 7],
      buyers: [6, 8, 10, 12, 14, 16, 18],
    },
    Month: {
      categories: ["W1", "W2", "W3", "W4"],
      sellers: [6, 10, 18, 24],
      buyers: [20, 35, 55, 78],
    },
    Year: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      sellers: [4, 8, 12, 18, 22, 26, 28, 30, 32, 34, 36, 38],
      buyers: [12, 26, 38, 42, 60, 70, 85, 90, 95, 100, 112, 125],
    },
  };

  const stats = useMemo(() => {
    const current = datasets[range];
    const firstSellers = current.sellers[0] || 0;
    const lastSellers = current.sellers[current.sellers.length - 1] || 0;
    const firstBuyers = current.buyers[0] || 0;
    const lastBuyers = current.buyers[current.buyers.length - 1] || 0;
    const totalUsers = lastSellers + lastBuyers;

    const pct = (from, to) => {
      if (from === 0) return to > 0 ? 100 : 0;
      return Math.round(((to - from) / from) * 100);
    };

    return {
      totalUsers: {
        value: totalUsers,
        delta: `${pct(firstSellers + firstBuyers, totalUsers)}%`,
        note:
          range === "Month"
            ? "+ change compared to first week"
            : range === "Year"
            ? "+ change since Jan"
            : "+ change since Monday",
      },
      sellers: {
        value: lastSellers,
        delta: `${pct(firstSellers, lastSellers)}%`,
        note:
          range === "Month"
            ? "+ sellers added this month"
            : range === "Year"
            ? "+ sellers added this year"
            : "+ sellers added this week",
      },
      buyers: {
        value: lastBuyers,
        delta: `${pct(firstBuyers, lastBuyers)}%`,
        note:
          range === "Month"
            ? "+ buyers added this month"
            : range === "Year"
            ? "+ buyers added this year"
            : "+ buyers added this week",
      },
    };
  }, [datasets, range]);

  useEffect(() => {
    const baseOptions = {
      chart: {
        type: chartType,
        height: 220,
        toolbar: { show: false },
        background: "#ffffff",
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      xaxis: {
        categories: datasets[range].categories,
        labels: { style: { colors: "#64748b" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { style: { colors: "#64748b" } } },
      stroke: { curve: "smooth", width: 3 },
      grid: { borderColor: "#e2e8f0" },
      legend: { show: false },
    };

    const seller = new ApexCharts(
      document.querySelector("#seller-line-chart"),
      {
        ...baseOptions,
        colors: ["#fdb815"],
        series: [{ name: "Sellers", data: datasets[range].sellers }],
      }
    );

    const buyer = new ApexCharts(document.querySelector("#buyer-line-chart"), {
      ...baseOptions,
      colors: ["#ef4444"],
      series: [{ name: "Buyers", data: datasets[range].buyers }],
    });

    seller.render();
    buyer.render();
    sellerChartRef.current = seller;
    buyerChartRef.current = buyer;

    return () => {
      try {
        sellerChartRef.current && sellerChartRef.current.destroy();
        buyerChartRef.current && buyerChartRef.current.destroy();
      } catch (_) {
        console.log("Error destroying charts:", _);
      }
    };
  }, [range, chartType]);

  const applyRange = (nextRange) => {
    setRange(nextRange);
    setIsRangeOpen(false);
  };

  const applyChartType = (nextType) => {
    setChartType(nextType);
    setIsChartOpen(false);
  };

  const refreshData = () => {
    // Simple refresh that re-applies the same state and re-inits charts via deps
    setIsMoreOpen(false);
    setRange((r) => r);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-primary">Total Users</h2>
        <div className="flex items-center gap-3 relative">
          {/* Range menu */}
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-gray-100 text-base-content/80 rounded-xl px-4 py-2"
              onClick={() =>
                setIsRangeOpen((v) => {
                  const next = !v;
                  if (next) {
                    setIsChartOpen(false);
                    setIsMoreOpen(false);
                  }
                  return next;
                })
              }
              aria-haspopup="menu"
              aria-expanded={isRangeOpen}
            >
              <span>{range}</span>
              <span className="text-base-content/60">▾</span>
            </button>
            {isRangeOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white text-base-content rounded-xl shadow-lg z-10 overflow-hidden">
                {[
                  { key: "Week", label: "Week" },
                  { key: "Month", label: "Month" },
                  { key: "Year", label: "Year" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    className={`block w-full text-left px-4 py-2 hover:bg-base-200 ${
                      range === opt.key ? "font-semibold" : ""
                    }`}
                    onClick={() => applyRange(opt.key)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chart type menu */}
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-gray-100 text-base-content/80 rounded-xl px-4 py-2"
              onClick={() =>
                setIsChartOpen((v) => {
                  const next = !v;
                  if (next) {
                    setIsRangeOpen(false);
                    setIsMoreOpen(false);
                  }
                  return next;
                })
              }
              aria-haspopup="menu"
              aria-expanded={isChartOpen}
            >
              <img src={chartIcon} alt="Chart" className="w-4 h-4" />
              <span className="text-base-content/60">▾</span>
            </button>
            {isChartOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white text-base-content rounded-xl shadow-lg z-10 overflow-hidden">
                {[
                  { key: "line", label: "Line" },
                  { key: "bar", label: "Bar" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    className={`block w-full text-left px-4 py-2 hover:bg-base-200 ${
                      chartType === opt.key ? "font-semibold" : ""
                    }`}
                    onClick={() => applyChartType(opt.key)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* More menu */}
          <div className="relative">
            <button
              className="flex items-center justify-center bg-gray-100 text-base-content/80 rounded-xl w-10 h-10"
              onClick={() =>
                setIsMoreOpen((v) => {
                  const next = !v;
                  if (next) {
                    setIsRangeOpen(false);
                    setIsChartOpen(false);
                  }
                  return next;
                })
              }
              aria-haspopup="menu"
              aria-expanded={isMoreOpen}
            >
              ⋯
            </button>
            {isMoreOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-base-content rounded-xl shadow-lg z-10 overflow-hidden">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-base-200"
                  onClick={refreshData}
                >
                  Refresh
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-base-200"
                  onClick={() => {
                    setIsMoreOpen(false);
                    try {
                      sellerChartRef.current && sellerChartRef.current.resetSeries();
                      buyerChartRef.current && buyerChartRef.current.resetSeries();
                    } catch (_) {}
                  }}
                >
                  Reset series
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.value}
          delta={`+${stats.totalUsers.delta}`}
          accent="primary"
          iconSrc={personIcon}
          note={stats.totalUsers.note}
        />
        <StatCard
          title="Total Sellers"
          value={stats.sellers.value}
          delta={`+${stats.sellers.delta}`}
          note={stats.sellers.note}
          accent="success"
          iconSrc={lazadaSellerIcon}
        />
        <StatCard
          title="Total Buyers"
          value={stats.buyers.value}
          delta={`+${stats.buyers.delta}`}
          note={stats.buyers.note}
          accent="warning"
          iconSrc={groupIcon}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className=" rounded-2xl shadow-sm border">
          <div className="flex items-center justify-between p-6">
            <h3 className="text-2xl font-bold text-primary">Total Seller</h3>
            <span className="text-sm text-base-content/70">Total Seller</span>
          </div>
          <div className="px-6 pb-6">
            <div id="seller-line-chart" />
          </div>
        </div>

        <div className=" rounded-2xl shadow-sm border">
          <div className="flex items-center justify-between p-6">
            <h3 className="text-2xl font-bold text-primary">Total Buyer</h3>
            <span className="text-sm text-base-content/70">Buyer Growth</span>
          </div>
          <div className="px-6 pb-6">
            <div id="buyer-line-chart" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
