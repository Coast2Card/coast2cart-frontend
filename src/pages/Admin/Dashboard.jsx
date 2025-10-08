import { useEffect, useRef } from "react";
import StatCard from "../../components/admin/StatCard";
import chartIcon from "../../assets/icons/chart.png";
import personIcon from "../../assets/icons/person.png";
import lazadaSellerIcon from "../../assets/icons/lazadaseller.png";
import groupIcon from "../../assets/icons/group.png";
import ApexCharts from "apexcharts";

const Dashboard = () => {
  const sellerChartRef = useRef(null);
  const buyerChartRef = useRef(null);

  useEffect(() => {
    const baseOptions = {
      chart: {
        type: "line",
        height: 220,
        toolbar: { show: false },
        background: "#ffffff",
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
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
        series: [{ name: "Sellers", data: [4, 8, 12, 18, 22, 26, 28] }],
      }
    );

    const buyer = new ApexCharts(document.querySelector("#buyer-line-chart"), {
      ...baseOptions,
      colors: ["#ef4444"],
      series: [{ name: "Buyers", data: [12, 26, 38, 42, 60, 70, 85] }],
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
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-primary">Total Users</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-gray-100 text-base-content/80 rounded-xl px-4 py-2">
            <span>Week</span>
            <span className="text-base-content/60">▾</span>
          </button>
          <button className="flex items-center gap-2 bg-gray-100 text-base-content/80 rounded-xl px-4 py-2">
            <img src={chartIcon} alt="Chart" className="w-4 h-4" />
            <span className="text-base-content/60">▾</span>
          </button>
          <button className="flex items-center justify-center bg-gray-100 text-base-content/80 rounded-xl w-10 h-10">
            ⋯
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <StatCard
          title="Total Users"
          value={127}
          delta={"+78.5%"}
          accent="primary"
          iconSrc={personIcon}
        />
        <StatCard
          title="Total Sellers"
          value={32}
          delta={"+60.0%"}
          note={"+10 new sellers this month"}
          accent="success"
          iconSrc={lazadaSellerIcon}
        />
        <StatCard
          title="Total Buyers"
          value={95}
          delta={"+83.3%"}
          note={"+27 new buyers this month"}
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
