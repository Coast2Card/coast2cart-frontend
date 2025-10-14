import { useEffect, useRef, useState, useMemo } from "react";
import StatCard from "../../components/admin/StatCard";
import chartIcon from "../../assets/icons/chart.png";
import personIcon from "../../assets/icons/person.png";
import lazadaSellerIcon from "../../assets/icons/lazadaseller.png";
import groupIcon from "../../assets/icons/group.png";
import ApexCharts from "apexcharts";
import { useGetAccountsQuery } from "../../services/api";

const Dashboard = () => {
  const sellerChartRef = useRef(null);
  const buyerChartRef = useRef(null);

  // UI state for controls
  const [range, setRange] = useState("Week"); // Week | Month | Year
  const [chartType, setChartType] = useState("line"); // line | bar
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Fetch buyers and sellers
  const { data: buyersData } = useGetAccountsQuery({
    role: "buyer",
    page: 1,
    limit: 1000,
  });
  const { data: sellersData } = useGetAccountsQuery({
    role: "seller",
    page: 1,
    limit: 1000,
  });

  const buyerAccounts = useMemo(() => buyersData?.accounts ?? [], [buyersData]);
  const sellerAccounts = useMemo(
    () => sellersData?.accounts ?? [],
    [sellersData]
  );

  const buyerTotal = useMemo(
    () =>
      Number(
        buyersData?.pagination?.totalAccounts ?? buyerAccounts.length ?? 0
      ),
    [buyersData, buyerAccounts]
  );
  const sellerTotal = useMemo(
    () =>
      Number(
        sellersData?.pagination?.totalAccounts ?? sellerAccounts.length ?? 0
      ),
    [sellersData, sellerAccounts]
  );

  const datasets = useMemo(() => {
    // Build datasets from createdAt timestamps
    const now = new Date();

    const toDateKey = (d) => {
      const dt = new Date(d);
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(dt.getDate()).padStart(2, "0")}`;
    };

    const groupByDayLastNDays = (accounts, nDays) => {
      const counts = new Map();
      accounts.forEach((acc) => {
        if (!acc?.createdAt) return;
        const key = toDateKey(acc.createdAt);
        counts.set(key, (counts.get(key) || 0) + 1);
      });
      const categories = [];
      const series = [];
      for (let i = nDays - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const key = toDateKey(d);
        categories.push(`${d.getMonth() + 1}/${d.getDate()}`);
        series.push(counts.get(key) || 0);
      }
      return { categories, series };
    };

    const groupByWeekLast4 = (accounts) => {
      // Approximate 7 day buckets, going back 4 weeks
      const formatLabel = (start, end) => {
        const sMonth = start.toLocaleString(undefined, { month: "short" });
        const eMonth = end.toLocaleString(undefined, { month: "short" });
        const sDay = start.getDate();
        const eDay = end.getDate();
        if (sMonth === eMonth) return `${sMonth} ${sDay}–${eDay}`;
        return `${sMonth} ${sDay}–${eMonth} ${eDay}`;
      };
      const buckets = [];
      for (let w = 3; w >= 0; w--) {
        const start = new Date(now);
        start.setDate(now.getDate() - w * 7 - 6);
        start.setHours(0, 0, 0, 0);
        const end = new Date(now);
        end.setDate(now.getDate() - w * 7);
        end.setHours(23, 59, 59, 999);
        buckets.push({ start, end, label: formatLabel(start, end) });
      }
      const series = buckets.map(
        (b) =>
          accounts.filter((a) => {
            const t = new Date(a?.createdAt || 0).getTime();
            return t >= b.start.getTime() && t <= b.end.getTime();
          }).length
      );
      return { categories: buckets.map((b) => b.label), series };
    };

    const groupByMonthYTD = (accounts) => {
      const year = now.getFullYear();
      const months = Array.from({ length: 12 }, (_, i) => i);
      const categories = [
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
      ];
      const series = months.map(
        (m) =>
          accounts.filter((a) => {
            if (!a?.createdAt) return false;
            const d = new Date(a.createdAt);
            return d.getFullYear() === year && d.getMonth() === m;
          }).length
      );
      return { categories, series };
    };

    const weekBuyers = groupByDayLastNDays(buyerAccounts, 7);
    const weekSellers = groupByDayLastNDays(sellerAccounts, 7);
    const monthBuyers = groupByWeekLast4(buyerAccounts);
    const monthSellers = groupByWeekLast4(sellerAccounts);
    const yearBuyers = groupByMonthYTD(buyerAccounts);
    const yearSellers = groupByMonthYTD(sellerAccounts);

    return {
      Week: {
        categories: weekBuyers.categories,
        sellers: weekSellers.series,
        buyers: weekBuyers.series,
      },
      Month: {
        categories: monthBuyers.categories,
        sellers: monthSellers.series,
        buyers: monthBuyers.series,
      },
      Year: {
        categories: yearBuyers.categories,
        sellers: yearSellers.series,
        buyers: yearBuyers.series,
      },
    };
  }, [buyerAccounts, sellerAccounts]);

  const stats = useMemo(() => {
    // Card values
    const totalUsers = sellerTotal + buyerTotal;

    // Current series for notes
    const current = datasets[range] || { sellers: [], buyers: [] };

    const signedPct = (previousVal, currentVal) => {
      if (previousVal === 0) {
        if (currentVal === 0) return "0%";
        return "+100%";
      }
      const change = Math.round(
        ((currentVal - previousVal) / previousVal) * 100
      );
      return `${change > 0 ? "+" : ""}${change}%`;
    };

    const sum = (arr) =>
      Array.isArray(arr) ? arr.reduce((a, b) => a + (Number(b) || 0), 0) : 0;
    const sellersAdded = sum(current.sellers);
    const buyersAdded = sum(current.buyers);
    const usersAdded = sellersAdded + buyersAdded;

    const rangeNotes = {
      Week: {
        users: `+${usersAdded} added in last 7 days`,
        sellers: `+${sellersAdded} sellers added in last 7 days`,
        buyers: `+${buyersAdded} buyers added in last 7 days`,
      },
      Month: {
        users: `+${usersAdded} added in last 4 weeks`,
        sellers: `+${sellersAdded} sellers added in last 4 weeks`,
        buyers: `+${buyersAdded} buyers added in last 4 weeks`,
      },
      Year: {
        users: `+${usersAdded} change since Jan`,
        sellers: `+${sellersAdded} sellers added this year`,
        buyers: `+${buyersAdded} buyers added this year`,
      },
    };

    // Compute current vs previous equal-length window using createdAt
    const now = new Date();
    const startEndForRange = (which) => {
      // which: 'current' | 'previous'
      if (range === "Week") {
        const end = new Date(now);
        end.setHours(23, 59, 59, 999);
        const start = new Date(end);
        start.setDate(end.getDate() - 6);
        const prevEnd = new Date(start);
        prevEnd.setDate(start.getDate() - 1);
        prevEnd.setHours(23, 59, 59, 999);
        const prevStart = new Date(prevEnd);
        prevStart.setDate(prevEnd.getDate() - 6);
        return which === "current"
          ? { start, end }
          : { start: prevStart, end: prevEnd };
      }
      if (range === "Month") {
        // Treat Month as last 28 days (4 weeks)
        const end = new Date(now);
        end.setHours(23, 59, 59, 999);
        const start = new Date(end);
        start.setDate(end.getDate() - 27);
        const prevEnd = new Date(start);
        prevEnd.setDate(start.getDate() - 1);
        prevEnd.setHours(23, 59, 59, 999);
        const prevStart = new Date(prevEnd);
        prevStart.setDate(prevEnd.getDate() - 27);
        return which === "current"
          ? { start, end }
          : { start: prevStart, end: prevEnd };
      }
      // Year: YTD vs previous year YTD through same day
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const start = new Date(end.getFullYear(), 0, 1, 0, 0, 0, 0);
      const prevEnd = new Date(end);
      prevEnd.setFullYear(end.getFullYear() - 1);
      const prevStart = new Date(start);
      prevStart.setFullYear(start.getFullYear() - 1);
      return which === "current"
        ? { start, end }
        : { start: prevStart, end: prevEnd };
    };

    const countInRange = (accounts, start, end) => {
      const s = start.getTime();
      const e = end.getTime();
      return accounts.filter((a) => {
        const t = new Date(a?.createdAt || 0).getTime();
        return t >= s && t <= e;
      }).length;
    };

    const cur = startEndForRange("current");
    const prev = startEndForRange("previous");
    const sellersCurrent = countInRange(sellerAccounts, cur.start, cur.end);
    const sellersPrev = countInRange(sellerAccounts, prev.start, prev.end);
    const buyersCurrent = countInRange(buyerAccounts, cur.start, cur.end);
    const buyersPrev = countInRange(buyerAccounts, prev.start, prev.end);
    const usersCurrent = sellersCurrent + buyersCurrent;
    const usersPrev = sellersPrev + buyersPrev;

    const compareLabel =
      range === "Week"
        ? "vs last week"
        : range === "Month"
        ? "vs last month"
        : "vs last year";

    return {
      totalUsers: {
        value: totalUsers,
        delta: `${signedPct(usersPrev, usersCurrent)} ${compareLabel}`,
        note: (rangeNotes[range] && rangeNotes[range].users) || "",
      },
      sellers: {
        value: sellerTotal,
        delta: `${signedPct(sellersPrev, sellersCurrent)} ${compareLabel}`,
        note: (rangeNotes[range] && rangeNotes[range].sellers) || "",
      },
      buyers: {
        value: buyerTotal,
        delta: `${signedPct(buyersPrev, buyersCurrent)} ${compareLabel}`,
        note: (rangeNotes[range] && rangeNotes[range].buyers) || "",
      },
    };
  }, [datasets, range, buyerTotal, sellerTotal]);

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
        categories: (datasets[range] && datasets[range].categories) || [],
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
        series: [
          {
            name: "Sellers",
            data: (datasets[range] && datasets[range].sellers) || [],
          },
        ],
      }
    );

    const buyer = new ApexCharts(document.querySelector("#buyer-line-chart"), {
      ...baseOptions,
      colors: ["#ef4444"],
      series: [
        {
          name: "Buyers",
          data: (datasets[range] && datasets[range].buyers) || [],
        },
      ],
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
                      sellerChartRef.current &&
                        sellerChartRef.current.resetSeries();
                      buyerChartRef.current &&
                        buyerChartRef.current.resetSeries();
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
          delta={stats.totalUsers.delta}
          accent="primary"
          iconSrc={personIcon}
          note={stats.totalUsers.note}
        />
        <StatCard
          title="Total Sellers"
          value={stats.sellers.value}
          delta={stats.sellers.delta}
          note={stats.sellers.note}
          accent="success"
          iconSrc={lazadaSellerIcon}
        />
        <StatCard
          title="Total Buyers"
          value={stats.buyers.value}
          delta={stats.buyers.delta}
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
