import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./BarGraph.css";

const prepareBarChartData = (data) => {
  const categoryAggregates = data.reduce((acc, item) => {
    const amount = Number(item.amount) || 0;
    acc[item.category] = acc[item.category] || {
      category: item.category,
      total: 0,
    };
    acc[item.category].total += amount;
    return acc;
  }, {});

  return Object.values(categoryAggregates)
    .sort((a, b) => b.total - a.total)
    .map((cat) => ({ name: cat.category, value: cat.total }));
};

const BarGraph = ({ data }) => {
  const chartData = prepareBarChartData(data);

  return (
    <div className="bar-graph-container">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip cursor={{ fill: "transparent" }} />
          <Bar
            dataKey="value"
            barSize={20}
            radius={[0, 10, 10, 0]}
            fill="#8884d8"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarGraph;
