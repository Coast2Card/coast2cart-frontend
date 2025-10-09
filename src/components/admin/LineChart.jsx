// Simple placeholder line chart using SVG to avoid extra deps
const LineChart = ({ points = [5, 12, 18, 22, 26, 30], color = "#fdb815" }) => {
  const width = 520;
  const height = 180;
  const padding = 24;
  const max = Math.max(...points) || 1;
  const stepX = (width - padding * 2) / (points.length - 1);

  const toCoords = (value, index) => {
    const x = padding + index * stepX;
    const y = height - padding - (value / max) * (height - padding * 2);
    return [x, y];
  };

  const path = points
    .map((v, i) => toCoords(v, i))
    .map(([x, y], i) => (i === 0 ? `M ${x},${y}` : `L ${x},${y}`))
    .join(" ");

  return (
    <svg width={width} height={height} className="w-full h-auto">
      <rect x="0" y="0" width={width} height={height} fill="#fff" rx="12" />
      <path d={path} stroke={color} strokeWidth="3" fill="none" />
    </svg>
  );
};

export default LineChart;
